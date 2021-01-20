const { response } = require('express');
const Evento = require('../models/Evento');


getEventos = async (req, res = response) => {

    const eventos = await Evento.find().populate('user', 'name');

    res.json({
        ok: true,
        eventos
    });
};

crearEvento = async (req, res = response) => {
    const evento = new Evento(req.body);

    try {

        evento.user = req.uid;

        const eventoDB = await evento.save();
        res.status(201).json({
            ok: true,
            message: 'Evento guardado satisfactoriamente.',
            evento: eventoDB
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Por favor hable con el administrador.'
        });
    }
};

actualizarEvento = async (req, res = response) => {
    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        const evento = await Evento.findById( eventoId );

        if( !evento ){
            return res.status(404).json({
                ok: false,
                message: 'No existe evento con esa id.',
            });
        }

        if( evento.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                message: 'No tiene privilegio para editar este evento.',
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        };

        const eventoDB = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } );

        res.status(201).json({
            ok: true,
            message: 'Evento guardado satisfactoriamente.',
            evento: eventoDB
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Por favor hable con el administrador.'
        });
    }
};

eliminarEvento = async (req, res = response) => {
    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        const evento = await Evento.findById( eventoId );

        if( !evento ){
            return res.status(404).json({
                ok: false,
                message: 'No existe evento con esa id.',
            });
        }

        if( evento.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                message: 'No tiene privilegio para eliminar este evento.',
            });
        }

        await Evento.findByIdAndDelete( eventoId );

        res.status(201).json({
            ok: true,
            message: 'Evento eliminado satisfactoriamente.',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Por favor hable con el administrador.'
        });
    }
};

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
};

