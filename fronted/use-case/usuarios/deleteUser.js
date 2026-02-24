export const deleteUser = async (id) => {
const solicitud = await fetch(`http://localhost:3001/usuarios/${id}`,{
    method: 'DELETE',

})
const respuesta = await solicitud.json();
return respuesta;
}
