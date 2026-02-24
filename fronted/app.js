// Importaciones
import { armarCiudades, armarGenero, armarUsuarios} from "./components/index.js";
import { validar } from "./helpers/validarFormulario.js";
import { ciudades, generos , createUser, getUsers, deleteUser, updateUser} from "./use-case/index.js";

// variables
const formulario = document.querySelector('form');
const documento = document.querySelector("#documento");
const nombre = document.querySelector("#nombre");
const correo = document.querySelector("#correo");
const divGeneros = document.getElementById("generos");
const ciudad = document.querySelector("#ciudadId");
const divUsuarios = document.querySelector("#usuarios")

let editandoId = null;

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

 // Si el formulario es válido, se llama a la función "createUser" para enviar los datos al servidor y crear un nuevo usuario.

  if (editandoId) {
    await updateUser(editandoId, documento, nombre, genero, ciudad, correo);
    // Resetea el modo de edición a null para volver al modo de creación.
    editandoId = null;
  } else {
    await createUser(documento, nombre, genero, ciudad, correo);
  }

formulario.reset();

  // Vuelve a obtener los usuarios y re-renderiza las cards
let datosUsuarios = await getUsers();
// Llama a la función "armarUsuarios" para renderizar las cards de usuarios actualizadas en el contenedor "divUsuarios".
armarUsuarios(divUsuarios, datosUsuarios);

});



// Delegación de eventos sobre el contenedor de usuarios para detectar clics en botones de editar.
divUsuarios.addEventListener("click", async (e) => {
  // Verifica si el elemento clickeado (o su padre) es un botón con la clase "btn-editar".
  const btnEditar = e.target.closest(".btn-editar");

  // Si no se clickeó un botón de editar, no hace nada.
  if (!btnEditar) return;

  // Obtiene el id del usuario a editar desde el atributo data-id del botón clickeado.
  const id = btnEditar.getAttribute("data-id");

  // Obtiene todos los usuarios actuales del servidor.
  const datosUsuarios = await getUsers();

  // Busca el usuario cuyo id coincida con el id del botón clickeado.
  const usuario = datosUsuarios.find(user => user.id === id);

  // Si no se encuentra el usuario, no hace nada.
  if (!usuario) return;

  // Guarda el id del usuario que se está editando en la variable "editandoId".
  editandoId = id;

  // Llena los campos del formulario con los datos del usuario encontrado.
  documento.value = usuario.documento;
  nombre.value = usuario.nombre;
  correo.value = usuario.correo;
  ciudad.value = usuario.ciudad_id;

  // Selecciona el radio button del género que coincida con el género del usuario.
  const radioGenero = divGeneros.querySelector(`input[value="${usuario.genero_id}"]`);
  if (radioGenero) radioGenero.checked = true;
});

// Delegación de eventos sobre el contenedor de usuarios para detectar clics en botones de eliminar.
divUsuarios.addEventListener("click", async (e) => {
  // Verifica si el elemento clickeado (o su padre) es un botón con la clase "btn-eliminar".
  const btnEliminar = e.target.closest(".btn-eliminar");

  // Si no se clickeó un botón de eliminar, no hace nada.
  if (!btnEliminar) return;

  // Obtiene el id del usuario a eliminar desde el atributo data-id del botón clickeado.
  const id = btnEliminar.getAttribute("data-id");

  // Llama a la función "deleteUsuario" para eliminar el usuario con el id obtenido.
  await deleteUser(id);

  // Vuelve a obtener los usuarios actualizados y re-renderiza las cards.
  const datosUsuarios = await getUsers();
  armarUsuarios(divUsuarios, datosUsuarios);
});