import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::progress.progress', ({ strapi }) => ({
  async find(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized();
    }

    const results = await strapi.entityService.findMany('api::progress.progress', {
      filters: {
        $and: [
          { user: { id: { $eq: user.id } } } as any, // TypeScript-safe filter
        ],
      },
      populate: 'user,course', // TS-safe
    });

    return this.transformResponse(results);
  },

  async create(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized();
    }

    const data = ctx.request.body?.data ?? ctx.request.body;
    data.user = user.id;

    const entry = await strapi.entityService.create('api::progress.progress', {
      data,
      populate: 'user,course', // TS-safe
    });

    return this.transformResponse(entry);
  },
}));
