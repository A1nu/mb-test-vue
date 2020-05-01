export const getAlbum = (albumId, albums ) => {
    return albums.find(album => album.id === albumId);
};