import { Router } from 'express';
import { getPerro, savePerro, updatePerro, deletePerro } from '../Controllers/PerroController.js';
import { subirImagen } from '../Middleware/Storage.js';

const rutas = Router();

rutas.get('/api/perro', getPerro);
rutas.get('/api/perro/:id', getPerro);
rutas.post('/api/perro', subirImagen.single('imagen'), savePerro);
rutas.put('/api/perro/:id', subirImagen.single('imagen'), updatePerro);
rutas.delete('/api/perro/:id', deletePerro);

export default rutas;
