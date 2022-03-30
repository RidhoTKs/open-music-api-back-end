const InvariantError = require('../../exception/InvariantError');
const songsPayloadSchema = require('./schema');

const SongsValidator = {
  validateSongPaylod: (payload) => {
    const validationResult = songsPayloadSchema(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = SongsValidator;
