module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const { id } = ctx.params; // expects routes like /api/progresses/:id
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('You must be logged in.');
    }

    if (!id) {
      // If no specific id in route, we can't check single ownership; allow to continue if needed
      return await next();
    }

    const progress = await strapi.entityService.findOne('api::progress.progress', id, {
      populate: ['user'],
    });

    if (!progress) {
      return ctx.notFound('Progress not found.');
    }

    // progress.user may be an object or id depending on populate
    const ownerId = progress.user?.id ?? progress.user;

    if (!ownerId || Number(ownerId) !== Number(user.id)) {
      return ctx.forbidden('You do not have permission to access this resource.');
    }

    // owner — continue
    await next();
  };
};
