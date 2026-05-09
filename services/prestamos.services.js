// Préstamos:

// Registrar un préstamo — cambia disponible a false en el libro
// Devolver un libro — cambia disponible a true en el libro
// Ver préstamos activos (sin fecha de devolución)

// Reglas:

// Préstamos — cada préstamo tiene: id, idLibro, nombreUsuario, fechaPrestamo, fechaDevolucion
// No se puede prestar un libro que ya está prestado
// Al devolver, verificar que el préstamo existe

const fs = require('fs').promises;
const path = require ('path');
const prestamosRuta = path.join(__dirname, '..', 'data', 'prestamos.json');

const{leerLibros,
     guardarLibro} = require ('./libros.services');



async function leerPrestamos(){
    const prestamos = await fs.readFile(prestamosRuta, 'utf-8');
    return JSON.parse(prestamos); 
}

async function guardarPrestamo(prestamo){
    const prestamosEnTexto = JSON.stringify(prestamo, null, 2);
    fs.writeFile(prestamosRuta, prestamosEnTexto);
}

async function registrarPrestamo(nuevoPrestamo){
    const libros = await leerLibros();
    const prestamo = await leerPrestamos();
// ID LIBRO
    const libro = libros.find((l)=> l.id === nuevoPrestamo.idLibro);

    if(!libro){
        const error = new Error('El libro no existe');
        error.status=404;
        throw error;
    }

    if(!libro.disponible){
        const error = new Error('El libro no esta disponible');
        error.status=400;
        throw error;
    }

    if(!nuevoPrestamo.nombreUsuario){
        const error = new Error('Falta el nombre del usuario');
        error.status=400;
        throw error;
    }

// FECHA DE PRESTAMO
    const fechaDePrestamo = new Date().toLocaleDateString();

// FECHA DE DEVOLUCION
    const fechaDevolucion = new Date();
    fechaDevolucion.setDate(fechaDevolucion.getDate() + 60);
    const fechaDevolucionTexto = fechaDevolucion.toLocaleDateString();

// ID
    const maxId = prestamo.reduce((max, p)=> {return p.id > max ? p.id : max}, 0);
    const id = maxId + 1;

// AGREGAR FECHA DEL PRESTAMO, DEVOLUCION  Y ID DEL LIBRO
    nuevoPrestamo.id = id;
    nuevoPrestamo.fechaDePrestamo = fechaDePrestamo;
    nuevoPrestamo.fechaDevolucion = fechaDevolucionTexto;

    // MODIFICAR LIBROS.JSON
    libro.disponible = false;
    await guardarLibro(libros);

// FINAL
    prestamo.push(nuevoPrestamo);
    await guardarPrestamo(prestamo);
    return nuevoPrestamo;
}

// Devolver un libro — cambia disponible a true en el libro

async function devolverLibro(id){
    const libros = await leerLibros();
    const prestamos = await leerPrestamos();

    const prestamo = prestamos.find((p)=> p.id === id);
    if(!prestamo){
        const error = new Error ('No se encontro el prestamo');
        error.status = 404;
        throw error;
    }

    const prestamoActualizado = prestamos.filter((p)=> p.id !== id);
    if(prestamoActualizado.length === prestamos.length){
        const error = new Error ('No se encontro el libro prestado');
        error.status = 404;
        throw error;
    }

    const libroDevuelto = libros.find((l)=>l.id === prestamo.idLibro);

    libroDevuelto.disponible = true;
    await guardarLibro(libros);

// FINAL
    
    await guardarPrestamo(prestamoActualizado);
    return prestamoActualizado;
}

module.exports = {
    leerPrestamos,
    registrarPrestamo,
}