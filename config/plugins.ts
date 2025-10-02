export default ({ env }) => ({
  "users-permissions": {
    config: {
      register: {
        allowedFields: ["username", "email", "password", "roleType"], // <-- add roleType here
      },
    },
  },
});
