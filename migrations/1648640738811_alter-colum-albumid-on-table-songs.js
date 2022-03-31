/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.alterColumn('songs', 'album_id', {
    type: 'VARCHAR(50)',
    notNull: false,
  });
  pgm.alterColumn('songs', 'duration', {
    type: 'INT',
    notNull: false,
  });
};

exports.down = (pgm) => {};
