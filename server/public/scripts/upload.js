documentos();

document.getElementById('cargarArchivo').addEventListener('click', async function(event) {
    event.preventDefault(); // Evita el envío del formulario por defecto
    async function convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = () => {
                reject(new Error('Error al convertir el archivo a base64.'));
            };
            reader.readAsDataURL(file);
        });
    }
    const archivo = document.getElementById('archivo').files[0];
    let base64String = "";
    if (archivo) {
        try {
            base64String = await convertToBase64(archivo);
        } catch (error) {
            console.error(error);
        }
    }

    const formData = new FormData();
    const nombre = document.getElementById('nombre').value;
    formData.append('nombre', nombre);
    formData.append('archivo', base64String);

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
            documentos();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ocurrió un error al cargar el archivo');
    });
});

function documentos(){
    fetch ('http://localhost:3001/documentos',{
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        let mensaje = data.mensaje;
        const documentList = document.getElementById('documentos-table');
        mensaje.forEach(registros => {
            const row = document.createElement('tr');
            const id = document.createElement('td');
            id.textContent = registros.id;
            const nombre = document.createElement('td');
            nombre.textContent = registros.nombre;
            const imagen = document.createElement('td');
            const archivo = document.createElement('img');
            archivo.src = 'data:image/jpeg;base64,' + registros.archivo;
            archivo.alt = 'Imagen del documento';
            archivo.style.width = '100px';  // Puedes ajustar el tamaño de la imagen según necesites
            imagen.appendChild(archivo);
            row.appendChild(id);
            row.appendChild(nombre);
            row.appendChild(imagen);
            documentList.appendChild(row);
        });
    })
    .catch(error =>{
        console.error(error);
    })
}