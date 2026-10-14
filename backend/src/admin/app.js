import Logo from "./extensions/logo-icon.svg"
export default {
  config: {
    auth: { logo: Logo },
    menu: { logo: Logo },
    head: { favicon: Logo },
    locales: ["ru", "en"],
    translations: {
      ru: {
        "app.components.LeftMenu.navbrand.title": "Portfolio dashboard",
        "app.components.LeftMenu.navbrand.workplace": "konoiko.design",
        "app.components.HomePage.welcome.again": "Привет 👋",
        "app.components.HomePage.welcomeBlock.content.again": "Добро пожаловать в систему",
      },
      en: {
        "app.components.LeftMenu.navbrand.title": "Portfolio dashboard",
        "app.components.LeftMenu.navbrand.workplace": "konoiko.design",
        "app.components.HomePage.welcome.again": "Hi 👋",
        "app.components.HomePage.welcomeBlock.content.again": "Welcome to the system",
      },
    },
    // Disable video tutorials
    tutorials: false,
    // Disable notifications about new Strapi releases
    notifications: { releases: false },
  },
};
