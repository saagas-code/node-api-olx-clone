import { Request, Response } from 'express';
import { Ad, AdType } from '../models/Ad';
import { Category } from '../models/Category';
import { State } from '../models/State';
import { User } from '../models/User';
import dotenv from 'dotenv'
import { unlink } from 'fs/promises';
import sharp from 'sharp';
import { Image } from '../models/Image';
import { v4 } from 'uuid';
import { Op } from 'sequelize';

dotenv.config()

type ad = {
    id: number,
    idUser: number,
    idState: number,
    idCategory: number,
    dateCreated: Date,
    title: string,
    price: number,
    priceNegotiable: boolean,
    description: string,
    views: number,
    status: string
}

export const getAds = async (req: Request, res: Response)=>{
    let states = await Ad.findAll({include: [State,Category,Image],})
    return states.length > 0
    ?res.status(200).json(states)
    :res.status(204).send()
};

export const getCategories = async (req: Request, res: Response)=>{
    const cats = await Category.findAll({raw: true});

    let categories: any[] = [];

    for(let i in cats) {
        categories.push({
            ...cats[i],
            img: `${process.env.BASE}/assets/images/${cats[i].slug}.png`
        })
    }

    res.json({categories});
};

export const addAction = async (req: Request, res: Response)=>{
    let {title, price, priceNegotiable, description, idCategory, idUser } = req.body
    const files = req.files as Express.Multer.File[]
    
    const user = await User.findOne({where: {id: idUser}})

    if(!user) {
        return res.json({error: 'Usuário não encontrado.'})
    }

    if(!title || !idCategory ) {
        return res.json({error: 'Titulo e/ou categoria não foram preenchidos.'});
    }

    if(files.length <= 0) {
        return res.json({error: 'Envie no minimo uma imagem do seu produto'})
    }

    if(price) {
        price = price.replace('.', '').replace(',', '.').replace('R$ ', '');
        price = parseFloat(price);
    } else {
        price = 0;
    }


    const category = await Category.findByPk(idCategory)
    if(!category) {
        return res.json({error: 'Categoria não encontrada!'})
    }

    const refer = new Date().valueOf();

    const newAd = await Ad.create({
        status: true,
        idUser: user?.id,
        idState: user?.idState,
        idCategory,
        dateCreated: new Date(),
        title,
        price,
        priceNegotiable: (priceNegotiable=='true') ? true : false,
        description,
        views: 0
    });

    for(let i in files) {
        const name: string = `${v4()}`;
        
        await sharp(files[i].path)
            .resize(500, 500, { fit: 'contain' })
            .toFormat('jpg')
            .toFile(`./public/media/${name}.jpg`);
        if(parseInt(i) == 0) {
            await Image.create({
                idAd: newAd.id,
                url: `${name}.jpg`,
                default: true,
                location: `${process.env.BASE}/media/${name}.jpg`
            })
        }
        if(parseInt(i) > 0) {
            await Image.create({
                idAd: newAd.id,
                url: `${name}.jpg`,
                default: false,
                location: `${process.env.BASE}/media/${name}.jpg`
            })
        }
        await unlink(files[i].path)
    
    }
    return res.json({result: 'Anuncio adicionado com sucesso!', id: newAd.id})


};

export const getList = async (req: Request, res: Response)=>{
    let { sort = 'asc', offset = 0, limit = 8, q, cat, state } = req.query;
    let offsetAsNumber = Number.parseInt(offset as any)
    let limitAsNumber = Number.parseInt(limit as any)

    let filter = [] as any
    filter.push({status: true});

    if(q) {
        filter.push({title: {[Op.like]: `%${q}%`}})
    }
    if(cat) {
        const c = await Category.findOne({where: {id: cat}})
        if(c) {
            filter.push({idCategory: c.id.toString()})
        }
    }
    if(state) {
        const s = await State.findOne({where: {id: state}})
        if(s) {
            filter.push({idState: s.id})
        }
    }
    const adsTotal = await Ad.findAll({where: filter})
    const total = adsTotal.length



    const adsData = await Ad.findAll({
        where: filter,
        include: [State, Category, Image, User],
        order: [['dateCreated', sort as string]],
        offset: offsetAsNumber,
        limit: limitAsNumber
    })
    let ads = [] as any

    return res.json({adsData, total});
};


export const getItem = async (req: Request, res: Response)=>{
    let {other = null} = req.query
    let {id} = req.params

    if(!id) {
        return res.json({error: 'ID Não identificado'});
    }

    const ad = await Ad.findByPk(id, {include: [State, Category, Image, User]});
    if(!ad) {
        return res.json({error: 'Anuncio não encontrado.'})
    }

    await ad.increment('views', {by: 1});

    type OthersType = {
        id: number;
        title: string;
        price: number;
        priceNegotiable: boolean;
        image: string
    }

    const others = [] as OthersType[]
    
        const otherData = await Ad.findAll({where: {idUser: ad.idUser, status: true}, limit: 8, include: Image }) as any
        for(let i in otherData) {
            if(otherData[i].id != ad.id) {
                others.push(otherData[i])
            }
        }
        

    return res.json({ad, others})

};

export const editAction = async (req: Request, res: Response)=>{
    let {id} = req.params
    let {title, price, priceneg, desc, cat, images, status, idUser } = req.body;
    const files = req.files as Express.Multer.File[]

    if(!id) {
        return res.json({error: 'ID Inválido.'})
    }

    const ad = await Ad.findByPk(id)
    if(!ad) {
        return res.json({error: 'Anúncio inexistente.'})
    }

    const user = await User.findOne({where: {id: idUser}})
    if(user?.id !== ad?.idUser) {
        return res.json({error: 'Este anúncio não é seu'})
    }

    let updates = {} as any;

    if(title) {
        updates.title = title;
    }
    if(price) {
        price = price.replace('.', '').replace(',', '.').replace('R$ ', '');
        price = parseFloat(price);
        updates.price = price
    }
    if(priceneg) {
        updates.priceNegotiable = priceneg
    }
    if(status) {
        updates.status = (status == 'true' ? 1:0);
    }
    if(desc) {
        updates.description = desc;
    }
    if(cat) {
        const category = await Category.findOne({where: {id: cat}})
        if(!category) {
            return res.json({error: 'Categoria inexistente'});
        }
        updates.idCategory = cat
    }

    await Ad.update(updates, {where: {
        id: id
    }})

    if(files.length > 0) {
        
        for(let i in files) {
            const name: string = `${v4()}`;
            
            await sharp(files[i].path)
                .resize(500, 500, { fit: 'contain' })
                .toFormat('jpg')
                .toFile(`./public/media/${name}.jpg`);

            await Image.create({
                idAd: ad.id,
                url: `${name}.jpg`,
                default: false,
                location: `${process.env.BASE}/media/${name}.jpg`
            })
            
            await unlink(files[i].path)
        
        }
    }



    return res.json({result: 'Anuncio editado com sucesso.'});
};

export const deleteAction = async (req: Request, res: Response)=>{
    let { id } = req.body

    let ad = await Ad.findOne({
        where: {id: id}
    });
    if(ad) {
        await Ad.destroy({where: {id:id}})
        return res.json({result: 'Anuncio deletado com sucesso..'})
    }


    return res.json({error: 'Anúncio não encontrado..'})
};

