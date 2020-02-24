
export class View{
    constructor(){}
    render(template, data){
        template = template + 'Template';

        const templateSource = document.querySelector(`#${template}`).innerHTML;
        const renderFn = Handlebars.compile(templateSource);

        return renderFn(data);
    }
    positionStyleModal(container, coords){
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

        return container;
    }
}