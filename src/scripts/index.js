import '../styles/index.scss';

import { Model } from './model';
import { View } from './view';

const model = new Model();
const view = new View();
const ymaps = window.ymaps;
class Controller {
    constructor(){
        this.container = container;
    }

    async init(){
        await ymaps.ready();
        model.initMap();

        model.createCluster(view.makeLayout('carousel'));
        model.map.geoObjects.add(model.cluster);

        if(localStorage.geoReview){
            model.store = JSON.parse(localStorage.geoReview);
            console.log('model.store', model.store);

            this.parseMarkers();
        }
    }
    addListenerToMap(){
        model.map.events.add('click', async function(e){
            if(!this.container.innerHTML){
                const coordsDom = {
                    X: e.get('domEvent').get('clientX'),
                    Y: e.get('domEvent').get('clientY'),
                };

                const coordsMark = e.get('coords');
                const placemark = await model.createMarkByCoords(coordsMark);
    
                this.container.innerHTML = view.render('form', this.objectForRender(placemark));
                view.positionModal(this.container, coordsDom);
                
                this.addListenerPlacemark(placemark);
            }
        },this);
    }
    addListenerToDom(){
        document.addEventListener('click', (e)=>{
            const target = e.target;

            e.preventDefault();

            if(target.tagName !== 'YMAPS' && target.tagName === 'BUTTON'){

                if(target.id === 'addReview'){
                    const formValue = this.getInputs();

                    if(!formValue){
                        alert('All inputs is required');
                    }
                    else{
                        model.addReview(formValue);

                        const reviewContainer = document.querySelector('.review__content');
                        reviewContainer.innerHTML = view.render('review', this.objectForRender(model.marker));
                        
                        this.addLocalStorage(model.marker);
                    }

                    
                }
                if(target.id === 'closeReview'){
                    this.container.innerHTML = '';
                    view.removeStyleModal(this.container);
                }
                if(target.id === 'clearLocalStorage'){
                    localStorage.clear();
                    model.clear();
                }
            }
        });
    }
    objectForRender(placemark){
        const obj = {
            coords: placemark.properties.get('myCoords'),
            id: placemark.properties.get('myId'),
            address: placemark.properties.get('myAddress'),
            reviewList: placemark.properties.get('myReviews'),
        };

        return obj;
    }
    addListenerPlacemark(placemark){
        placemark.events.add('click', (e)=>{
            view.removeStyleModal(this.container);

            const coordsDom = {
                X: e.get('domEvent').get('clientX'),
                Y: e.get('domEvent').get('clientY'),
            };

            model.marker = placemark;
            
            this.container.innerHTML = view.render('form', this.objectForRender(placemark));
            
            // const reviewContainer = document.querySelector('.review__content');
            // reviewContainer.innerHTML = view.render('review', this.objectForRender(model.marker));
            
            view.positionModal(this.container, coordsDom);
        });
    }
    getInputs(){
        const inputs = [...this.container.querySelectorAll('input,textarea')];

        if(inputs.every(item => item.value.trim())){
            return inputs;
        }
        return false;
    }
    addLocalStorage(mark){
        const markObj = this.objectForRender(mark);
        const index = model.store.findIndex(item =>{
            item.coords === mark.properties.get('myCoords');
        });
        
        if(index>=0){
            model.store[index] = markObj;
        }else{
            model.store.push(markObj);
        }

        localStorage.geoReview = JSON.stringify(model.store);
    }
    parseMarkers(){
        model.store.forEach(item => {
           const mark = model.createMarkByLocalStorage(item.coords, item);

            this.addListenerPlacemark(mark);
        });
    }
}

const container = document.querySelector('#review-container');

const controller = new Controller(container);
( async() =>{
    await controller.init();
    controller.addListenerToMap();
    controller.addListenerToDom();
})();