import { Request, Response } from 'express';
import { Ad } from '../models/Ad';
import { Category } from '../models/Category';
import { State } from '../models/State';

import { validationResult, matchedData } from 'express-validator';
import { User } from '../models/User';
import { Image } from '../models/Image';



export const getStates = async (req: Request, res: Response)=>{
    let states = await State.findAll()
    return states.length > 0
    ?res.status(200).json(states)
    :res.status(204).send()
};

export const info = async (req: Request, res: Response)=>{
    const {id} = req.query

    const user = await User.findByPk(id as unknown as number, {include: [State]})
    const ads = await Ad.findAll(
        {where:
            {idUser: id},
            include: [Category, Image]
        }
    )
    return res.json({
        user, ads
    })
};

export const editAction = async (req: Request, res: Response)=>{
    const errors = validationResult(req);
    let {id, name, email, password, idState} = req.body
    if(!errors.isEmpty()) {
        return res.json({error: errors.mapped()});
    }
    const data = matchedData(req);

    if(data.email) {
        const hasEmail = await User.findOne({where: {email: data.email}})
        if(hasEmail) {
            if(hasEmail.id != data.id) {
                return res.json({error: {email: {msg: 'E-mail já existente.'}}})
            }
        }
    }

    const editUser = await User.update(data, {
        where: {id: id}
    })

    res.json({msg: 'Dados editados com sucesso !'})
};