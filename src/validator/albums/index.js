const { albumPayloadSchema } = require('./schema');
const InvariantError = require('../../exception/InvariantError');

const AlbumsValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = albumPayloadSchema.validate(payload);
    if (validationResult) {
      throw new InvariantError(validationResult.error);
    }
  },
};

module.exports = AlbumsValidator;
