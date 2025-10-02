'use strict';

module.exports = {
  async customRegister(ctx) {
    const { email, username, password, roleType } = ctx.request.body;

    if (!email || !password) {
      return ctx.badRequest('Email and password are required');
    }

    // Check if user already exists
    const existingUser = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { email },
    });

    if (existingUser) {
      return ctx.badRequest('Email is already taken');
    }

    // Find role by type if provided
    let roleId;
    if (roleType) {
      const roles = await strapi.entityService.findMany('plugin::users-permissions.role', {
        filters: { type: { $eq: roleType } },
        limit: 1,
      });

      if (roles.length === 0) {
        return ctx.badRequest('Invalid roleType');
      }

      roleId = roles[0].id;
    }

    // Create the new user
    const newUser = await strapi.plugins['users-permissions'].services.user.add({
      email,
      username,
      password,
      role: roleId, // assign role if found
      confirmed: true, // auto-confirm user
    });

    // Generate JWT token
    const jwt = strapi.plugins['users-permissions'].services.jwt.issue({ id: newUser.id });

    // Respond with user + token
    ctx.send({
      user: newUser,
      jwt,
    });
  },
};
