document.getElementById('cargarArchivo').addEventListener('click', function(event) {
    event.preventDefault(); // Evita el envío del formulario por defecto

    const formData = new FormData();
    const nombre = document.getElementById('nombre').value;
    const archivo = document.getElementById('archivo').files[0];

    formData.append('nombre', nombre);
    formData.append('archivo', archivo);

    fetch('http://localhost:3001/subir', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        let Error = data.error;
        let respuesta = data.mensaje;
        if (Error !== "" && Error !== undefined && Error !== 'undefined'){
            console.log('Respuesta del servidor:', Error);
        }else if (respuesta !== ""){
            console.log('Respuesta del servidor:', data);
            alert('Archivo cargado con éxito');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ocurrió un error al cargar el archivo');
    });
});
