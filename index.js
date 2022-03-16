const express = require('express');
require('./utils/db')
const passport = require('passport');
require('./authentication/passport'); // Requerimos nuestro archivo de configuración

// En nuestro archivo index.js
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');

const PORT = 3000;
const server = express();
server.set("secretKey", "ABELCABEZAROMAN");

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

// Añadimos el nuevo middleware al servidor
server.use(passport.initialize())


server.use('/users', userRoutes);
server.use('/', authRoutes);

server.use('*', (req, res, next) => {
    const error = new Error('Route not found');
    error.status = 404;
    next(error);
});

server.use((error, req, res, next) => {
    return res.status(error.status || 500).json(error.message || 'Unexpected error');
});

server.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`);
});
