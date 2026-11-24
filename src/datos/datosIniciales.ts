// Datos fijos del frontend: artículos del blog, regiones/comunas e imágenes disponibles.
// Los productos, categorías, usuarios y órdenes ahora se guardan en MySQL a través del backend.

import type { Novedad, Region } from '../tipos'

export const novedadesIniciales: Novedad[] = [
  {
    id: 1,
    titulo: 'Importancia de las vacunas',
    resumen: 'Mantener las vacunas al día ayuda a prevenir enfermedades.',
    contenido: [
      'Un calendario de vacunación ordenado ayuda a mantener un mejor control preventivo de la mascota y facilita el seguimiento de sus próximas vacunas.',
      'Consulta con tu veterinario cuáles son las vacunas obligatorias segun la edad y especie de tu mascota, y guarda siempre su carnet de vacunación.',
    ],
    imagen: '/img/importancia-vacunas.jpg',
    fecha: '2026-09-02',
    autor: 'Equipo Veterinaria San Marcos',
  },
  {
    id: 2,
    titulo: 'Cuidados en días calurosos',
    resumen: 'Agua fresca, sombra y paseos en horarios adecuados.',
    contenido: [
      'En días calurosos es recomendable ofrecer agua fresca, evitar las horas de mayor temperatura y mantener a la mascota en un lugar con sombra y ventilación.',
      'Nunca dejes a tu mascota dentro de un auto estacionado y presta atención a signos de golpe de calor como jadeo excesivo o decaimiento.',
    ],
    imagen: '/img/cuidados-animales.jpg',
    fecha: '2026-09-20',
    autor: 'Equipo Veterinaria San Marcos',
  },
]

export const regiones: Region[] = [
  { nombre: 'Arica y Parinacota', comunas: ['Arica', 'Putre'] },
  { nombre: 'Tarapacá', comunas: ['Iquique', 'Alto Hospicio'] },
  { nombre: 'Antofagasta', comunas: ['Antofagasta', 'Calama'] },
  { nombre: 'Atacama', comunas: ['Copiapó', 'Vallenar'] },
  { nombre: 'Coquimbo', comunas: ['La Serena', 'Coquimbo'] },
  { nombre: 'Valparaíso', comunas: ['Valparaíso', 'Viña del Mar', 'Quilpué'] },
  { nombre: 'Metropolitana de Santiago', comunas: ['Santiago', 'Providencia', 'Las Condes'] },
  { nombre: "O'Higgins", comunas: ['Rancagua', 'Machalí', 'San Fernando'] },
  { nombre: 'Maule', comunas: ['Talca', 'Curicó'] },
  { nombre: 'Ñuble', comunas: ['Chillán', 'San Carlos'] },
  { nombre: 'Biobío', comunas: ['Concepción', 'Talcahuano', 'Los Ángeles'] },
  { nombre: 'La Araucanía', comunas: ['Temuco', 'Villarrica'] },
  { nombre: 'Los Ríos', comunas: ['Valdivia', 'La Unión'] },
  { nombre: 'Los Lagos', comunas: ['Puerto Montt', 'Osorno', 'Castro'] },
  { nombre: 'Aysén', comunas: ['Coyhaique', 'Aysén'] },
  { nombre: 'Magallanes y Antártica Chilena', comunas: ['Punta Arenas', 'Puerto Natales'] },
]

/** Imagenes disponibles en /public/img para asignar a productos y categorias */
export const imagenesDisponibles = [
  { ruta: '/img/alimento-perro.webp', nombre: 'Alimento perro (foto)' },
  { ruta: '/img/juguete-gato.webp', nombre: 'Juguete gato (foto)' },
  { ruta: '/img/correa-perro.jpg', nombre: 'Correa perro (foto)' },
  { ruta: '/img/placeholder-alimentos.svg', nombre: 'Ilustración alimentos' },
  { ruta: '/img/placeholder-juguetes.svg', nombre: 'Ilustración juguetes' },
  { ruta: '/img/placeholder-accesorios.svg', nombre: 'Ilustración accesorios' },
  { ruta: '/img/placeholder-higiene.svg', nombre: 'Ilustración higiene' },
  { ruta: '/img/placeholder-salud.svg', nombre: 'Ilustración salud' },
]
