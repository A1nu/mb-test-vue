<template>
    <div id="albums-table">
        <table v-if="displayedPhotos.length > 0">
            <thead>
            <tr>
                <th class="sortable" @click="sortType = sortingTypes.BY_ALBUM_ID" v-bind:class="{active: isSortTypeActive(sortingTypes.BY_ALBUM_ID)}">id</th>
                <th class="sortable" @click="sortType = sortingTypes.BY_ALBUM_TITLE" v-bind:class="{active: isSortTypeActive(sortingTypes.BY_ALBUM_TITLE)}">album title</th>
                <th class="sortable" @click="sortType = sortingTypes.BY_PHOTO_TITLE" v-bind:class="{active: isSortTypeActive(sortingTypes.BY_PHOTO_TITLE)}">photos title</th>
                <th>photos thumbnail</th>
            </tr>
            </thead>
            <tbody>
                <tr v-for="photo in items" :key="photo.id">
                    <td>{{photo.albumId}}</td>
                    <td>{{ photo.albumId | albumTitle(albums) }}</td>
                    <td>{{photo.title}}</td>
                    <td><a :href="photo.url" target="_blank"><img :src="photo.thumbnailUrl"></a> </td>
                </tr>
            </tbody>
        </table>
        <div v-if="displayedPhotos.length === 0">there are no items matched to your search</div>
    </div>
</template>


<script>
    import {sortByTitle} from "../utils/sorting";
    import {SearchTypes} from "../constants/SearchTypes";
    import {SortingTypes} from "../constants/SortingTypes";

    export default {
        name: "albums-table",
        props: {
            albums: Array,
            photos: Array,
            height: Number,
            search: {
                searchString: String,
                selectedSearch: SearchTypes
            }
        },
        data() {
            return {
                rowAmount: 25,
                items: [],
                sortType: SortingTypes.BY_ALBUM_ID,
                displayedPhotos: [],
                sortingTypes: SortingTypes,
                searchTypes: SearchTypes,
            }
        },
        watch: {
            rowAmount: function () {
                this.loadBatch();
            },
            displayedPhotos: function () {
                this.reloadPhotos();
            },
            sortType: function () {
                this.getSortedPhotos();
            },
            search: function () {
                this.applySearch();
                this.sortType = this.sortingTypes.BY_ALBUM_ID;
            }
        },
        filters: {
            albumTitle: function (id, albums) {
                return albums.find(album => album.id === id).title
            },
        },
        mounted() {
            this.applySearch();
            this.scroll();
        },
        methods: {
            reloadPhotos() {
                this.items = this.displayedPhotos.slice(0, this.rowAmount);
            },
            applySearch() {
                if (this.search.searchString.length === 0) {
                    this.displayedPhotos = this.photos.slice();
                    return;
                }
                switch (this.search.selectedSearch) {
                    case this.searchTypes.SEARCH_BY_ALBUM_TITLE:
                        this.displayedPhotos =
                            this.photos.slice()
                                .filter(photo =>
                                    this.getAlbum(photo.albumId).title.toLowerCase()
                                    .includes(this.search.searchString.trim().toLowerCase()
                                    ));
                        break;
                    case this.searchTypes.SEARCH_BY_PHOTO_TITLE:
                        this.displayedPhotos =
                            this.photos.slice()
                                .filter(photo =>
                                    photo.title.toLowerCase()
                                        .includes(this.search.searchString.trim().toLowerCase()
                                        ))
                }
            },
            getSortedPhotos() {
                switch (this.sortType) {
                    case SortingTypes.BY_ALBUM_ID:
                        this.displayedPhotos.sort((a, b) => a.albumId - b.albumId);
                        break;
                    case SortingTypes.BY_ALBUM_TITLE: {
                        this.displayedPhotos.sort((a, b) =>
                            sortByTitle(this.getAlbum(a.albumId), this.getAlbum(b.albumId))
                        )
                        break;
                    }
                    case SortingTypes.BY_PHOTO_TITLE:
                        this.displayedPhotos.sort((a, b) => sortByTitle(a, b));
                        break;
                }
                this.scrollToTop();
                this.rowAmount = 25;
            },
            getAlbum(albumId) {
                return this.albums.find(album => album.id === albumId)
            },
            loadBatch() {
                this.items.push(this.photos[this.rowAmount])
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