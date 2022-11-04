import {Request, Response, NextFunction} from 'express'
import {checkSchema} from 'express-validator';

export const UserValidator = {
    editAction: checkSchema({
        id: {
            optional: true
        },
        name: {
            optional: true,
            trim: true,
            notEmpty:  true,
            isLength: {
                options: { min: 2 },
                errorMessage: 'Nome precisa ter pelomenos 2 caracteres'
            },
            
        },
        email: {
            optional: true,
            isEmail: true,
            normalizeEmail: true,
            errorMessage: 'E-mail inválido'
        },
        password: {
            optional: true,
            notEmpty: true,
            isLength: {
                options: {min:2}
            },
            errorMessage: 'Senha precisa ter pelo menos 2 caracteres'
        },
        idState: {
            optional: true,
            notEmpty: true,
            errorMessage: 'Estado não preenchido'
        }
    }),

}


    