// src/plugins/users-permissions/server/content-types/user/lifecycles.ts

export default {
  async beforeCreate(event: {
    params: { data: Record<string, any> };
  }) {
    const { params } = event;
    if (!params?.data) return;

    const roleType = params.data.roleType;
    if (!roleType) return; // no roleType -> use default

    try {
      // Find role by type
      const roles = await strapi.entityService.findMany(
        "plugin::users-permissions.role",
        {
          filters: { type: { $eq: roleType } },
          limit: 1,
        }
      );

      if (Array.isArray(roles) && roles.length > 0) {
        params.data.role = roles[0].id; // assign role ID
      }

      delete params.data.roleType; // remove helper field
    } catch (err) {
      strapi.log.error("User beforeCreate lifecycle error:", err);
    }
  },
};
