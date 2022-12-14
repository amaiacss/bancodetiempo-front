# Banco del Tiempo - FRONT

<h3><b>Desplegado front</b></h3>
<p>La url que se puede visualizar el front desplegado es:</p>
<a href="https://bt-app-eus.web.app/">https://bt-app-eus.web.app/</a>

<h3>Importante <b>Front</b></h3>
<p>Para probar la app desde el front, es obligatorio <b>poner en marcha el servidor de el backend</b>. Las instrucciones las ha dejado Amaia en Slack.</p>

## Actualizar repositorio local
<p>Si siempre trabajas sobre la misma rama (ej. Nerea, Itziar), cada vez que se haya actualizado la rama master:</p>
<ul>
  <li>Cambia a la rama master: <b>git checkout master</b></li>
  <li>Actualiza tu repositorio local: <b>git pull</b></li>
  <li>Vuelve a tu rama: <b>git checkout <i>mirama</i></b></li>
  <li>Vuelca los cambios en tu rama: <b>git merge master</b></li>
</ul>
<span><i>***Puedes comprobar que las ramas son idénticas con <b>git diff master mirama</b>, si es correcto, la consola no devuelve nada</i></span>
</br></br>
<p>Si creas ramas según flujo de trabajo y cada vez que mergeas en el repositorio remoto vas a iniciar un nuevo flujo (rama image-fix, implementTranslate,etc.)</p>
<ul>
  <li>Cambia a la rama master: <b>git checkout master</b></li>
  <li>Actualiza tu repositorio local: <b>git pull</b></li>
  <li>Crea la nueva rama: <b>git checkout -b <i>mirama</i></b></li>
</ul>

## Últimos cambios en capa frontent
### ngx-translate
<p>Algunos componentes ya cargan la funcionalidad de traducción de página, para que funcione en desarrollo, hay que instalar el módulo ngx-translate</p>
<ul>
  <li><b>npm install @ngx-translate/core --save</b></li>
</ul>

### NAV
<p>Implementada traducción</p>
<p>Incluye switch de lenguaje para toda la aplicación</p>
<p>Auth</p>
<ul>
  <li>Actualizadas rutas sin y con login /user/:id/loquesea</li>
  <li>Solo muestra buscador y opciones de usuario si se está logueado</li>
</ul>

### LOGIN
<p>Implementada traducción</p>
<p>Comprobaciones antes de enviar petición al servidor: </p>
<ul>
  <li>Ambos campos obligatorios</li>
  <li>Formato de email válido <i>Ahora mismo lo valido el pipe Validator.email de Angular, aunque lo cambiaré porque acepta algunas cosas como nombre@ y hay que afinarlo.</i></li>
  <li>Patrón de contraseña válido: <i>mínimo 8 caracteres, al menos un número, una mayúscula y una minúscula</i></li>
</ul>
<p>Enlace a registro</p>
<p>Para comunicar con el servidor, se ha simulado lo siguiente: </p>
<ul>
  <li> POST: {"email": "string", "pass": "string"}
</ul>
<p>Implementada petición LOGIN con servidor. Cuatro escenarios</p>
<ol>
  <li>Cuenta <b>no verificada</b>. Se muestra un alert para que revise email</li>
  <li>Usuario <b>no registrado</b>. El formulario muestra el error</li>
  <li>Usuario registrado, <b>contraseña incorrecta</b>. El formulario muestra el error</li>
  <li>Usuario registrado y contraseña correcta.
</ol>

### HOME
<p>Implementada traducción</p>
<p>Si está logueado, desaparece el botón de login</p>
<p>Grid de cards con <b>Últimos intercambios</b></p>
<ul>
  <li>Creado componente para card/modal</li>
  <li>Implementada carga dinámica de los últimos intercambios. Al recibirlos del servidor, necesitaríamos, por orden de "últimos intercambios":</li>
  <image src="https://user-images.githubusercontent.com/77671360/203613202-17ccfb89-0425-461c-be24-d32d3662bda9.png" />
  <li>Implementados los siguientes enlaces dinámicos en card/modal:
    <ul>
      <li>Thumnail y nombre de la persona que publica redirigen a su perfil</li>
      <li>Imagen y título de la actividad abren el modal</li>
    </ul>
  </li>
</ul>
<p>Enlace a Registro con botón final de la página</p>
    
### REGISTER
<p>Implementada traducción</p>
<p>Enlace a login</p>
<p>Se puede activar el check de condiciones y términos desde el modal</p>
<p>Implementando validaciones de formulario, y mensajes de error</p>
<p>Botón de enviar datos inactivo hasta validar campos</p>
<p>Implementada petición de registro a servidor con endpoints del back</p>
  <ul>
    <li>La API nos devuelve siempre un código de error</li>
    <li>Devuelve <b>error 400</b> si el usuario ya está registrado</li>
    <li>Devuelve <b>error 400</b> si el ha habido un problema y no se ha podido enviar la petición</li>
    <li>Devuelve <b>error 0</b> si el usuario se ha creado correctamente</li>
  </ul>
