<template>
  <div id="albums-table">
    <table v-if="displayedPhotos.length > 0">
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
          v-for="photo in items"
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
        },
        data() {
            return {
                rowAmount: 25,
                items: [],
                sortType: SortingTypes.BY_ALBUM_ID,
                displayedPhotos: [],
                sortingTypes: SortingTypes,
            }
        },
        watch: {
            rowAmount() {
                this.loadBatch();
            },
            displayedPhotos() {
                this.reloadPhotos();
            },
            sortType() {
                this.getSortedPhotos();
            },
            photos() {
                this.getSortedPhotos();
            }
        },
        mounted() {
            this.scroll();
        },
        methods: {
            reloadPhotos() {
                this.items = this.displayedPhotos.slice(0, this.rowAmount);
            },
            getSortedPhotos() {
                switch (this.sortType) {
                    case SortingTypes.BY_ALBUM_ID:
                        this.displayedPhotos = this.photos.slice().sort((a, b) => a.albumId - b.albumId);
                        break;
                    case SortingTypes.BY_ALBUM_TITLE: {
                        this.displayedPhotos = this.photos.slice().sort((a, b) =>
                            sortByTitle(getAlbum(a.albumId, this.albums), getAlbum(b.albumId, this.albums))
                        )
                        break;
                    }
                    case SortingTypes.BY_PHOTO_TITLE:
                        this.displayedPhotos = this.photos.slice().sort((a, b) => sortByTitle(a, b));
                        break;
                }
                this.scrollToTop();
                this.rowAmount = 25;
            },
            loadBatch() {
                this.items.push(this.displayedPhotos[this.rowAmount])
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