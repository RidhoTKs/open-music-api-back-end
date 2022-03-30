const { nanoid } = require("nanoid");
const { Pool } = require("pg");

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  addAlbum({ name, year }) {
    const id = 'album'.concat('-', nanoid(16));
    
    const query = {
      text: 'INSERT INTO albums VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = this._pool.query(query);

    if (!result.rows[0].id) {
      throw new Error('Album gagal ditambahkan')
    }

    return result.rows[0].id;
  }
}
