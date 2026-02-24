export const updateUser = async (id,documento, nombre, genero, ciudad, correo) => {
const solicitud = await fetch(`http://localhost:3001/usuarios/${id}`,{
    method: 'PUT',
    body: JSON.stringify({
    documento: documento,
    nombre: nombre,
    genero_id: genero,
    ciudad_id: ciudad,
    correo: correo
    }),
    headers: {
    'Content-type': 'application/json; charset=UTF-8',
},
})
const respuesta = await solicitud.json();
return respuesta;
}
