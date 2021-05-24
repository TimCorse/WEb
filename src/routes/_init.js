const newsRoutes = require('./news');
module.exports = (app, db) => {
  newsRoutes(app, db);
};
