export default class RestService {
    async getAlbums() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/albums')
            return await response.json();
        } catch (error) {
            console.error(error)
        }
    }

    async getPhotos() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/photos')
            return await response.json();
        } catch (error) {
            console.error(error)
        }
    }
}