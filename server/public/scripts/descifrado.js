require('dotenv').config();
const crypto = require('crypto');
const fs = require('fs');
const rutaClave = process.env.PATH_KEY_DES;
const rutaCifrado = process.env.PATH_CIPHER_DES;
console.log(rutaClave,rutaCifrado);

// Función para leer la clave desde un archivo
function leerClave(rutaClave) {
  if (!rutaClave) {
    throw new Error('La ruta de la clave no está definida');
  }
  const clave = fs.readFileSync(rutaClave);
  return clave;
}

// Función para leer y descifrar los datos desde un archivo
function leerYDescifrar() {
  if (!rutaClave || !rutaCifrado) {
    throw new Error('Las rutas de la clave y del cifrado no están definidas');
  }
  const clave = leerClave(rutaClave);
  const algoritmo = 'aes-256-cbc';
  const datoCifrado = fs.readFileSync(rutaCifrado, 'utf8');
  const partes = datoCifrado.split(':');
  const iv = Buffer.from(partes[0], 'hex');
  const texto = partes[1];
  const descifrador = crypto.createDecipheriv(algoritmo, clave, iv);
  let textoDescifrado = descifrador.update(texto, 'hex', 'utf8');
  textoDescifrado += descifrador.final('utf8');
  return textoDescifrado;
}

// Exportar funciones
module.exports = {
  leerYDescifrar
};
