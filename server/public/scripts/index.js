// Función para cifrar una contraseña con SHA-256
function cifrarContrasena(contrasena) {
    return CryptoJS.SHA256(contrasena).toString(CryptoJS.enc.Hex);
}

//Obtiene los 
document.getElementById('btnIngresar').addEventListener('click', function() {
    // Obtén los valores de los campos de usuario y contraseña
    const formData = new FormData();
    let usuario = document.getElementById('usuario').value;
    let contrasena = document.getElementById('contrasena').value;

    let contrasena_cifrada = cifrarContrasena(contrasena);

    formData.append('usuario',usuario);
    formData.append('contrasena',contrasena_cifrada);
    fetch('http://localhost:3001/',{
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data =>{
        console.log('Respuesta del servidor:', data);
        let mensaje = data.mensaje;
        let codigo = data.code;
        if (codigo == 'OK'){
            window.location.href="http://localhost:3001/upload";
        }else{
            alert(mensaje+" , "+codigo);
        }
    })
    .catch(error =>{
        console.log('Respuesta del servidor:', error);
        let mensaje = error.mensaje;
        let codigo = error.code;
        alert(mensaje+" , "+codigo);
    })
});