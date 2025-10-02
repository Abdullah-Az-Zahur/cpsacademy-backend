'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/custom-register',
      handler: 'auth.customRegister', // matches controller file + method
      config: { auth: false }, // public route
    },
  ],
};
