const express = require('express');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const port = 3001;
const allowedOrigins = [
    'http://127.0.0.1:5500',
    'http://localhost:3001'
];

// Configurar la conexión a MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
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

const upload = multer({ storage: storage });

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

// Ruta para manejar la subida de archivos y guardar en la base de datos
app.post('/subir', upload.single('archivo'), (req, res) => {
    const nombre = req.body.nombre;
    const archivo = req.file.filename; // Obtén el nombre del archivo guardado

    // Crear una consulta SQL para insertar los datos
    const sql = 'INSERT INTO documentos (nombre, archivo) VALUES (?, ?)';

    connection.query(sql, [nombre, archivo], (err, result) => {
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

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
