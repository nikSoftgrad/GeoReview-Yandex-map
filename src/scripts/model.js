
// export class Model {
//     constructor(){
//         this.map = null;
//         this.marker = null;
//         this.store = [];
//     }
//     clear(){
//         this.marker = null;
//         this.store = [];
//     }
//     initMap(){
//         this.map = new ymaps.Map('map', {
//             center: [47.258827504336296,39.71120850000003],
//             controls: [],
//             zoom: 15
//         });
//     }
//     async createPlacemarkByCoords(coords){
//         const response = await ymaps.geocode(coords);
//         const address = response.geoObjects.get(0).getAddressLine();
//         const placemark = this.createPlacemark(coords, { address });
//         this.marker = placemark;

//         return placemark;
//     }
//     createPlacemark(coords,properties){
//         const placemark = new ymaps.Placemark(coords,{
//             coords: coords,
//             myId: properties.id || Date.now(),
//             myAddress: properties.address,
//             myReview: properties.reviewList || []
//         },{
//             preset: 'islands#icon'
//         });

//         return placemark;
//     }
//     addLocalStorage(review){
//         console.log('review', review);
//         if(!this.store.length){
//             this.store.push(review);
//         }else{
//             if(this.store.filter(item => item.id === review.id).length){
//                 this.store.filter(item => item.id === review.id)[0].reviewList = review.reviewList;
//             }else{
//                 this.store.push(review);
//             }
//         }
//         console.log('this.store', this.store);

//         localStorage.setItem('geoReview', JSON.stringify(this.store));
//     }
//     createPlacemarkFromLocalStorage(coords, properties){
//         const placemark = this.createPlacemark(coords, properties);

//         return placemark;
//     }
// }

export class Model{
    constructor(){
        this.cluster = null;
        this.map = null;
        this.marker = null;
        this.store = [];
    }
    clear(){
        this.cluster.removeAll();
        this.marker = null;
        this.store = [];
    }
    initMap(){
        this.map = new ymaps.Map('map',{
            center: [47.258827504336296,39.71120850000003],
            zoom: 15,
            controls: []
        });
    }
    createCluster(layout){
        const clusterer = new ymaps.Clusterer({
            preset: 'islands#invertedVioletClusterIcons',
            clusterDisableClickZoom: true,
            clusterBalloonContentLayout: 'cluster#balloonCarousel',
            clusterBalloonItemContentLayout: layout,
            openBalloonOnClick: true
        });

        this.cluster = clusterer;
    }
    async createMarkByCoords(coords){
        const response = await ymaps.geocode(coords);
        const address = response.geoObjects.get(0).getAddressLine();

        const mark = this.createPlacemark(coords, { address });
        this.marker = mark;

        return mark;

    }
    createPlacemark(coords, properties){
        const mark = new ymaps.Placemark(coords, {
            myCoords: coords,
            myId: properties.id || Date.now(),
            myAddress: properties.address,
            myReviews: properties.reviewList || []
        },{
            preset: 'islands#violetDotIcon'
        });

        return mark;
    }
    addReview(review){
        const obj = {
            date: new Date().toLocaleString('ru', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            })
        };

        const placemarkReview = this.marker.properties.get('myReviews');
        
        review.forEach(input => {
            obj[input.name] = input.value;
            input.value = null;
        });
        
        placemarkReview.push(obj);
        
        if(!this.findMark(item => item.marker)){
            this.cluster.add(this.marker);
        }
    }
    findMark(f){
        const placemarks = this.cluster.getGeoObjects();
        const mark = placemarks.find(f);

        return mark;
    }
    createMarkByLocalStorage(coords, properties){
        const placemark = this.createPlacemark(coords, properties);
        this.cluster.add(placemark);

        return placemark;
    }
}