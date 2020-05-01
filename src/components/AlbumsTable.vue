<template>
  <div id="albums-table">
    <div v-if="photoCollection.length === 0 && photos.length > 0">
      there are no items matched to your search
    </div>
    <table v-if="photoCollection.length > 0">
      <thead>
        <tr>
          <th
            class="sortable"
            :class="{active: isSortTypeActive(sortingTypes.BY_ALBUM_ID)}"
            @click="sortType = sortingTypes.BY_ALBUM_ID"
          >
            id
          </th>
          <th
            class="sortable"
            :class="{active: isSortTypeActive(sortingTypes.BY_ALBUM_TITLE)}"
            @click="sortType = sortingTypes.BY_ALBUM_TITLE"
          >
            album title
          </th>
          <th
            class="sortable"
            :class="{active: isSortTypeActive(sortingTypes.BY_PHOTO_TITLE)}"
            @click="sortType = sortingTypes.BY_PHOTO_TITLE"
          >
            photos title
          </th>
          <th>photos thumbnail</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="photo in photosToDisplay"
          :key="photo.id"
        >
          <td>{{ photo.albumId }}</td>
          <td>{{ photo.albumId | albumTitle(albums) }}</td>
          <td>{{ photo.title }}</td>
          <td>
            <a
              :href="photo.url"
              target="_blank"
            ><img :src="photo.thumbnailUrl"></a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script>
  import { sortByTitle } from "../utils/sorting";
  import { SortingTypes } from "../constants/SortingTypes";
  import { getAlbum } from "../utils/DataGetters";
  import { SearchTypes } from "../constants/SearchTypes";

  export default {
    name: "AlbumsTable",
    filters: {
      albumTitle: function (id, albums) {
          return getAlbum(id, albums).title
      },
    },
    props: {
      albums: {
        type: Array,
        default: () => []
      },
      photos: {
        type: Array,
        default: () => []
      },
      selectedSearch: SearchTypes,
      searchString: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        rowAmount: 25,
        photosToDisplay: [],
        sortType: SortingTypes.BY_ALBUM_ID,
        photoCollection: [],
        sortingTypes: SortingTypes,
        searchTypes: SearchTypes,
      }
    },
    watch: {
      rowAmount() {
        this.loadBatch();
      },
      photoCollection() {
        this.reloadPhotos();
      },
      sortType() {
        this.applySorting();
      },
      photos() {
        this.applySearch();
      },
      searchString() {
        this.applySearch();
      },
      selectedSearch() {
        this.applySearch();
      }
    },
    mounted() {
      this.scroll();
    },
    methods: {
      reloadPhotos() {
        this.photosToDisplay = this.photoCollection.slice(0, this.rowAmount);
      },
      applySorting() {
        this.getSortedPhotos(this.photoCollection)
      },
      applySearch() {
        const collectionToFilter = this.photos.slice();
        if (this.searchString.length === 0) {
          this.getSortedPhotos(collectionToFilter);
          return;
        }
        const searchString = this.searchString.trim().toLowerCase();
        switch (this.selectedSearch) {
          case this.searchTypes.SEARCH_BY_ALBUM_TITLE:
            this.getSortedPhotos(collectionToFilter.filter(photo => getAlbum(photo.albumId, this.albums).title.toLowerCase().includes(searchString)))
            break;
          case this.searchTypes.SEARCH_BY_PHOTO_TITLE:
            this.getSortedPhotos(collectionToFilter.filter(photo => photo.title.toLowerCase().includes(searchString)))
            break;
          case this.searchTypes.SEARCH_BY_PHOTO_AND_ALBUM_TITLE:
            this.getSortedPhotos(collectionToFilter.filter(photo =>
                    getAlbum(photo.albumId, this.albums).title.toLowerCase().includes(searchString) ||
                    photo.title.toLowerCase().includes(searchString)))
        }
      },
      getSortedPhotos(collectionToSort) {
        switch (this.sortType) {
          case SortingTypes.BY_ALBUM_ID:
            this.photoCollection = collectionToSort.sort((a, b) => a.albumId - b.albumId);
            break;
            case SortingTypes.BY_ALBUM_TITLE: {
              this.photoCollection = collectionToSort.sort((a, b) =>
                    sortByTitle(getAlbum(a.albumId, this.albums), getAlbum(b.albumId, this.albums))
                )
                break;
            }
            case SortingTypes.BY_PHOTO_TITLE:
              this.photoCollection = collectionToSort.sort((a, b) => sortByTitle(a, b));
              break;
          }
          this.scrollToTop();
          this.rowAmount = 25;
      },
      loadBatch() {
        this.photosToDisplay.push(this.photoCollection[this.rowAmount])
      },
      increaseRowAmount() {
        this.rowAmount += 1;
      },
      isSortTypeActive(sortType) {
        return this.sortType === sortType
      },
      scroll () {
        window.onscroll = () => {
          let bottomOfWindow = Math.max(
              window.pageYOffset,
              document.documentElement.scrollTop,
              document.body.scrollTop
            ) + window.innerHeight === document.documentElement.offsetHeight

            if (bottomOfWindow) {
                this.increaseRowAmount();
            }
          }
      },
      scrollToTop() {
        window.scrollTo(0,0);
      }
    }
  }
</script>

<style scoped>
    table {
        text-align: left;
        position: relative;
        border-collapse: collapse;
    }
    th, td {
        padding: 0.25rem;
    }
    th {
        background: white;
        position: sticky;
        top: 0;
        box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);
    }
    .sortable {
        color: green;
        cursor: pointer;
    }
    .sortable.active {
        color: chartreuse;
    }
</style>