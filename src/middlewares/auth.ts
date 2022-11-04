import {Request, Response, NextFunction} from 'express'
import dotenv from 'dotenv'
import JWT, { JwtPayload } from 'jsonwebtoken'
import { User } from '../models/User'

declare global {
    namespace Express {
        interface Request {
        id?: Record<number,any>,
        token?: string
    }
}
}

dotenv.config()

const bcrypt = require('bcrypt');


export const Auth = {
    private: async (req: Request, res: Response, next: NextFunction) => {
        let sucess = false;

        if(req.headers.authorization) {
    
            const [authType, token] = req.headers.authorization.split(' ')
            if(authType === 'Bearer') {
                try {
                    const decoded =  JWT.verify(
                        token,
                        process.env.JWT_SECRET_KEY as string
                    ) as JwtPayload
                    req.id =  decoded.id,
                    req.token = token
                    sucess = true

                    
                } catch(err) {
                    
                }
            }
        }
        if(sucess) {
            next();
        } else {
            res.status(403); // Not Authorized
            res.json({error: 'Não autorizado'})
        }

        
    }
}

export const createPasswordHash = async (password: string) => {
  await bcrypt.hash(password, 10);
}