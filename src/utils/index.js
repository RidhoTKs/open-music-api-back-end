const mapGetSongs = (value) => {
  const objectSong = {};
  objectSong.id = value.id;
  objectSong.title = value.title;
  objectSong.performer = value.performer;

  return objectSong;
};

module.exports = { mapGetSongs };
