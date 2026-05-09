const express = require ('express');
const router = express.Router();

const{librosDisponibles,
    leerLibros,
    crearLibro
    } = require ('../services/libros.services');


    // leerLibros
    router.get('/', async (req, res, next)=>{
        try{
            const libros = await leerLibros();
            res.status(200).json({libros});
        }catch(error){
            next(error);
        }
    });


    // librosDisponibles
    router.get('/disponibles', async (req, res, next)=>{
        try{
        const libros = await librosDisponibles();
        res.status(200).json({libros});
        }catch(error){
            next(error);
        }
    });

    

    // crearLibro
    router.post('/', async (req, res, next)=>{
        try{
            const libros = await crearLibro(req.body);
            res.status(201).json({libros});
        }catch(error){
            next(error);
        }
    });



    module.exports = router