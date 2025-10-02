export default {
  async beforeCreate(event) {
    const { params } = event;
    if (!params?.data) return;

    const roleType = params.data.roleType; // e.g. "student", "developer", etc.
    if (!roleType) return; // no role requested — use default

    try {
      // find role by its `type` field
      const roles = await strapi.entityService.findMany(
        "plugin::users-permissions.role",
        {
          filters: { type: { $eq: roleType } },
          limit: 1,
        }
      );

      if (Array.isArray(roles) && roles.length > 0) {
        // set role id on user creation payload
        params.data.role = roles[0].id;
        delete params.data.roleType; // remove the helper field
      } else {
        // invalid roleType -> remove and use default role
        delete params.data.roleType;
      }
    } catch (err) {
      strapi.log.error("User beforeCreate lifecycle error:", err);
      // optionally throw to stop creation:
      // throw err;
    }
  },
};
