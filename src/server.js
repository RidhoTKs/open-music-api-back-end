const Hapi = require('@hapi/hapi');
require('dotenv').config();
const albums = require('./api/albums');
const songs = require('./api/songs');
const AlbumService = require('./services/postgres/AlbumsService');
const AlbumValidator = require('./validator/albums');
const SongService = require('./services/postgres/SongsService');
const SongValidator = require('./validator/songs');

const init = async () => {
  // buat object service
  const albumService = new AlbumService();
  const songService = new SongService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songService,
        validator: SongValidator,
      },
    },
  ]);

  await server.start();

  console.log(`server berjalan pada ${server.info.uri}`);
};

init();
