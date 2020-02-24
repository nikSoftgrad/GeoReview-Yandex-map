
export class Model {
    constructor(){
        this.map = null;
        this.marker = null;
        this.store = [];
    }
    initMap(){
        this.map = new ymaps.Map('map', {
            center: [47.258827504336296,39.71120850000003],
            controls: [],
            zoom: 15
        });
    }
    async createPlacemarkByCoords(coords){
        const response = await ymaps.geocode(coords);
        const address = response.geoObjects.get(0).getAddressLine();
        const placemark = this.createPlacemark(coords, { address });
        this.marker = placemark;

        return placemark;
    }
    createPlacemark(coords,properties){
        const placemark = new ymaps.Placemark(coords,{
            coords: coords,
            myId: properties.id || Date.now(),
            myAddress: properties.address,
            myReview: properties.reviewList || []
        },{
            preset: 'islands#icon'
        });

        return placemark;
    }
    addLocalStorage(review){
        if(!this.store.length){
            this.store.push(review);
        }else{


            this.store[0].reviewList = review.reviewList;
        }

        // localStorage.setItem('geoReview', JSON.stringify(this.store));
    }
}