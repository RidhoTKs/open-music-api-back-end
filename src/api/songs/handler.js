const ClientError = require('../../exception/ClientError');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(request, h) {
    // use try catch block karena beberapa perintah akan melemparkan error berdasarkan kondisi
    try {
      // lakukan validasi terhadap input pada request.payload
      this._validator.validateSongPayload(request.payload);

      const {
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
      } = request.payload;

      const songId = await this._service.addSong({
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
      });

      const response = h.response({
        status: 'success',
        data: {
          songId,
        },
      });

      response.code(201);

      return response;
    } catch (error) {
      // cek apakah error berasal dari turunan ClientError
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // server error
      const response = h.response({
        status: 'error',
        message: 'Maaf terjadi kegagalan pada server kami',
      });

      response.code(500);
      console.error(error);

      return response;
    }
  }

  async getSongsHandler(request) {
    const { title, performer } = request.query;
    let songs = await this._service.getSongs();

    if (title !== undefined && performer !== undefined) {
      songs = songs.filter((value) => value.title.toUpperCase().includes(title.toUpperCase())
      && value.performer.toUpperCase().includes(performer.toUpperCase()));
    } else if (title !== undefined) {
      songs = songs.filter((value) => value.title.toUpperCase().includes(title.toUpperCase()));
    } else if (performer !== undefined) {
      songs = songs.filter((value) => value.performer.toUpperCase()
        .includes(performer.toUpperCase()));
    }

    return ({
      status: 'success',
      data: {
        songs,
      },
    });
  }

  async getSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const song = await this._service.getSongById(id);

      return ({
        status: 'success',
        data: {
          song,
        },
      });
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // server error
      const response = h.response({
        status: 'error',
        message: 'Maaf terjadi kegagalan pada server kami',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async putSongByIdHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const { id } = request.params;
      const {
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
      } = request.payload;

      await this._service.editSongById(id, {
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
      });
      return ({
        status: 'success',
        message: 'Lagu berhasil diperbarui',
      });
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteSongById(id);
      return ({
        status: 'success',
        message: 'Lagu berhasil dihapus',
      });
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = SongsHandler;
