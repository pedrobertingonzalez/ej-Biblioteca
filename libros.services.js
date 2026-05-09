// Libros:

// Listar todos los libros
// Agregar un libro nuevo
// Ver solo los libros disponibles

// Reglas:

// Libros — cada libro tiene: id, título, autor, año, disponible (true/false)

// No se puede prestar un libro que ya está prestado
// Al devolver, verificar que el préstamo existe

const fs = require('fs').promises;
const path = require('path');
const librosRuta = path.join(__dirname, '..', 'data', 'libros.json');

async function leerLibros(){
    const libros = await fs.readFile(librosRuta, 'utf-8'); 
    return JSON.parse(libros);
} 

async function guardarLibro(libros){
    const libroEnTexto = JSON.stringify(libros, null, 2);
    await fs.writeFile(librosRuta, libroEnTexto);
}

async function crearLibro(nuevoLibro){

    const libros = await leerLibros();

    if(!nuevoLibro.titulo){
        const error = new Error ('Falta el titulo');
        error.status = 400;
        throw error;
    }

    if(!nuevoLibro.autor){
        const error = new Error ('Falta el autor');
        error.status = 400;
        throw error;
    }

    if(typeof nuevoLibro.año !== "number" || nuevoLibro.año < 1000 || nuevoLibro.año > new Date().getFullYear()){
        const error = new Error ('El año no es valido');
        error.status = 400;
        throw error;
    }

    nuevoLibro.disponible = true;

    const maxId = libros.reduce((max, l) =>{return l.id > max ? l.id : max}, 0);
    nuevoLibro.id = maxId + 1;

    libros.push(nuevoLibro);
    await guardarLibro(libros);
    return nuevoLibro;

}

async function librosDisponibles(){
    const libros = await leerLibros();

    const disponibles = libros.filter((l)=>l.disponible !== false);
    if(disponibles.length === 0){
        const error = new Error('no hay libros disponibles');
        error.status=404;
        throw error;
    }
    return disponibles;
};

module.exports = {
    librosDisponibles,
    leerLibros,
    crearLibro,
    guardarLibro
}