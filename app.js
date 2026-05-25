const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const db = require('./db');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'secreto',
    resave: false,
    saveUninitialized: false
}));

// LOGIN
app.get('/', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    res.redirect('/dashboard');
});

// DASHBOARD
app.get('/dashboard', (req, res) => {

    db.all('SELECT * FROM usuarios', [], (err, rows) => {

        if(err){
            console.log(err);
        }

        res.render('dashboard', { usuarios: rows });

    });

});

// FORMULARIO AGREGAR
app.get('/agregar', (req, res) => {
    res.render('agregar');
});

// GUARDAR USUARIO
app.post('/agregar', async (req, res) => {

    const { nombre, correo, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    db.run(
        'INSERT INTO usuarios(nombre, correo, password) VALUES(?,?,?)',
        [nombre, correo, hash],
        function(err){

            if(err){
                console.log(err);
            }

            res.redirect('/dashboard');

        }
    );

});

// FORMULARIO EDITAR
app.get('/editar/:id', (req, res) => {

    db.get(
        'SELECT * FROM usuarios WHERE id=?',
        [req.params.id],
        (err, row) => {

            if(err){
                console.log(err);
            }

            res.render('editar', { usuario: row });

        }
    );

});

// ACTUALIZAR
app.post('/editar/:id', (req, res) => {

    const { nombre, correo } = req.body;

    db.run(
        'UPDATE usuarios SET nombre=?, correo=? WHERE id=?',
        [nombre, correo, req.params.id],
        function(err){

            if(err){
                console.log(err);
            }

            res.redirect('/dashboard');

        }
    );

});

// ELIMINAR
app.get('/eliminar/:id', (req, res) => {

    db.run(
        'DELETE FROM usuarios WHERE id=?',
        [req.params.id],
        function(err){

            if(err){
                console.log(err);
            }

            res.redirect('/dashboard');

        }
    );

});

app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});