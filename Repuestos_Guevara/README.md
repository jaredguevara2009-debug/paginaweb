# Repuestos Guevara

Sitio comercial informativo para Repuestos Guevara, tienda de repuestos y accesorios para motocicletas en Cochabamba, Bolivia.

## Tecnologías

HTML5, CSS3, JavaScript puro, Bootstrap 5 por CDN, Font Awesome y Google Fonts.

## Abrir el sitio

1. Descarga y descomprime **Repuestos_Guevara_Web.zip**.
2. Abre la carpeta **Repuestos_Guevara** en Visual Studio Code o Visual Studio.
3. Abre **index.html** en un navegador. También puedes usar la extensión Live Server.

No requiere Node.js, npm, compilación, servidor propio ni base de datos. Bootstrap, Font Awesome y Google Fonts se cargan desde sus CDN; para ver esas librerías y tipografías necesitas conexión a Internet. La estructura y los recursos de marca y productos son locales.

## Archivos principales

- **index.html**: contenido, metadatos y estructura de la página.
- **css/styles.css**: identidad visual, componentes y adaptación a escritorio y móvil.
- **js/config.js**: información del negocio, enlaces y mensajes.
- **js/products.js**: catálogo editable.
- **js/main.js**: filtros, búsqueda, ordenamiento, modal, navegación y consulta de compatibilidad.
- **img/logo/logo-guevara.png**: logotipo y mascota entregados para este proyecto.
- **img/productos/**: ilustraciones provisionales independientes para los ocho productos.

## Editar el catálogo

Abre **js/products.js** y agrega o modifica un objeto dentro del arreglo **GuevaraProducts**. Cada producto contiene:

- **id**: identificador único.
- **name**: nombre que se muestra en el catálogo.
- **category** y **categoryId**: categoría y filtro correspondiente.
- **shortDescription** y **description**: textos de la tarjeta y del modal.
- **image** y **alt**: ruta de imagen y texto alternativo.
- **price**: usa null mientras el precio no esté confirmado. Para publicar un precio real, escribe un número, por ejemplo 220.
- **priceStatus**: estado informativo que puede conservarse como consultar.
- **keywords**: términos adicionales para el buscador.

El sitio formatea los precios con Bs. y dos decimales. No publiques precios o compatibilidades sin confirmar.

## Reemplazar imágenes

Las ilustraciones en **img/productos/** son recursos gráficos referenciales; no son fotografías de productos reales. Puedes reemplazar un SVG por una fotografía JPG, PNG o WebP y actualizar la propiedad **image** del producto. Conserva **alt** con una descripción precisa. Mantén las imágenes de producto en formato apaisado y con el objeto centrado para que encajen mejor en las tarjetas.

## Cambiar el logotipo

Reemplaza **img/logo/logo-guevara.png** por el archivo de marca actualizado y conserva el mismo nombre. El menú, la portada, la sección del negocio y el pie de página usan ese recurso. La imagen no se modifica ni se deforma.

## Actualizar datos de contacto

Edita **js/config.js**:

- **phoneDisplay** y **whatsappNumber**: teléfono visible y número internacional sin signo más ni espacios.
- **address**, **streetAddress** y **mapUrl**: dirección y enlace de Google Maps.
- **social.instagram** y **social.tiktok**: perfiles oficiales.
- **social.facebook**: déjalo como cadena vacía hasta tener la URL oficial; la tarjeta y el enlace del pie se mantienen ocultos mientras no esté configurado.
- **messages**: textos de WhatsApp.

El formulario de compatibilidad solo prepara un mensaje en el dispositivo y lo abre en WhatsApp. El sitio no guarda ni envía esos datos a un servidor.

## Publicar con GitHub Pages

1. Sube el contenido de esta carpeta a un repositorio de GitHub.
2. En el repositorio, abre **Settings → Pages**.
3. Selecciona la rama que contiene **index.html** y la carpeta raíz.
4. Guarda y espera a que GitHub Pages publique el sitio.

Las rutas de CSS, JavaScript e imágenes son relativas para que funcionen en GitHub Pages y al abrir **index.html** directamente. Si publicas el sitio bajo un subdirectorio y agregas nuevos recursos, conserva esas rutas relativas.
