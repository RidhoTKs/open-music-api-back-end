const ClientError = require('../../exception/ClientError');

class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._validate = validator;
  }

  async postAlbumHandler(request, h) {
    try {
      this._validate.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;

      const albumId = await this._service.addAlbum({ name, year });

      const response = h.response({
        status: 'success',
        data: {
          albumId,
        },
      });
      response.code(201);
      return response;
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
  } // end method of postAlbum

  async getAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const album = await this._service.getAlbumById(id);

      return ({
        status: 'success',
        data: {
          album,
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
  } // end of method getAlbumById

  async putAlbumByIdHandler(request, h) {
    try {
      this._validate.validateAlbumPayload(request.payload);
      const { id } = request.payload;
      const { name, year } = request.payload;
      this._service.editAlbumById(id, { name, year });
      return ({
        status: 'success',
        message: 'Album berhasil diperbarui',
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
  } // end of method putAlbumBIdHandler

  async deleteAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteAlbumById(id);

      return ({
        status: 'success',
        message: 'Album berhasil dihapus',
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
  } // end of method deleteAlbumByIdHandler
}

module.exports = AlbumHandler;
