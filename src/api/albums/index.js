const routes = require('./routes');
const AlbumHandler = require('./handler');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    // buat object albumhandler
    const albumHandler = new AlbumHandler(service, validator);
    // masukan routes yang sudah dibuat kedalam server.route
    server.route(routes(albumHandler));
  },
};
