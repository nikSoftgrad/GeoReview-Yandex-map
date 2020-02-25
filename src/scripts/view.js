const ymaps = window.ymaps;
export class View{
    constructor(){
        this.layouts = {
            carousel: '<a href="#" class = "baloon__address">{{properties.myAddress}}</a>' +
                        '<ul class = "baloon__reviews-list">' +
                            '{% for review in properties.myReviews %}' +
                            '<li class = "baloon__review-item">' +
                                '<h2 class = "baloon__review-place">{{review.place}}</h2>' +
                                '<div class ="baloon__review-alignment">' +
                                    '<div class = "baloon__review-text">{{review.reviewText}}</div>' +
                                    '<div class = "baloon__review-date">{{review.date}}</div>' +
                                '</div>' +
                            '</li>' +
                            '{% endfor %}' +
                        '</ul>'
        };
    }
    makeLayout(layout){
        const innerLayout = ymaps.templateLayoutFactory.createClass(this.layouts[layout]);

        return innerLayout;
    }
    render(template, data){
        template = template + 'Template';

        const templateSource = document.getElementById(template).innerHTML;
        const renderFn = Handlebars.compile(templateSource);

        return renderFn(data);
    }
    positionModal(container, coords){
        const containerSize = {
            width : parseInt(getComputedStyle(container).width),
            height : parseInt(getComputedStyle(container).height)
        };
        const domSize ={
            width : document.body.clientWidth,
            height : document.body.clientHeight
        };

        if((containerSize.width + coords.X) > domSize.width && (containerSize.height + coords.Y) > domSize.height ){
            container.style.bottom = 0 + 'px';
            container.style.left = 0 + 'px';
        }
        else if((containerSize.width + coords.X) > domSize.width){
            container.style.bottom = coords.Y + 'px';
            container.style.right = 0 + 'px';
        }
        else if((containerSize.height + coords.Y) > domSize.height){
            container.style.bottom = 0 + 'px';
            container.style.left = coords.X + 'px';
        }
        else{
            container.style.top = coords.Y + 'px';
            container.style.left = coords.X + 'px';
        }

        return container;
    }
    removeStyleModal(container){
        container.style.top = '';
        container.style.bottom = '';
        container.style.left = '';
        container.style.right = '';
    }
}