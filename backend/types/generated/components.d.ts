import type { Schema, Struct } from '@strapi/strapi';

export interface CommonMeta extends Struct.ComponentSchema {
  collectionName: 'components_common_metas';
  info: {
    displayName: 'meta';
    icon: 'feather';
  };
  attributes: {
    description: Schema.Attribute.Text;
    keywords: Schema.Attribute.Text;
  };
}

export interface CommonSeo extends Struct.ComponentSchema {
  collectionName: 'components_common_seos';
  info: {
    description: '\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u0438 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F \u043F\u043E\u0438\u0441\u043A\u043E\u0432\u0438\u043A\u043E\u0432 \u0438 \u0441\u043E\u0446\u0441\u0435\u0442\u0435\u0439. \u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u0432\u044B\u0432\u043E\u0434\u0438\u0442\u0441\u044F \u043A\u0430\u043A \u0435\u0441\u0442\u044C, \u0431\u0435\u0437 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044F \u0441\u0430\u0439\u0442\u0430';
    displayName: 'SEO';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    image: Schema.Attribute.Media<'images'>;
    keywords: Schema.Attribute.Text;
    title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 70;
      }>;
  };
}

export interface DonateRequisite extends Struct.ComponentSchema {
  collectionName: 'components_donate_requisites';
  info: {
    description: '';
    displayName: '\u0420\u0435\u043A\u0432\u0438\u0437\u0438\u0442';
  };
  attributes: {
    label: Schema.Attribute.String;
    link: Schema.Attribute.String;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface LandingCard extends Struct.ComponentSchema {
  collectionName: 'components_landing_cards';
  info: {
    description: '';
    displayName: '\u041F\u043E\u0441\u0430\u0434\u043E\u0447\u043D\u0430\u044F - \u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0430';
  };
  attributes: {
    text: Schema.Attribute.RichText;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface LandingCase extends Struct.ComponentSchema {
  collectionName: 'components_landing_cases';
  info: {
    description: 'project_slug \u2014 slug \u043F\u0440\u043E\u0435\u043A\u0442\u0430 \u0438\u0437 \u0440\u0430\u0437\u0434\u0435\u043B\u0430 \u00AB\u041F\u0440\u043E\u0435\u043A\u0442\u044B\u00BB: \u0441 \u043D\u0435\u0433\u043E \u0431\u0435\u0440\u0443\u0442\u0441\u044F \u043E\u0431\u043B\u043E\u0436\u043A\u0430 \u0438 \u0441\u0441\u044B\u043B\u043A\u0430 \u043D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443 \u043F\u0440\u043E\u0435\u043A\u0442\u0430';
    displayName: '\u041F\u043E\u0441\u0430\u0434\u043E\u0447\u043D\u0430\u044F - \u041F\u0440\u043E\u0435\u043A\u0442';
  };
  attributes: {
    link_label: Schema.Attribute.String;
    project_slug: Schema.Attribute.String;
    subtitle: Schema.Attribute.String;
    text: Schema.Attribute.RichText;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface LandingFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_landing_faq_items';
  info: {
    description: '';
    displayName: '\u041F\u043E\u0441\u0430\u0434\u043E\u0447\u043D\u0430\u044F - \u0412\u043E\u043F\u0440\u043E\u0441';
  };
  attributes: {
    answer: Schema.Attribute.RichText & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface LandingHero extends Struct.ComponentSchema {
  collectionName: 'components_landing_heroes';
  info: {
    description: '\u0422\u0435\u043A\u0441\u0442 \u043F\u043E\u0434 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u043E\u043C H1 \u0438 \u043A\u043D\u043E\u043F\u043A\u0438. \u041A\u043D\u043E\u043F\u043A\u0438 \u0432\u0435\u0434\u0443\u0442 \u043A \u0440\u0430\u0437\u0434\u0435\u043B\u0430\u043C \u00AB\u041F\u0440\u043E\u0435\u043A\u0442\u044B\u00BB \u0438 \u00AB\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u044B\u00BB \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B';
    displayName: '\u041F\u043E\u0441\u0430\u0434\u043E\u0447\u043D\u0430\u044F - \u041F\u0435\u0440\u0432\u044B\u0439 \u044D\u043A\u0440\u0430\u043D';
  };
  attributes: {
    cta_label: Schema.Attribute.String;
    lead: Schema.Attribute.Text;
    marquee: Schema.Attribute.String;
    note: Schema.Attribute.String;
    projects_label: Schema.Attribute.String;
    text: Schema.Attribute.RichText;
  };
}

export interface LandingSectionCards extends Struct.ComponentSchema {
  collectionName: 'components_landing_section_cards';
  info: {
    description: '\u0423\u0441\u043B\u0443\u0433\u0438, \u043F\u0440\u0435\u0438\u043C\u0443\u0449\u0435\u0441\u0442\u0432\u0430, \u044D\u0442\u0430\u043F\u044B \u0440\u0430\u0431\u043E\u0442\u044B. numbered \u2014 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0441 \u043D\u043E\u043C\u0435\u0440\u0430\u043C\u0438 (\u044D\u0442\u0430\u043F\u044B)';
    displayName: '\u041F\u043E\u0441\u0430\u0434\u043E\u0447\u043D\u0430\u044F - \u0420\u0430\u0437\u0434\u0435\u043B \u0441 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430\u043C\u0438';
  };
  attributes: {
    items: Schema.Attribute.Component<'landing.card', true>;
    numbered: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    text: Schema.Attribute.RichText;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface LandingSectionCases extends Struct.ComponentSchema {
  collectionName: 'components_landing_section_cases';
  info: {
    description: '\u041A \u044D\u0442\u043E\u043C\u0443 \u0440\u0430\u0437\u0434\u0435\u043B\u0443 \u0432\u0435\u0434\u0451\u0442 \u043A\u043D\u043E\u043F\u043A\u0430 \u00AB\u043F\u0440\u043E\u0435\u043A\u0442\u044B\u00BB \u043F\u0435\u0440\u0432\u043E\u0433\u043E \u044D\u043A\u0440\u0430\u043D\u0430';
    displayName: '\u041F\u043E\u0441\u0430\u0434\u043E\u0447\u043D\u0430\u044F - \u041F\u0440\u043E\u0435\u043A\u0442\u044B';
  };
  attributes: {
    items: Schema.Attribute.Component<'landing.case', true>;
    text: Schema.Attribute.RichText;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface LandingSectionContact extends Struct.ComponentSchema {
  collectionName: 'components_landing_section_contacts';
  info: {
    description: '\u041A\u043D\u043E\u043F\u043A\u0430 \u2014 \u043F\u0438\u0441\u044C\u043C\u043E \u043D\u0430 E-mail \u0438\u0437 \u00AB\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u043E\u0432\u00BB, \u0441\u0441\u044B\u043B\u043A\u0430 \u2014 WhatsApp \u043E\u0442\u0442\u0443\u0434\u0430 \u0436\u0435. \u041A \u0440\u0430\u0437\u0434\u0435\u043B\u0443 \u0432\u0435\u0434\u0451\u0442 \u0433\u043B\u0430\u0432\u043D\u0430\u044F \u043A\u043D\u043E\u043F\u043A\u0430 \u043F\u0435\u0440\u0432\u043E\u0433\u043E \u044D\u043A\u0440\u0430\u043D\u0430';
    displayName: '\u041F\u043E\u0441\u0430\u0434\u043E\u0447\u043D\u0430\u044F - \u041A\u043E\u043D\u0442\u0430\u043A\u0442\u044B';
  };
  attributes: {
    cta_label: Schema.Attribute.String;
    email_subject: Schema.Attribute.String;
    signature: Schema.Attribute.String;
    text: Schema.Attribute.RichText;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    whatsapp_label: Schema.Attribute.String;
    whatsapp_message: Schema.Attribute.Text;
  };
}

export interface LandingSectionFaq extends Struct.ComponentSchema {
  collectionName: 'components_landing_section_faqs';
  info: {
    description: '\u0412\u043E\u043F\u0440\u043E\u0441\u044B \u043F\u043E\u043F\u0430\u0434\u0430\u044E\u0442 \u0438 \u0432 \u0440\u0430\u0437\u043C\u0435\u0442\u043A\u0443 FAQPage \u0434\u043B\u044F \u043F\u043E\u0438\u0441\u043A\u043E\u0432\u0438\u043A\u043E\u0432';
    displayName: '\u041F\u043E\u0441\u0430\u0434\u043E\u0447\u043D\u0430\u044F - \u0412\u043E\u043F\u0440\u043E\u0441\u044B \u0438 \u043E\u0442\u0432\u0435\u0442\u044B';
  };
  attributes: {
    items: Schema.Attribute.Component<'landing.faq-item', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageContact extends Struct.ComponentSchema {
  collectionName: 'components_page_contacts';
  info: {
    description: '';
    displayName: '\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u044B';
  };
  attributes: {
    display: Schema.Attribute.JSON &
      Schema.Attribute.CustomField<
        'plugin::multi-select.multi-select',
        ['contacts', 'card']
      >;
    link: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 2;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 2;
      }>;
  };
}

export interface PageHomeExperience extends Struct.ComponentSchema {
  collectionName: 'components_page_home_experiences';
  info: {
    description: '';
    displayName: '\u0413\u043B\u0430\u0432\u043D\u0430\u044F - \u041E\u043F\u044B\u0442';
  };
  attributes: {
    text: Schema.Attribute.RichText &
      Schema.Attribute.DefaultTo<'\u0412 \u0441\u0444\u0435\u0440\u0435 \u0434\u0438\u0437\u0430\u0439\u043D\u0430 \u044F \u0431\u043E\u043B\u0435\u0435 3\u0445 \u043B\u0435\u0442. \u0417\u0430 \u044D\u0442\u043E \u0432\u0440\u0435\u043C\u044F \u043C\u043D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u043E\u0440\u0430\u0431\u043E\u0442\u0430\u0442\u044C \u0441 \u0440\u0430\u0437\u043D\u043E\u0441\u0442\u043E\u0440\u043E\u043D\u043D\u0438\u043C\u0438 \u043F\u0440\u043E\u0435\u043A\u0442\u0430\u043C\u0438, \u043A\u0430\u043A \u043C\u0435\u043B\u043A\u0438\u0435 \u0441\u0442\u0430\u0440\u0442\u0430\u043F\u044B, \u0442\u0430\u043A \u0438 \u043C\u0430\u0441\u0448\u0442\u0430\u0431\u043D\u044B\u0435.'>;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u041E \u043C\u043E\u0435\u043C \u043E\u043F\u044B\u0442\u0435'>;
  };
}

export interface PageHomeImportant extends Struct.ComponentSchema {
  collectionName: 'components_page_home_importants';
  info: {
    description: '';
    displayName: '\u0413\u043B\u0430\u0432\u043D\u0430\u044F - \u0412\u0430\u0436\u043D\u043E\u0435';
  };
  attributes: {
    text: Schema.Attribute.RichText;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u0422\u043E\u0436\u0435 \u0432\u0430\u0436\u043D\u043E\u0435'>;
  };
}

export interface PageHomeSkills extends Struct.ComponentSchema {
  collectionName: 'components_page_home_skills';
  info: {
    description: '';
    displayName: '\u0413\u043B\u0430\u0432\u043D\u0430\u044F - \u041D\u0430\u0432\u044B\u043A\u0438';
  };
  attributes: {
    text: Schema.Attribute.RichText;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u041D\u0430\u0432\u044B\u043A\u0438'>;
  };
}

export interface PageHomeTools extends Struct.ComponentSchema {
  collectionName: 'components_page_home_tools';
  info: {
    description: '';
    displayName: '\u0413\u043B\u0430\u0432\u043D\u0430\u044F - \u0418\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u044B';
  };
  attributes: {
    text: Schema.Attribute.RichText;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u0418\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u044B'>;
  };
}

export interface ProjectColor extends Struct.ComponentSchema {
  collectionName: 'components_project_colors';
  info: {
    description: '';
    displayName: '\u0426\u0432\u0435\u0442\u0430';
  };
  attributes: {
    color: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.CustomField<'plugin::color-picker.color'>;
  };
}

export interface ProjectCsylki extends Struct.ComponentSchema {
  collectionName: 'components_project_csylki';
  info: {
    description: '';
    displayName: 'C\u0441\u044B\u043B\u043A\u0438';
  };
  attributes: {
    link: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 4;
      }>;
    ranc: Schema.Attribute.String;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 2;
      }>;
  };
}

export interface ProjectFonts extends Struct.ComponentSchema {
  collectionName: 'components_project_fonts';
  info: {
    description: '';
    displayName: '\u0428\u0440\u0438\u0444\u0442\u044B';
  };
  attributes: {
    file: Schema.Attribute.Media<'files'> & Schema.Attribute.Required;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 2;
      }>;
  };
}

export interface ProjectKategorii extends Struct.ComponentSchema {
  collectionName: 'components_project_kategorii';
  info: {
    description: '';
    displayName: '\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438';
  };
  attributes: {
    categories: Schema.Attribute.Relation<
      'oneToMany',
      'api::category-project.category-project'
    >;
    subcategories: Schema.Attribute.Relation<
      'oneToMany',
      'api::subcategory-project.subcategory-project'
    >;
  };
}

export interface ProjectLeadTime extends Struct.ComponentSchema {
  collectionName: 'components_project_lead_times';
  info: {
    description: '';
    displayName: '\u0412\u0440\u0435\u043C\u044F \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0438';
  };
  attributes: {
    end: Schema.Attribute.Date;
    hours: Schema.Attribute.Integer;
    start: Schema.Attribute.Date;
  };
}

export interface ProjectPage extends Struct.ComponentSchema {
  collectionName: 'components_project_pages';
  info: {
    description: '';
    displayName: '\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430';
  };
  attributes: {
    active: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    images: Schema.Attribute.Media<'images', true> & Schema.Attribute.Required;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    type: Schema.Attribute.Enumeration<['default', 'other', 'mobile']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'default'>;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'common.meta': CommonMeta;
      'common.seo': CommonSeo;
      'donate.requisite': DonateRequisite;
      'landing.card': LandingCard;
      'landing.case': LandingCase;
      'landing.faq-item': LandingFaqItem;
      'landing.hero': LandingHero;
      'landing.section-cards': LandingSectionCards;
      'landing.section-cases': LandingSectionCases;
      'landing.section-contact': LandingSectionContact;
      'landing.section-faq': LandingSectionFaq;
      'page.contact': PageContact;
      'page.home-experience': PageHomeExperience;
      'page.home-important': PageHomeImportant;
      'page.home-skills': PageHomeSkills;
      'page.home-tools': PageHomeTools;
      'project.color': ProjectColor;
      'project.csylki': ProjectCsylki;
      'project.fonts': ProjectFonts;
      'project.kategorii': ProjectKategorii;
      'project.lead-time': ProjectLeadTime;
      'project.page': ProjectPage;
    }
  }
}
