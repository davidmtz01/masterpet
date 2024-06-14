import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import mongoose from 'mongoose'
import {URL,DB_HOST,DB_DATABASE,DB_PORT} from './config.js'
import rutasPerro from './Routes/Perro.routes.js'
import path from 'path';
//import rutasAuth from './Routes/Auth.routes.js'
//const conexion = 'mongodb://'+DB_HOST+':'+DB_PORT+'/'+DB_DATABASE
mongoose.connect(URL).then()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(rutasPerro);  // Renombrado para trabajar con perros

app.use( (req,res) => {
    res.status(404).json({status:false,errors:'Not found'})
} )
//app.get('/', (req,res) => { res.send('Hola mundo')})

export default app
