export default (config, { strapi }) => {
  return async (ctx, next) => {
    const { id } = ctx.params;
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('You must be logged in.');
    }

    if (!id) {
      // no specific id provided
      return await next();
    }

    const progress = await strapi.entityService.findOne('api::progress.progress', id, {
      populate: ['user'],
    });

    if (!progress) {
      return ctx.notFound('Progress not found.');
    }

    const ownerId = progress.user?.id ?? progress.user;

    if (!ownerId || Number(ownerId) !== Number(user.id)) {
      return ctx.forbidden('You do not have permission to access this resource.');
    }

    await next();
  };
};
