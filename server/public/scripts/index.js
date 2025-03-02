document.getElementById('btnIngresar').addEventListener('click', function() {
    // Obtén los valores de los campos de usuario y contraseña
    var usuario = document.getElementById('usuario').value;
    var contrasena = document.getElementById('contrasena').value;
    
    window.location.href="http://localhost:3001/upload";
});