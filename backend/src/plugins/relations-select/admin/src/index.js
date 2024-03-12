import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';
import PluginIcon from './components/PluginIcon';
import getTrad from './utils/getTrad'

const name = pluginPkg.strapi.name;

export default {
  register(app) {
    app.customFields.register({
      name: 'relations-select',
      pluginId,
      type: 'string',
      intlLabel: {
        id: getTrad(`${pluginId}.label`),
        defaultMessage: 'Relations Select',
      },
      intlDescription: {
        id: getTrad(`${pluginId}.description`),
        defaultMessage: 'Select sub relations',
      },
      icon: PluginIcon,
      components: {
        Input: async () => import('./components/RelationsSelect'),
      },
      options: {
        base: [
          {
            sectionTitle: null,
            items: [
              {
                name: 'options.name-parent',
                type: 'string',
                intlLabel: {
                  id: getTrad(`${pluginId}.name-parent.label`),
                  defaultMessage: '',
                },
                description: {
                  id: getTrad(`${pluginId}.name-parent.description`),
                  defaultMessage: '',
                },
              },
            ],
          },
        ],
        advanced: [
          {
            sectionTitle: {
              id: 'global.settings',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'required',
                type: 'checkbox',
                intlLabel: {
                  id: 'form.attribute.item.requiredField',
                  defaultMessage: 'Required field',
                },
              },
            ],
          },
        ],
      },
    });

    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    });
  },

  bootstrap(app) {},

  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(
          /* webpackChunkName: "translation-[request]" */ `./translations/${locale}.json`
        )
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
