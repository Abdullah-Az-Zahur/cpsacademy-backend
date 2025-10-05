export default ({ env }) => [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: [
        env('FRONTEND_URL'),   // uses env variable
        'http://localhost:3000', // dev local
      ],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      credentials: true, // allow cookies
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  {
    name: 'strapi::session',
    config: {
      secretKeys: env.array('APP_KEYS'),
      cookie: {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
      },
    },
  },
  'strapi::favicon',
  'strapi::public',
];
