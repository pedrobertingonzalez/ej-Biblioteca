const express = require ('express');
const router = express.Router();

const{leerPrestamos,
    registrarPrestamo,
    devolverLibro
    } = require ('../services/prestamos.services');

    // leerPrestamos
    router.get('/', async (req, res, next)=>{
        try{
        const prestamos = await leerPrestamos();
        res.status(200).json({prestamos});
        }catch(error){
            next(error);
        }
    });


    // registrarPrestamo
    router.post('/', async (req, res, next)=>{
        try{
        const prestamo = await registrarPrestamo(req.body);
        res.status(201).json({prestamo});
        }catch(error){
            next(error);
        }
    });

    

    // devolverLibro
    router.patch('/:id', async (req, res, next)=>{
        try{
        const id = parseInt(req.params.id);
        const devolver = await devolverLibro(id);
            res.status(200).json({devolver});
        }catch(error){
            next(error);
        }
    });

    module.exports = router