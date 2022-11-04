import express, { ErrorRequestHandler, json } from 'express';
import path from 'path'
import dotenv from 'dotenv'
import cors from 'cors'
import router from './routes/routes';
import { MulterError } from 'multer';
import { sequelize } from './instances/mysql';

dotenv.config()
const app = express();

app.use(cors())
app.use(json())
app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))
app.use(express.urlencoded({extended: true}))

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(400);

    if(err instanceof MulterError) {
        res.json({error: err.code})
    } else {
        res.json({error: 'Ocorreu algum erro.'});
    }
}
app.use(errorHandler);

app.use(router)

app.listen(process.env.PORT, async ()=> {
    await sequelize.sync()
    console.log(`Aplicativo rodando na porta: ${process.env.PORT}!`)
})