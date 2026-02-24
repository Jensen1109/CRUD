// Importaciones
import { armarCiudades, armarGenero} from "./components/index.js";
import { validar } from "./helpers/validarFormulario.js";
import { ciudades, generos } from "./use-case/index.js";
import { createUser } from "./use-case/usuarios/createUser.js";
import { getUsers} from "./use-case/usuarios/getUsers.js";


// variables
const formulario = document.querySelector('form');
const documento = document.querySelector("#documento");
const nombre = document.querySelector("#nombre");
const correo = document.querySelector("#correo");
const divGeneros = document.getElementById("generos");
const ciudad = document.querySelector("#ciudadId");
const divUsuarios = document.querySelector("#usuario")

const reglas =
{
  documento: { required: true, min: 8, max: 10, mensaje: "El campo es obligatorio" },
  nombre: { required: true, mensaje: "El campo es obligatorio" },
  genero: { required: true, mensaje: "Por favor seleccione su genero" },
  ciudad: { required: true, mensaje: "Por favor seleccione su ciudad" },
  correo: { required: true, mensaje: "El campo es obligatorio" }
};

// Métodos

/**
 * Función para validar los campos del formulario formulario
 * 
 * @param {HTMLFormElement} form - Formulario a validar
 * @returns  {Object} - {esValido: boolean, documento: string, nombre: string, genero: string, ciuda: string, correo: string }
 */
const validarFormulario = (e) => {
  let respuesta = validar(e, reglas);
  documento.classList.remove('error')
  nombre.classList.remove('error')
  ciudad.classList.remove('error');
  divGeneros.classList.remove('error')
  correo.classList.remove('error')

  if (!respuesta.valido) {
    if (respuesta.errores.documento) {
      documento.classList.add('error')
    }
    if (respuesta.errores.nombre) {
      nombre.classList.add('error')
    }
    if (respuesta.errores.ciudad) {
      ciudad.classList.add('error')
    }
    if (respuesta.errores.genero) {
      divGeneros.classList.add('error')
    }
    if (respuesta.errores.correo) {
      correo.classList.add('error')
    }
  }
  if (!respuesta.valido) {
    return {
      esValido: respuesta.valido
    }
  } else {
    return {
      esValido: respuesta.valido,
      documento: documento.value,
      nombre: nombre.value,
      genero: e.querySelector('input[name="genero"]:checked').value,
      ciudad: ciudad.value,
      correo: correo.value
    }
  }
}


// const CrearUsuario = async (documento, nombre, genero, ciudad, correo) =>{
//   const data = await createUser(documento, nombre, genero, ciudad, correo)
//   console.log(data);
// }

// Eventos
document.addEventListener("DOMContentLoaded", async () => {
  let datosCiudades = await ciudades();
  let datosGeneros = await generos();
  let datosUsuarios = await getUsers();

  armarGenero(divGeneros, datosGeneros);
  armarCiudades(ciudad, datosCiudades)
  armarUsuarios(divUsuarios, datosUsuarios);
})

formulario.addEventListener("submit", async (e) => {
  e.preventDefault()
  const { esValido, documento, nombre, genero, ciudad, correo } = validarFormulario(e.target);
  if (!esValido) return;
  // CrearUsuario(documento, nombre, genero, ciudad, correo)

 // Si el formulario es válido, se llama a la función "postUsuarios" para enviar los datos al servidor y crear un nuevo usuario.
  await postUsuarios(documento, nombre, genero, ciudad, correo);


formulario.reset();

  // Vuelve a obtener los usuarios y re-renderiza las cards
let datosUsuarios = await getUsuarios();
// Llama a la función "armarUsuarios" para renderizar las cards de usuarios actualizadas en el contenedor "divUsuarios".
armarUsuarios(divUsuarios, datosUsuarios);
});
