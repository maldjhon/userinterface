require('dotenv').config();
const express = require('express');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const mysql = require('mysql2');
const { json } = require('stream/consumers');
const { leerYDescifrar} = require('./public/scripts/descifrado'); // Importar funciones desde cifrado.js
const app = express();
const port = 3001;
const allowedOrigins = [
    'http://127.0.0.1:5500',
    'http://localhost:3001'
];

// Middleware para parsear JSON
app.use(express.json());

// Middleware para parsear datos de formularios
app.use(express.urlencoded({ extended: true }));

// Configurar la conexión a MySQL
let valor = leerYDescifrar ();
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: valor,
    database: 'dev'
});

connection.connect((err) => {
    if (err) {
        console.error('Error al conectar a MySQL:', err);
        return;
    }
    console.log('Conectado a MySQL');
});

// Configura multer para manejar la subida de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Añade una marca de tiempo al nombre del archivo
    }
});

const upload = multer({ 
    storage: storage, 
    limits: {
        fieldSize: 25 * 1024 * 1024 // Aumenta el límite a 25 MB
    }
});

// Configura CORS para permitir solicitudes desde tu origen
app.use(cors({
    origin: allowedOrigins // Reemplaza con el origen de tu frontend
}));

// Servir archivos estáticos desde el directorio "public"
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para el archivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html', 'upload.html'));
});

app.get('/customer', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html', 'customer.html'));
});

app.post('/',upload.none(),(req, res) =>{
    const usuario = req.body.usuario;
    const contrasena = req.body.contrasena;
    const query = 'SELECT * FROM dev.usuarios WHERE usuario = ? and contraseña = ?';
    connection.query(query, [usuario,contrasena], (error, results) => {
        if (error) {
            console.error('Error en la consulta:', error);
            res.status(500).json({mensaje:"Error al consultar el usuario",code:error})
        }else if (results.length == 1){
            console.log('Datos consultador en la base de datos:', results);
            res.json({ mensaje: 'El usuario se encuentra registrado',code: 'OK'});
        }else{
            console.error('Error en la consulta:', error);
            res.status(500).json({mensaje:"Error al consultar el usuario "+usuario,code:'Sin registros'})
        }
    });
});

// Ruta para guardar clientes en la base de datos
app.post('/customer', upload.none(), (req, res) => {
    const nombre = req.body.nombre;
    const documento = req.body.documento; 
    const fechaExpedicion = req.body.fechaExpedicion;

    // Crear una consulta SQL para insertar los datos
    const sql = 'INSERT INTO clientes (nombre, documento, fecha_expedicion) VALUES (?, ?, ?)';

    connection.query(sql, [nombre, documento, fechaExpedicion], (err, result) => {
        if (err) {
            console.error('Error al insertar en la base de datos:', err);
            res.status(500).json({ error: 'Error al guardar en la base de datos' });
            return;
        }else{
            console.log('Datos insertados en la base de datos:', result);
            res.json({ mensaje: 'Cliente guardado con éxito', codigo:'OK'});
        }
    });
});

// Ruta para obtener los clientes
app.get('/customers', (req, res) => {
    const sql = 'select * from clientes';
    connection.query(sql,(err,results) => {
        if (err) {
            console.error('Error al consultar en la base de datos:', err);
            res.status(500).json({ mensaje: 'Error al consultar en la base de datos:',codigo:err});
            return;
        }else if (results.length > 0){
            res.json({ mensaje: results, codigo: 'OK'});
        }else{
            res.status(500).json({ mensaje: 'La consulta no retorna registros',codigo:'NOTOK'});
        }
    })
});

// Ruta para manejar la subida de archivos y guardar en la base de datos
app.post('/subir', upload.none(), (req, res) => {
    const nombre = req.body.nombre;
    const archivo = req.body.archivo; // Obtén el nombre del archivo guardado

    // Crear una consulta SQL para insertar los datos
    const sql = 'INSERT INTO documentos (nombre, archivo) VALUES (?, ?)';
    const buffer = Buffer.from(archivo, 'base64');

    connection.query(sql, [nombre, buffer], (err, result) => {
        if (err) {
            console.error('Error al insertar en la base de datos:', err);
            res.status(500).json({ error: 'Error al guardar en la base de datos' });
            return;
        }else{
            console.log('Datos insertados en la base de datos:', result);
            res.json({ mensaje: 'Archivo recibido y guardado con éxito', nombre: nombre, archivo: archivo });
        }
    });
});

// Ruta para obtener los documentos
app.get('/documentos', (req, res) => {
    const sql = 'select * from documentos';
    connection.query(sql,(err,results) => {
        if (err) {
            console.error('Error al consultar en la base de datos:', err);
            res.status(500).json({ mensaje: 'Error al consultar en la base de datos:',codigo:err});
            return;
        }else{
            const documents = results.map(row => ({
                id: row.id,
                nombre: row.nombre,
                archivo: Buffer.from(row.archivo).toString('base64')
            }));
            console.log('Datos consultados en la base de datos:', documents);
            res.json({ mensaje: documents, codigo: 'OK' });
        }
    })
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
