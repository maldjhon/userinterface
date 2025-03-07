function mostrarModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'flex';
}

function cerrarModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

function guardarInformacion() {
    const nombre = document.getElementById('nombre').value;
    const documento = document.getElementById('documento').value;
    const fechaExpedicion = document.getElementById('fecha_expedicion').value;
    const formData = new FormData();

    formData.append('nombre',nombre);
    formData.append('documento',documento);
    formData.append('fechaExpedicion',fechaExpedicion);

    if (nombre && documento && fechaExpedicion) {
        fetch ('http://localhost:3001/customer',{
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            let codigo = data.codigo;
            if (codigo == 'OK'){
                console.log('Mensaje: ',data.mensaje);
                cerrarModal();
                queryCustomer ();
            }else{
                console.error("Mensaje: ",data.mensaje);                
            }
        })
        .catch(error =>{
            console.error(error);            
        });
    } else {
        alert("Por favor complete todos los campos.");
    }
}

function queryCustomer (){
    fetch ('http://localhost:3001/customers',{
        method: 'GET'
    })
    .then (response => response.json())
    .then(data =>{
        let codigo = data.codigo;
        if(codigo == 'OK'){
            let mensaje = data.mensaje;
            console.log(mensaje);
            let padre_div = document.getElementById('clientes');
            mensaje.forEach(registros => {
                let hijo_div = document.createElement('div');
                hijo_div.classList = 'clientes';
                let id = document.createElement('div');
                let spanId =document.createElement('span');
                spanId.textContent = registros.id;
                id.appendChild(spanId);
                hijo_div.appendChild(id);
                let nombre = document.createElement('div');
                let spanNombre =document.createElement('span');
                spanNombre.textContent = registros.nombre;
                nombre.appendChild(spanNombre);
                hijo_div.appendChild(nombre);
                let documento = document.createElement('div');
                let spanDocumento =document.createElement('span');
                spanDocumento.textContent = registros.documento;
                documento.appendChild(spanDocumento);
                hijo_div.appendChild(documento);
                let fecha = document.createElement('div');
                let spanFecha =document.createElement('span');
                let formatoFecha = registros.fecha_expedicion;
                let fecha_nueva = new Date(formatoFecha);
                let fecha_formateada = `${fecha_nueva.getFullYear()}/${(fecha_nueva.getMonth() + 1).toString().padStart(2, '0')}/${fecha_nueva.getDate().toString().padStart(2, '0')}`;
                spanFecha.textContent = fecha_formateada;
                fecha.appendChild(spanFecha);
                hijo_div.appendChild(fecha);
                padre_div.appendChild(hijo_div);
            });

        }else{
            console.log('Mensaje: ',data.mensaje);            
        }
    })
    .catch(error =>{
        console.error(error);        
    })
}

queryCustomer ();