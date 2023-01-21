import Logo from "./extensions/logo-icon.svg"
export default {
  config: {
    auth: { logo: Logo },
    menu: { logo: Logo },
    head: { favicon: Logo },
    locales: ["ru", "en"],
    // theme: {
    //   colors: {
    //     primary100: "#f6ecfc",
    //     primary200: "#aaf1d0",
    //     primary500: "#08c4dc",
    //     primary600: "#0893ea",
    //     primary700: "#0b72bf",
    //     danger700: "#b72b1a",
    //     active: "#3d7cf1",
    //   },
    // },
    translations: {
      ru: {
        "app.components.LeftMenu.navbrand.title": "Portfolio dashboard",
        "app.components.LeftMenu.navbrand.workplace": "diana.vr9.ru",
        "app.components.HomePage.welcome.again": "Hi 👋",
        "app.components.HomePage.welcomeBlock.content.again": "Welcome to the system",
      },
      en: {
        "app.components.LeftMenu.navbrand.title": "Portfolio dashboard",
        "app.components.LeftMenu.navbrand.workplace": "diana.vr9.ru",
        "app.components.HomePage.welcome.again": "Привет 👋",
        "app.components.HomePage.welcomeBlock.content.again": "Добро пожаловать в систему",
      },
    },
    // Disable video tutorials
    tutorials: false,
    // Disable notifications about new Strapi releases
    notifications: { releases: false },
  },
  bootstrap() {},
};

/*
const config = {
  locales: [
    // 'ar',
    // 'fr',
    // 'cs',
    // 'de',
    // 'dk',
    // 'es',
    // 'he',
    // 'id',
    // 'it',
    // 'ja',
    // 'ko',
    // 'ms',
    // 'nl',
    // 'no',
    // 'pl',
    // 'pt-BR',
    // 'pt',
    'ru',
    // 'sk',
    // 'sv',
    // 'th',
    // 'tr',
    // 'uk',
    // 'vi',
    // 'zh-Hans',
    // 'zh',
  ],
};

const bootstrap = (app) => {};

export default {
  config,
  bootstrap,
};
*/
