import multer from "multer";
import { v4 } from 'uuid';


const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './tmp')
    },
    filename: (req, file, cb) => {
        cb(null, `${v4()}.jpg`)
    }
})

export const upload = multer({
    fileFilter: (req, file, cb) => {
        const allowed: string[] = ['image/jpg', 'image/jpeg','image/png'];

        if(allowed.includes(file.mimetype)) {
            cb(null, true)
        } else {
            return cb(new Error('Só aceitamos [jpg, jpge, png] como extensão de imagem!'))
        }

    },
    limits: {fieldSize: 2000000},
    storage: storageConfig
})