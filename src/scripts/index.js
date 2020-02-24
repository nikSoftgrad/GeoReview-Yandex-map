import '../styles/index.scss';

import { Model } from './model';
import { View } from './view';

const model = new Model();
const view = new View();
const ymaps = window.ymaps;
class Controller {
    constructor(container){
        this.container = container;
    }
    async init(){
        await ymaps.ready();
        model.initMap();
    }
    addListenerToMap(){
        model.map.events.add('click', async function(e){
            // get coords
            const coordsDom = {
                X: e.get('domEvent').get('clientX'),
                Y: e.get('domEvent').get('clientY'),
            };
            const coordsPlacemark = e.get('coords');

            // create placemark
            const placemark = await model.createPlacemarkByCoords(coordsPlacemark);

            //render modal
            this.container.innerHTML = view.render('form' , this.parseObject(placemark));
            view.positionStyleModal(this.container, coordsDom);


        },this);
    }
    addListenerToDom(){
        document.addEventListener('click', (e)=>{
            const target = e.target;

            e.preventDefault();

            if(target.tagName !== "YMAPS" && target.tagName === "BUTTON"){
                if(target.id === 'addReview'){
                    const validateForm = this.validateForm(this.container);

                    if(!validateForm){
                        alert('All inputs is required');
                    }
                    else{
                        const review = this.getValueForm(this.container, model.marker);

                        // render review
                        const reviewContent = document.querySelector('.review__content');
                        reviewContent.innerHTML = view.render('review', this.parseObject(model.marker));

                        // add to localSorege
                        model.addLocalStorage(this.parseObject(model.marker));

                        // add icon placemarker
                        model.map.geoObjects.add(model.marker);
                    }

                }
                if(target.id === 'closeReview'){
                    view.removeStyleModal(this.container);
                    this.container.innerHTML = '';
                }
            }
        });
    }
    parseObject(placemark){
        const obj = {
            coords: placemark.properties.get('coords'),
            id: placemark.properties.get('myId'),
            address: placemark.properties.get('myAddress'),
            reviewList: placemark.properties.get('myReview')
        };

        return obj;
    }
    validateForm(container){
        const inputs = [...container.querySelectorAll('input,textarea')];
        if(inputs.every(item => item.value.trim())){
            return inputs;
        }

        return false;
    }
    getValueForm(container, placemark){
        const inputs = [...container.querySelectorAll('input,textarea')];
        const obj = {};

        inputs.forEach(item =>{
            obj[item.name] = item.value;
            item.value = null;
        });

        const placemarkObj = this.parseObject(placemark);
        placemarkObj.reviewList.push(obj);

        return placemarkObj;
    }
}

const container = document.querySelector('#review-container');
const controller = new Controller(container);

( async()=>{
    await controller.init();
    controller.addListenerToMap();
    controller.addListenerToDom();
})();