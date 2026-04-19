var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Base } from './Base.js';
import { autoBind } from '../decorators/autoBind.js';
import { listState } from '../store/ListState.js';
export class ListForm extends Base {
    isEditing = false;
    buttonContainer;
    formContainer;
    inputElement;
    closeFormBtn;
    constructor() {
        super('add-list', 'app', false, 'add-list-wrapper');
        this.buttonContainer = this.element.querySelector('#add-list-button');
        this.formContainer = this.element.querySelector('#add-list-form');
        this.inputElement = this.element.querySelector('.new-list-name');
        this.closeFormBtn = this.element.querySelector('.close-form');
        this.buttonContainer.addEventListener('click', this._toggleForm);
        this.closeFormBtn.addEventListener('click', this._toggleForm);
        this.formContainer.addEventListener('submit', this._handleAddList);
    }
    _toggleForm(event) {
        if (event)
            event.preventDefault();
        this.isEditing = !this.isEditing;
        if (this.isEditing) {
            this.buttonContainer.style.display = 'none';
            this.formContainer.style.display = 'block';
            this.inputElement.focus();
        }
        else {
            this.buttonContainer.style.display = 'flex';
            this.formContainer.style.display = 'none';
            this.inputElement.value = '';
        }
    }
    _handleAddList(event) {
        event.preventDefault();
        const listName = this.inputElement.value.trim();
        if (listName) {
            listState.addList(listName);
            this._toggleForm();
        }
    }
}
__decorate([
    autoBind
], ListForm.prototype, "_toggleForm", null);
__decorate([
    autoBind
], ListForm.prototype, "_handleAddList", null);
//# sourceMappingURL=ListForm.js.map