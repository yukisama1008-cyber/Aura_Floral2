/* =====================================================================
   productos.js - Catálogo de los 12 productos de Aura floral artesanía

   Para cambiar un producto, edita sus datos aquí:
   id            número único del producto
   nombre        nombre en español          nombreEn       nombre en inglés
   descripcion   texto en español           descripcionEn  texto en inglés
   precio        precio en pesos (sin puntos)
   detalle       característica en español  detalleEn      en inglés
   imagen        archivo dentro de la carpeta imagenes/
   ===================================================================== */

const PRODUCTOS = [
  {
    id: 1,
    nombre: "Ramos de flores eternas",
    nombreEn: "Eternal Flowers Bouquet",
    descripcion: "Ramo de flores artesanales que no se marchitan.",
    descripcionEn: "Handmade bouquet that never wilts.",
    precio: 31500,
    detalle: "Papel crepe y limpiapipas",
    detalleEn: "Crepe paper and pipe cleaners",
    imagen: "producto-ramos-flores-eternas.jpg",
  },

  {
    id: 2,
    nombre: "Ramos personalizados",
    nombreEn: "Custom Bouquet",
    descripcion: "Tú eliges los colores, las flores y el empaque.",
    descripcionEn: "You choose the colors, flowers and wrapping.",
    precio: 39500,
    detalle: "A tu gusto",
    detalleEn: "Made your way",
    imagen: "producto-ramos-personalizados.jpg",
  },

  {
    id: 3,
    nombre: "Flores de limpiapipas",
    nombreEn: "Pipe Cleaner Flowers",
    descripcion: "Flores individuales de colores, ideales para regalar.",
    descripcionEn: "Colorful single flowers, perfect as a gift.",
    precio: 4000,
    detalle: "Limpiapipas",
    detalleEn: "Pipe cleaners",
    imagen: "producto-flores-limpiapipas.jpg",
  },

  {
    id: 4,
    nombre: "Arreglos decorativos",
    nombreEn: "Decorative Arrangements",
    descripcion: "Caja de regalo con flores y peluche.",
    descripcionEn: "Gift box with flowers and a teddy bear.",
    precio: 38000,
    detalle: "Caja reutilizable",
    detalleEn: "Reusable box",
    imagen: "producto-arreglos-decorativos.jpg",
  },

  {
    id: 5,
    nombre: "Kits de manualidades",
    nombreEn: "Craft Kits",
    descripcion: "Todo lo necesario para armar tus propias flores.",
    descripcionEn: "Everything you need to make your own flowers.",
    precio: 14500,
    detalle: "Incluye instrucciones",
    detalleEn: "Instructions included",
    imagen: "producto-kits-manualidades.jpg",
  },

  {
    id: 6,
    nombre: "Llaveros de limpiapipas",
    nombreEn: "Pipe Cleaner Keychains",
    descripcion: "Llaveros de flores con diseños diferentes.",
    descripcionEn: "Flower keychains in different designs.",
    precio: 5000,
    detalle: "Argolla metálica",
    detalleEn: "Metal ring",
    imagen: "producto-llaveros-limpiapipas.jpg",
  },

  {
    id: 7,
    nombre: "Llaveros digitales",
    nombreEn: "Digital Keychains",
    descripcion: "Diseño digital de llavero para imprimir o usar en pantalla.",
    descripcionEn: "Digital keychain design to print or use on screen.",
    precio: 1500,
    detalle: "Archivo PNG",
    detalleEn: "PNG file",
    imagen: "producto-llaveros-digitales.jpg",
  },

  {
    id: 8,
    nombre: "Separadores de libros digitales",
    nombreEn: "Digital Bookmarks",
    descripcion: "Separadores florales listos para imprimir.",
    descripcionEn: "Floral bookmarks ready to print.",
    precio: 1000,
    detalle: "Archivo PDF",
    detalleEn: "PDF file",
    imagen: "producto-separadores-digitales.jpg",
  },

  {
    id: 9,
    nombre: "Girasol de limpiapipas",
    nombreEn: "Pipe Cleaner Sunflower",
    descripcion: "Girasol grande que alegra cualquier escritorio.",
    descripcionEn: "Big sunflower that brightens any desk.",
    precio: 9000,
    detalle: "Tallo flexible",
    detalleEn: "Flexible stem",
    imagen: "producto-girasol-limpiapipas.jpg",
  },

  {
    id: 10,
    nombre: "Mini ramo",
    nombreEn: "Mini Bouquet",
    descripcion: "Ramo pequeño para un detalle especial.",
    descripcionEn: "Small bouquet for a special gesture.",
    precio: 17000,
    detalle: "5 flores",
    detalleEn: "5 flowers",
    imagen: "producto-mini-ramo.jpg",
  },

  {
    id: 11,
    nombre: "Maceta de flores",
    nombreEn: "Flower Pot",
    descripcion: "Flores artesanales en maceta decorativa.",
    descripcionEn: "Handmade flowers in a decorative pot.",
    precio: 28500,
    detalle: "Maceta incluida",
    detalleEn: "Pot included",
    imagen: "producto-maceta-flores.jpg",
  },

  {
    id: 12,
    nombre: "Caja de regalo floral",
    nombreEn: "Floral Gift Box",
    descripcion: "Flores y dulces empacados para sorprender.",
    descripcionEn: "Flowers and candy packed to surprise.",
    precio: 30500,
    detalle: "Con dulces",
    detalleEn: "With candy",
    imagen: "producto-caja-regalo-floral.jpg",
  },
];
