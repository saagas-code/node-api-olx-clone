import { Request, Response } from 'express';
import JWT from 'jsonwebtoken'
import dotenv from 'dotenv'
import {User} from '../models/User'
import {validationResult, matchedData} from 'express-validator'
import { State } from '../models/State';
const bcrypt = require('bcrypt');
dotenv.config()

export const signin = async (req: Request, res: Response)=>{
    const errors = validationResult(req);
    let {name, email, password, state} = req.body
    if(!errors.isEmpty()) {
        return res.status(404).json({error: errors.mapped()});
    }
    const data = matchedData(req);

    const user = await User.findOne({where: {email: data.email}})
    if(!user) {
        return res.json({error: 'E-mail e/ou senha errados!'});
    }

    const match = await bcrypt.compare(data.password, user.password);
    if(!match) {
        return res.json({error: 'Email e/ou senha errados!'});
    }
    const token = JWT.sign(
        {id: user.id, email: user.email},
        process.env.JWT_SECRET_KEY as string,
        {expiresIn: '9999h'}
    )
    user.update(token ,{where: {email: email}})
    return res.json({status: true, token})



};

export const signup = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(404).json({error: errors.mapped()});
    }
    const data = matchedData(req);
    const hasUser = await User.findOne({where: {
        email: data.email
    }})
    if(hasUser) {
        return res.json({error: {email:{msg: 'E-mail já existente'}}})
    }

    const hasState = await State.findOne({where: {id: data.idState}})
    if(!hasState) {
        return res.json({error: 'Estado não encontrado.'})
    }

    const passHash = await bcrypt.hash(data.password, 10)

    const newUser = await User.create({
        name: data.name,
        email: data.email,
        password: passHash,
        idState: data.idState
    })

    const token = JWT.sign(
        {id: newUser.id, email: newUser.email},
        process.env.JWT_SECRET_KEY as string,
        {expiresIn: 300}
    )

    res.status(200).json({status: true, result: 'Conta criada com sucesso!', token})
}

export const AccountREQUEST = async (req: Request, res: Response) => {
    const id = req.id
    const token = req.token
    if(!token) {
        return res.json({error: 'Token não encontrado'})
    }
    let user = await User.findOne({
        where: {
            id
        }
    });
    if(!user) {
        return res.json({error: 'Usuário não encontrado'})
    }

    return res.json({user})
    
}

