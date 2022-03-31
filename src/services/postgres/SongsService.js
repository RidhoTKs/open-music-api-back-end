const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exception/InvariantError');
const NotFoundError = require('../../exception/NotFoundError');
const { mapGetSongs } = require('../../utils');

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title,
    year,
    genre,
    performer,
    duration,
    albumId,
  }) {
    // generete id
    const id = 'song'.concat('-', nanoid(16));

    // generete object query
    const query = {
      text: 'INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId],
    };

    // jalankan query
    const result = await this._pool.query(query);

    // cek jika query berhasil dijalankan
    if (!result.rows[0].id) {
      throw new InvariantError('Song gagal ditambahkan');
    }

    // kembalikan nilai dari data yang baru saja ditambahkan
    return result.rows[0].id;
  }

  async getSongs(title = undefined, performer = undefined) {
    const query = {
      text: 'SELECT * FROM songs',
    };

    if (title !== undefined && performer !== undefined) {
      query.text = 'SELECT * FROM songs WHERE title=$1 AND performer=$2';
      query.values = [title, performer];
    } else if (title !== undefined) {
      query.text = 'SELECT * FROM songs WHERE title=$1';
      query.values = [title];
    } else if (performer !== undefined) {
      query.text = 'SELECT * FROM songs WHERE performer=$1';
      query.values = [performer];
    }

    const songs = await this._pool.query(query);
    return songs.rows.map(mapGetSongs);
  }

  async getSongById(id) {
    // genereate query object
    const query = {
      text: 'SELECT * FROM songs WHERE id=$1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows[0];
  }

  async editSongById(id, {
    title,
    year,
    genre,
    performer,
    duration,
    albumId,
  }) {
    // generete query object
    const query = {
      text: 'UPDATE songs SET title=$1, year=$2, genre=$3, performer=$4, duration=$5, album_id=$6 WHERE id=$7 RETURNING id',
      values: [
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
        id,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal diperbarui, id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    // generete query object
    const query = {
      text: 'DELETE FROM songs WHERE id=$1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus, id tidak ditemukan');
    }
  }
}

module.exports = SongService;
