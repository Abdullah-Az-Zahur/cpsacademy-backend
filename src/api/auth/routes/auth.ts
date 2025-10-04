"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/custom-register",
      handler: "auth.customRegister", 
      config: { auth: false }, 
    },
    {
      method: "POST",
      path: "/custom-login",
      handler: "auth.customLogin",
      config: { auth: false },
    },
  ],
};
