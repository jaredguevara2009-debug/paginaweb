window.GuevaraConfig = Object.freeze({
  name: "Repuestos Guevara",
  city: "Cochabamba, Bolivia",
  address: "Antezana y Uruguay, Cochabamba, Bolivia",
  streetAddress: "Antezana y Uruguay",
  phoneDisplay: "+591 68556819",
  whatsappNumber: "59168556819",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Antezana+y+Uruguay+Cochabamba+Bolivia",
  logo: "img/logo/logo-guevara.png",
  copyrightYear: 2026,
  messages: Object.freeze({
    general: "Hola, Repuestos Guevara. Quisiera realizar una consulta sobre sus productos.",
    product: function (name) {
      return "Hola, Repuestos Guevara. Quisiera consultar el precio y la disponibilidad de " + name + ".";
    },
    compatibility: "Hola, Repuestos Guevara. Quisiera consultar la compatibilidad de un repuesto con mi motocicleta.",
    location: "Hola, Repuestos Guevara. Quisiera obtener información para visitar su tienda."
  }),
  social: Object.freeze({
    instagram: "https://www.instagram.com/repuestosguevara67/",
    tiktok: "https://www.tiktok.com/@repuestosguevara67",
    facebook: ""
  })
});
