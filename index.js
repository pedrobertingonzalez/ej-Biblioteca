require ('dotenv').config();
const express = require ('express');
const app = express();

app.use(express.json());

const logger = require ('./middlewares/logger');
app.use(logger);

const librosRouter = require('./routers/libros.router');
app.use('/libros', librosRouter);

const prestamosRouter = require ('./routers/prestamos.router');
app.use('/prestamos', prestamosRouter);

const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

app.listen(process.env.PORT, ()=>{
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
})