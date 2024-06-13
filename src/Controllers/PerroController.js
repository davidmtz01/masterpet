import mongoose from "mongoose";
import * as fs from 'fs';

const esquema = new mongoose.Schema({
    titulo: String,
    descripcion: String,
    imagen: String
}, { versionKey: false });

const PerroModel = new mongoose.model('perro', esquema);

export const getPerro = async (req, res) => {
    try {
        const { id } = req.params;
        const rows = (id === undefined) ? await PerroModel.find() : await PerroModel.findById(id);
        return res.status(200).json({ status: true, data: rows });
    } catch (error) {
        return res.status(500).json({ status: false, errors: [error] });
    }
};

export const savePerro = async (req, res) => {
    try {
        const { titulo, descripcion } = req.body;
        const validacion = validar(titulo, descripcion, req.file, 'Y');
        if (validacion == '') {
            const nuevoPerro = new PerroModel({
                titulo: titulo,
                descripcion: descripcion,
                imagen: '/uploads/' + req.file.filename
            });
            return await nuevoPerro.save().then(
                () => { res.status(200).json({ status: true, message: 'Perro guardado' }); }
            );
        } else {
            return res.status(400).json({ status: false, errors: validacion });
        }
    } catch (error) {
        return res.status(500).json({ status: false, errors: [error.message] });
    }
};

export const updatePerro = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion } = req.body;
        let imagen = '';
        let valores = { titulo: titulo, descripcion: descripcion };
        if (req.file != null) {
            imagen = '/uploads/' + req.file.filename;
            valores = { titulo: titulo, descripcion: descripcion, imagen: imagen };
            await eliminarImagen(id);
        }
        const validacion = validar(titulo, descripcion);
        if (validacion == '') {
            await PerroModel.updateOne({ _id: id }, { $set: valores });
            return res.status(200).json({ status: true, message: 'Perro actualizado' });
        } else {
            return res.status(400).json({ status: false, errors: validacion });
        }
    } catch (error) {
        return res.status(500).json({ status: false, errors: [error.message] });
    }
};

export const deletePerro = async (req, res) => {
    try {
        const { id } = req.params;
        await eliminarImagen(id);
        await PerroModel.deleteOne({ _id: id });
        return res.status(200).json({ status: true, message: 'Perro eliminado' });
    } catch (error) {
        return res.status(500).json({ status: false, errors: [error.message] });
    }
};

const eliminarImagen = async (id) => {
    const perro = await PerroModel.findById(id);
    const img = perro.imagen;
    fs.unlinkSync('./public/' + img);
};

const validar = (titulo, descripcion, img, sevalida) => {
    var errors = [];
    if (titulo === undefined || titulo.trim() === '') {
        errors.push('El titulo NO debe de estar vacio');
    }
    if (descripcion === undefined || descripcion.trim() === '') {
        errors.push('La descripcion NO debe de estar vacia');
    }
    if (sevalida === 'Y' && img === undefined) {
        errors.push('Selecciona una imagen en formato jpg o png');
    } else {
        if (errors != '') {
            fs.unlinkSync('./public/uploads/' + img.filename);
        }
    }
    return errors;
};
