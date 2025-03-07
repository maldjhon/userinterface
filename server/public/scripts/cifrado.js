require('dotenv').config({ path: '../../.env' });
const readline = require('readline');
const crypto = require('crypto');
const fs = require('fs');
const rutaClave = process.env.PATH_KEY;
const rutaCifrado = process.env.PATH_CIPHER;

// Función para generar una clave de 32 bytes y guardarla en un archivo
function generarClaveYGuardar(rutaClave) {
  const clave = crypto.randomBytes(32); // Genera una clave aleatoria de 32 bytes
  fs.writeFileSync(rutaClave, clave);
  console.log(`Clave generada y guardada en ${rutaClave}`);
}

// Función para leer la clave desde un archivo
function leerClave(rutaClave) {
  const clave = fs.readFileSync(rutaClave);
  return clave;
}

// Función para cifrar un valor y guardarlo en un archivo
function cifrarYGuardar(texto, rutaClave, rutaCifrado) {
    generarClaveYGuardar(rutaClave);
    const clave = leerClave(rutaClave);
    const algoritmo = 'aes-256-cbc';
    const iv = crypto.randomBytes(16); // Genera un vector de inicialización (IV) aleatorio
    const cifrador = crypto.createCipheriv(algoritmo, clave, iv);
    let textoCifrado = cifrador.update(texto, 'utf8', 'hex');
    textoCifrado += cifrador.final('hex');
    const datoCifrado = iv.toString('hex') + ':' + textoCifrado;
    fs.writeFileSync(rutaCifrado, datoCifrado);
    console.log(`Datos cifrados y guardados en ${rutaCifrado}`);
  }

 // Crear una interfaz readline
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout/*,
    terminal: true*/
  });
  
  // Función para solicitar una contraseña al usuario sin mostrarla en la consola
function solicitarContraseña(pregunta) {
return new Promise((resolve) => {
    // Desactivar la salida de la consola temporalmente
    const stdOutWrite = rl.output.write;
    rl.output.write = () => {};
    rl.question(pregunta, (respuesta) => {
    // Restaurar la salida de la consola
    rl.output.write = stdOutWrite;
    resolve(respuesta);
    });
});
}
  
async function main() {
// Solicitar una contraseña al usuario
console.log('Ingresa tu contraseña a continuación y al finalizar dar enter: ')
const contraseña = await solicitarContraseña();
cifrarYGuardar(contraseña, rutaClave, rutaCifrado);
// Cerrar la interfaz readline
rl.close();
}
  
// Ejecutar la función principal
main ();