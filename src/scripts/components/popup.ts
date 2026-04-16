import { Base } from './Base.js';
export class Popup extends Base<HTMLDivElement> {
    constructor() {
        super('popup_template', 'app', false, 'popup_container'); 
        this._closePopup();
    }

    /**
     * @desc close popup
     */
    private _closePopup() : void {
        const closeButton = this.element.querySelector('.close')! as HTMLButtonElement;
        closeButton.addEventListener('click', () => {
            this.element.classList.remove('visible_popup');
        });
    }

}