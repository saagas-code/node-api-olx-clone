import { Request, Response } from 'express';
import { Ad } from './../models/Ad';
import { Image } from '../models/Image';


export const getImages = async (req: Request, res: Response)=>{
    let {id, idAd} = req.body

    if(!id) {
        return res.json({error: 'Usuário não identificado'})
    }
    if(!idAd) {
        return res.json({error: 'Anúncio não encontrado.'})
    }

    const images = await Image.findAll({where: {idAd}});

    res.json({images});
};

export const deleteImage = async (req: Request, res: Response)=>{
    let { id, idAd, idUser } = req.body

    const images = await Image.findAll({
        where: {idAd}
    });

    if(images.length <= 1) {
        return res.json({error: 'Você precisa ter ao menos 1 imagem'})
    }

    const ad = await Ad.findOne({where: {id: idAd}})

    if(ad?.idUser != idUser ) {
        return res.json({result: 'Esta imagem não pertence a você.'})
    }

    if(images) {

        let image = await Image.destroy({where: {id}})

        const images2 = await Image.findAll({where: {idAd: idAd}});
        let imagesTrue = []

        for(let i in images2) {
            if(images2[i].default) {
                imagesTrue.push(images2[i])
            }
        }
        if(imagesTrue.length == 0) {
            const index = images2[0].id
            const img = Image.update({default: 1}, {where: {id: index}})
            const imgs = await Image.findAll();
            return res.json({result: 'Imagem deletado com sucesso..', imgs})
        }
        return res.json({result: 'Imagem deletado com sucesso..', images, images2, imagesTrue ,imagesL: imagesTrue.length})
    }

    return res.json({error: 'Imagem não encontrada'})
    
};
