const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const HTTPSTATUSCODE = require("../utils/httpStatusCode");
const { isAuth } = require("../middlewares/auth.middlewares");

const router = express.Router();


router.post('/register', (req, res, next) => {
    // Invocamos a la autenticación de Passport

    const done = (error, user) => {
        // Si hay un error, llamamos a nuestro controlador de errores
        if (error) {
            return next(error);
        }

        req.logIn(user, (error) => {
            // Si hay un error logeando al usuario, resolvemos el controlador
            if (error) {
                return next(error);
            }
            // Si no hay error, devolvemos al usuario logueado
            return res.status(201).json(user)
        });

    };

    passport.authenticate('register', done)(req); // ¡No te olvides de invocarlo aquí!
});

router.post('/login', (req, res, next) => {
    passport.authenticate('login', (error, user) => {
        if (error) return next(error)

        req.logIn(user, (error) => {
            // Si hay un error logeando al usuario, resolvemos el controlador
            if (error) {
                return next(error);
            }

            const token = jwt.sign(
                {
                    //Este es el payload, aqui se inserta la información que
                    //queremos que contenga nuestro token.
                    id: user._id,
                    name: user.name
                },
                req.app.get("secretKey"),//en este punto como segundo parametro se configura si se utiliza clave privada o publica
                { expiresIn: "1h" } // Determinamos el tiempo de expiración
            );

            // Si no hay error, devolvemos al usuario logueado
            return res.status(200).json({
                status: 200,
                message: HTTPSTATUSCODE[200],
                data: { token: token },
            })
        });
    })(req);
});


router.post('/logout', [isAuth], (req, res, next) => {
    try {
        return res.json({
            status: 200,
            message: HTTPSTATUSCODE[200],
            data: { token: null }
        });
    } catch (err) {
        return next(err)
    }
});

module.exports = router;
