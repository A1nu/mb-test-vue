<template>
  <div id="app" class="container">
    <h1>Albums</h1>
    Search: <input v-model="searchString" placeholder="input search string">
    <div>
      <input type="radio" v-model="selectedSearch" v-bind:value="searchTypes.SEARCH_BY_ALBUM_TITLE">&nbsp;Albums
      <input type="radio" v-model="selectedSearch" v-bind:value="searchTypes.SEARCH_BY_PHOTO_TITLE">&nbsp;Photos
    </div>
    <albums-table
            v-if="albums.length > 0 && photos.length"
            v-bind:albums="albums"
            v-bind:photos="photos"
            v-bind:search="{searchString, selectedSearch}" />
  </div>
</template>

<script>

import AlbumsTable from "./components/AlbumsTable";
import RestService from "./services/rest.service"
import {SearchTypes} from "./constants/SearchTypes";

const restService = new RestService();

export default {
  name: 'App',
  components: {
    AlbumsTable
  },
  data() {
    return {
      albums: [],
      photos: [],
      searchString: '',
      selectedSearch: SearchTypes.SEARCH_BY_ALBUM_TITLE,
      searchTypes: SearchTypes
    }
  },
  mounted() {
    restService.getAlbums().then(albums =>  {
      Object.freeze(albums);
      this.albums = albums;
    })
    restService.getPhotos().then(photos => {
      Object.freeze(photos);
      this.photos = photos;
    })
  }
}
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
