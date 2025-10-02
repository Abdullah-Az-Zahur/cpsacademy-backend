export default {
  async beforeCreate(event: any) {
    const { params } = event;
    if (!params?.data) return;

    // frontend send roleType
    const roleType = params.data.roleType;
    if (!roleType) return;

    // find role by 'type'
    const role = await strapi.entityService.findMany(
      "plugin::users-permissions.role",
      {
        filters: { type: { $eq: roleType } },
      }
    );

    if (Array.isArray(role) && role.length > 0) {
      // attach the role id to the user creation payload
      params.data.role = role[0].id;
      // remove roleType so it's not stored on the user model
      delete params.data.roleType;
    } else {
      // roleType not found — optional: throw or set to default role
      // throw new Error(`Invalid role: ${roleType}`);
      // or set to default (do nothing so default authenticated role applies)
      delete params.data.roleType;
    }
  },
};
