'use strict';

/**
 * Первое наполнение посадочной страницы /es/diseno-ux-ui. Дальше тексты правятся в админке
 * («Посадочные страницы»). Если страница с этим slug на испанском уже есть, скрипт её не трогает.
 *
 *   yarn seed:landing                                   — локально
 *   docker compose exec strapi node scripts/seed-landing-diseno-ux-ui.js   — на сервере
 */

const { createStrapi, compileStrapi } = require('@strapi/strapi');

const UID = 'api::landing.landing';
const LOCALE = 'es';
const SLUG = 'diseno-ux-ui';

const paragraphs = (...list) => list.join('\n\n');

const cards = (title, items, { numbered = false, text = null } = {}) => ({
  __component: 'landing.section-cards',
  title,
  text,
  numbered,
  items: items.map(([itemTitle, ...itemText]) => ({ title: itemTitle, text: paragraphs(...itemText) })),
});

const data = {
  title: 'Diseño UX/UI para software, SaaS y plataformas web',
  title_accent: 'Diseño UX/UI',
  slug: SLUG,
  seo: {
    title: 'Diseño UX/UI Freelance para Software y SaaS | Diana Konoiko',
    description: 'Diseño UX/UI freelance para SaaS, CRM y plataformas web. Prototipos en Figma, rediseño de interfaces y colaboración con desarrollo. Cotiza tu proyecto.',
    keywords: 'diseño UX/UI, diseñadora UX/UI freelance, diseño de SaaS, diseño de CRM, prototipos en Figma, rediseño UX/UI, México',
  },
  hero: {
    lead: '¿Estás creando un producto digital o necesitas mejorar una interfaz existente?',
    text: paragraphs(
      'Te ayudo a diseñar experiencias de usuario claras, funcionales y fáciles de usar: desde plataformas empresariales y sistemas CRM hasta aplicaciones web y paneles de administración.',
      'Soy Diana Konoiko, diseñadora UX/UI freelance con más de 7 años de experiencia en proyectos digitales. Trabajo en Figma y colaboro directamente con equipos de desarrollo.',
    ),
    cta_label: 'Cuéntame sobre tu proyecto',
    projects_label: 'Ver proyectos realizados',
    note: 'Diseño UX/UI freelance · Trabajo remoto · Proyectos para empresas en México',
    marquee: 'SaaS · CRM · Plataformas web · Figma ·',
  },
  sections: [
    cards('Soluciones de diseño UX/UI para tu negocio', [
      ['Diseño de plataformas web y SaaS',
        'Diseño interfaces para productos digitales con múltiples funcionalidades, tipos de usuario y procesos de negocio.',
        'Organizo la información y los recorridos para que las plataformas sean más fáciles de entender y utilizar.'],
      ['Diseño de sistemas CRM y paneles de administración',
        'Transformo procesos complejos en interfaces organizadas y funcionales.',
        'Trabajo con formularios, tablas, paneles de control, navegación y flujos de usuario adaptados a las necesidades de cada proyecto.'],
      ['Rediseño UX/UI de productos existentes',
        '¿Tu plataforma funciona, pero es difícil de usar o necesita una actualización visual?',
        'Analizo su estructura, identifico oportunidades de mejora y diseño una experiencia más clara y consistente.'],
      ['Prototipos y diseño de interfaces en Figma',
        'Creo wireframes, prototipos e interfaces visuales para aplicaciones web y móviles.',
        'Preparo los diseños para facilitar el trabajo del equipo de desarrollo.'],
    ]),
    {
      __component: 'landing.section-cases',
      title: 'Proyectos reales de diseño UX/UI',
      text: 'Cada proyecto tiene necesidades diferentes. Estos son algunos ejemplos de mi experiencia.',
      items: [
        {
          project_slug: 'bizteka',
          title: 'Bizteka',
          subtitle: 'Plataforma de servicios para empresas',
          text: 'Diseño de páginas, servicios y área personal. El proyecto incluyó análisis de competidores, recorridos de usuario, wireframes y colaboración con desarrolladores.',
          link_label: 'Ver proyecto Bizteka',
        },
        {
          project_slug: 'reab',
          title: 'REAB',
          subtitle: 'Plataforma de negocios y franquicias',
          text: 'Diseño de una plataforma digital para la compraventa de empresas y franquicias, incluyendo prototipos, interfaces adaptables y trabajo con el equipo de desarrollo.',
          link_label: 'Ver proyecto REAB',
        },
        {
          project_slug: 'vr-logistic',
          title: 'VR-Logistic',
          subtitle: 'Sitio web corporativo',
          text: 'Proyecto de diseño web para una empresa de logística, con estructura de navegación, prototipos, interfaces adaptables y colaboración durante el desarrollo.',
          link_label: 'Ver proyecto VR-Logistic',
        },
      ],
    },
    cards('¿Por qué trabajar conmigo?', [
      ['Más de 7 años de experiencia', 'He participado en proyectos digitales de diferentes tamaños y niveles de complejidad.'],
      ['Comunicación directa', 'Trabajas directamente conmigo, sin intermediarios innecesarios.'],
      ['Experiencia con equipos técnicos', 'Entiendo las necesidades del desarrollo y preparo interfaces pensando en su implementación.'],
      ['Colaboración flexible', 'Puedo participar en el diseño de un producto completo o ayudarte con una parte específica de tu proyecto.'],
    ]),
    cards('Así trabajaremos', [
      ['Conocemos tu proyecto', 'Hablamos sobre tu producto, sus usuarios, objetivos y principales necesidades.'],
      ['Definimos la estructura', 'Organizo la información y preparo los flujos y prototipos necesarios.'],
      ['Diseñamos la interfaz', 'Desarrollo el diseño visual en Figma y ajustamos los detalles a partir de tus comentarios.'],
      ['Preparamos la entrega', 'Organizo los archivos y colaboro con tu equipo para facilitar la implementación.'],
    ], { numbered: true }),
    {
      __component: 'landing.section-faq',
      title: 'Preguntas frecuentes',
      items: [
        ['¿Trabajas con empresas de México?',
          'Sí, puedo colaborar de forma remota con empresas y equipos de desarrollo en México.'],
        ['¿Puedo contratarte para rediseñar solo una parte de mi plataforma?',
          'Sí. Podemos trabajar en una funcionalidad, un flujo de usuario o un conjunto específico de pantallas.'],
        ['¿Necesito tener un equipo de desarrollo?',
          'No necesariamente para comenzar el diseño. Si ya tienes desarrolladores, puedo colaborar directamente con ellos.'],
        ['¿Cuánto cuesta un proyecto de diseño UX/UI?',
          'El presupuesto depende del número de pantallas, la complejidad del producto y el alcance del trabajo. Cuéntame qué necesitas y prepararé una propuesta.'],
      ].map(([question, answer]) => ({ question, answer })),
    },
    {
      __component: 'landing.section-contact',
      title: 'Hablemos de tu proyecto',
      text: paragraphs(
        '¿Necesitas diseñar una nueva plataforma, mejorar una interfaz existente o sumar una diseñadora UX/UI a tu equipo?',
        'Cuéntame un poco sobre tu proyecto y conversemos sobre cómo puedo ayudarte.',
      ),
      cta_label: 'Solicitar cotización',
      email_subject: 'Cotización de proyecto UX/UI',
      whatsapp_label: 'O escríbeme por WhatsApp',
      whatsapp_message: 'Hola, Diana. Me gustaría cotizar un proyecto de diseño UX/UI.',
      signature: 'Diana Konoiko · Diseñadora UX/UI freelance',
    },
  ],
};

async function main () {
  const app = await createStrapi(await compileStrapi()).load();
  app.log.level = 'error';

  try {
    const existing = await app.documents(UID).findFirst({ locale: LOCALE, filters: { slug: SLUG } });
    if (existing) {
      console.log(`Landing "${SLUG}" (${LOCALE}) already exists, left as is`);
      return;
    }

    await app.documents(UID).create({ locale: LOCALE, data });
    console.log(`Landing "${SLUG}" (${LOCALE}) created`);
  }
  finally {
    await app.destroy();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
