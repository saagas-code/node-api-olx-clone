import {Request, Response, NextFunction} from 'express'
import {checkSchema} from 'express-validator';

export const AuthValidator = {
    signup: checkSchema({
        name: {
            trim: true,
            notEmpty:  true,
            isLength: {
                options: { min: 2 },
                errorMessage: 'Nome precisa ter pelomenos 2 caracteres'
            },
            
        },
        email: {
            isEmail: true,
            normalizeEmail: true,
            errorMessage: 'E-mail inválido'
        },
        password: {
            notEmpty: true,
            isLength: {
                options: {min:2}
            },
            errorMessage: 'Senha precisa ter pelo menos 2 caracteres'
        },
        idState: {
            notEmpty: true,
            errorMessage: 'Estado não preenchido'
        }
    }),
    signin: checkSchema({
        email: {
            isEmail: true,
            normalizeEmail: true,
            notEmpty: true,
            errorMessage: 'Preencha este campo'
        },
        password: {
            notEmpty: true,
            errorMessage: 'Preencha este campo'
        }
    }),

}


    