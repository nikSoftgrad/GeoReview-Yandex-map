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