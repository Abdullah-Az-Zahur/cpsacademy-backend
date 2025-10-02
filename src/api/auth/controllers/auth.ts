"use strict";

module.exports = {
  async customRegister(ctx) {
    const { email, username, password, roleType } = ctx.request.body;

    if (!email || !password) {
      return ctx.badRequest("Email and password are required");
    }

    // Check if user already exists
    const existingUser = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({
        where: { email },
      });

    if (existingUser) {
      return ctx.badRequest("Email is already taken");
    }

    // Find role by type if provided
    let roleId;
    if (roleType) {
      const roles = await strapi.entityService.findMany(
        "plugin::users-permissions.role",
        {
          filters: { type: { $eq: roleType } },
          limit: 1,
        }
      );

      if (roles.length === 0) {
        return ctx.badRequest("Invalid roleType");
      }

      roleId = roles[0].id;
    }

    // Create the new user
    const newUser = await strapi.plugins["users-permissions"].services.user.add(
      {
        email,
        username,
        password,
        role: roleId, // assign role if found
        confirmed: true, // auto-confirm user
      }
    );

    // Generate JWT token
    const jwt = strapi.plugins["users-permissions"].services.jwt.issue({
      id: newUser.id,
    });

    // Respond with user + token
    ctx.send({
      user: newUser,
      jwt,
    });
  },

  async customLogin(ctx) {
    const { email, password } = ctx.request.body;

    if (!email || !password) {
      return ctx.badRequest("Email and password are required");
    }

    try {
      // 1) find user by email
      const user = await strapi.db
        .query("plugin::users-permissions.user")
        .findOne({
          where: { email },
          populate: ["role"], // include role relation
        });

      if (!user) {
        return ctx.badRequest("Invalid email or password");
      }

      // 2) validate password using users-permissions user service (exists in most installs)
      const isValid = await strapi.plugins[
        "users-permissions"
      ].services.user.validatePassword(password, user.password);

      if (!isValid) {
        return ctx.badRequest("Invalid email or password");
      }

      // 3) issue jwt
      const jwt = strapi.plugins["users-permissions"].services.jwt.issue({
        id: user.id,
      });

      // 4) sanitize user object to return only safe fields
      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role?.type || "authenticated",
      };

      return ctx.send({ user: safeUser, jwt });
    } catch (err) {
      strapi.log.error("customLogin error:", err);
      return ctx.internalServerError("An error occurred during login");
    }
  },
};
