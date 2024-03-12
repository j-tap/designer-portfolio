import type { Schema, Attribute } from '@strapi/strapi';

export interface CommonMeta extends Schema.Component {
  collectionName: 'components_common_metas';
  info: {
    displayName: 'meta';
    icon: 'feather';
  };
  attributes: {
    description: Attribute.Text;
    keywords: Attribute.Text;
  };
}

export interface PageContact extends Schema.Component {
  collectionName: 'components_page_contacts';
  info: {
    displayName: '\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u044B';
    description: '';
  };
  attributes: {
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 2;
      }>;
    link: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 2;
      }>;
    display: Attribute.JSON &
      Attribute.CustomField<
        'plugin::multi-select.multi-select',
        ['contacts', 'card']
      >;
  };
}

export interface PageHomeExperience extends Schema.Component {
  collectionName: 'components_page_home_experiences';
  info: {
    displayName: '\u0413\u043B\u0430\u0432\u043D\u0430\u044F - \u041E\u043F\u044B\u0442';
    description: '';
  };
  attributes: {
    title: Attribute.String &
      Attribute.DefaultTo<'\u041E \u043C\u043E\u0435\u043C \u043E\u043F\u044B\u0442\u0435'>;
    text: Attribute.RichText &
      Attribute.DefaultTo<'\u0412 \u0441\u0444\u0435\u0440\u0435 \u0434\u0438\u0437\u0430\u0439\u043D\u0430 \u044F \u0431\u043E\u043B\u0435\u0435 3\u0445 \u043B\u0435\u0442. \u0417\u0430 \u044D\u0442\u043E \u0432\u0440\u0435\u043C\u044F \u043C\u043D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u043E\u0440\u0430\u0431\u043E\u0442\u0430\u0442\u044C \u0441 \u0440\u0430\u0437\u043D\u043E\u0441\u0442\u043E\u0440\u043E\u043D\u043D\u0438\u043C\u0438 \u043F\u0440\u043E\u0435\u043A\u0442\u0430\u043C\u0438, \u043A\u0430\u043A \u043C\u0435\u043B\u043A\u0438\u0435 \u0441\u0442\u0430\u0440\u0442\u0430\u043F\u044B, \u0442\u0430\u043A \u0438 \u043C\u0430\u0441\u0448\u0442\u0430\u0431\u043D\u044B\u0435.'>;
  };
}

export interface PageHomeImportant extends Schema.Component {
  collectionName: 'components_page_home_importants';
  info: {
    displayName: '\u0413\u043B\u0430\u0432\u043D\u0430\u044F - \u0412\u0430\u0436\u043D\u043E\u0435';
    description: '';
  };
  attributes: {
    title: Attribute.String &
      Attribute.DefaultTo<'\u0422\u043E\u0436\u0435 \u0432\u0430\u0436\u043D\u043E\u0435'>;
    text: Attribute.RichText;
  };
}

export interface PageHomeSkills extends Schema.Component {
  collectionName: 'components_page_home_skills';
  info: {
    displayName: '\u0413\u043B\u0430\u0432\u043D\u0430\u044F - \u041D\u0430\u0432\u044B\u043A\u0438';
    description: '';
  };
  attributes: {
    title: Attribute.String &
      Attribute.DefaultTo<'\u041D\u0430\u0432\u044B\u043A\u0438'>;
    text: Attribute.RichText;
  };
}

export interface PageHomeTools extends Schema.Component {
  collectionName: 'components_page_home_tools';
  info: {
    displayName: '\u0413\u043B\u0430\u0432\u043D\u0430\u044F - \u0418\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u044B';
    description: '';
  };
  attributes: {
    title: Attribute.String &
      Attribute.DefaultTo<'\u0418\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u044B'>;
    text: Attribute.RichText;
  };
}

export interface ProjectColor extends Schema.Component {
  collectionName: 'components_project_colors';
  info: {
    displayName: '\u0426\u0432\u0435\u0442\u0430';
    description: '';
  };
  attributes: {
    color: Attribute.String &
      Attribute.Required &
      Attribute.CustomField<'plugin::color-picker.color'>;
  };
}

export interface ProjectCsylki extends Schema.Component {
  collectionName: 'components_project_csylki';
  info: {
    displayName: 'C\u0441\u044B\u043B\u043A\u0438';
    description: '';
  };
  attributes: {
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 2;
      }>;
    link: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 4;
      }>;
    ranc: Attribute.String;
  };
}

export interface ProjectFonts extends Schema.Component {
  collectionName: 'components_project_fonts';
  info: {
    displayName: '\u0428\u0440\u0438\u0444\u0442\u044B';
    description: '';
  };
  attributes: {
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 2;
      }>;
    file: Attribute.Media & Attribute.Required;
  };
}

export interface ProjectKategorii extends Schema.Component {
  collectionName: 'components_project_kategorii';
  info: {
    displayName: '\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438';
    description: '';
  };
  attributes: {
    categories: Attribute.Relation<
      'project.kategorii',
      'oneToMany',
      'api::category-project.category-project'
    >;
    subcategories: Attribute.Relation<
      'project.kategorii',
      'oneToMany',
      'api::subcategory-project.subcategory-project'
    >;
  };
}

export interface ProjectLeadTime extends Schema.Component {
  collectionName: 'components_project_lead_times';
  info: {
    displayName: '\u0412\u0440\u0435\u043C\u044F \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0438';
    description: '';
  };
  attributes: {
    start: Attribute.Date;
    end: Attribute.Date;
    hours: Attribute.Integer;
  };
}

export interface ProjectPage extends Schema.Component {
  collectionName: 'components_project_pages';
  info: {
    displayName: '\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430';
    description: '';
  };
  attributes: {
    type: Attribute.Enumeration<['default', 'other', 'mobile']> &
      Attribute.Required &
      Attribute.DefaultTo<'default'>;
    title: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    subtitle: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    images: Attribute.Media & Attribute.Required;
    active: Attribute.Boolean & Attribute.DefaultTo<true>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'common.meta': CommonMeta;
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
