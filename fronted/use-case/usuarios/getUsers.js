export const getUsers = async ()=>{
    const peticion = await fetch ('http://localhost:3001/usuarios')
    const data = await peticion.json();
    return data;
}