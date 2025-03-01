document.getElementById('btnIngresar').addEventListener('click', function() {
    // Obtén los valores de los campos de usuario y contraseña
    var usuario = document.getElementById('usuario').value;
    var contrasena = document.getElementById('contrasena').value;
    if (usuario=="jhon" && contrasena=="jhon1"){
        // Muestra un mensaje indicando ingreso exitoso
        alert('Ingreso exitoso\nUsuario: ' + usuario + '\nContraseña: ' + contrasena);
    }
});