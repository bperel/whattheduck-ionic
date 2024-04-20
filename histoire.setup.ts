import { IonicVue } from '@ionic/vue';
import { createPinia } from 'pinia';
import { i18n } from '~web';

import router from './src/router';

import en from '~translations/en.json';
import sv from '~translations/sv.json';

import { useSocket } from '~socket.io-client-services/index';

import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { defineSetupVue3 } from '@histoire/plugin-vue';
import './histoire.css';

export const setupVue3 = defineSetupVue3(({ app }) => {
  defineCustomElements(window);

  if (!window.CustomEvent) {
    // Create only if it doesn't exist
    (function () {
      function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
      }

      CustomEvent.prototype = window.Event.prototype;

      window.CustomEvent = CustomEvent;
    })();
  }

  app
    .use(IonicVue)
    .use(router)
    .use(createPinia())
    .use(i18n('en', { en, sv }).instance)
    .provide('socket', useSocket(import.meta.env.VITE_DM_SOCKET_URL));
});
