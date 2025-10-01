import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::progress.progress', {
  config: {
    find: { auth: { scope: ['authenticated'] } }, // only logged-in users
    create: { auth: { scope: ['authenticated'] } },
    findOne: {
      auth: { scope: ['authenticated'] },
      policies: ['global::is-owner'],
    },
    update: {
      auth: { scope: ['authenticated'] },
      policies: ['global::is-owner'],
    },
    delete: {
      auth: { scope: ['authenticated'] },
      policies: ['global::is-owner'],
    },
  },
});
