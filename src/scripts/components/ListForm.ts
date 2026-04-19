import { Base } from './Base.js';
import { autoBind } from '../decorators/autoBind.js';
import { listState } from '../store/ListState.js';

export class ListForm extends Base<HTMLDivElement> {
    private isEditing: boolean = false;
    private buttonContainer: HTMLDivElement;
    private formContainer: HTMLFormElement;
    private inputElement: HTMLInputElement;
    private closeFormBtn: HTMLElement;

    constructor() {
        super('add-list', 'app', false, 'add-list-wrapper');

        this.buttonContainer = this.element.querySelector('#add-list-button') as HTMLDivElement;
        this.formContainer = this.element.querySelector('#add-list-form') as HTMLFormElement;
        this.inputElement = this.element.querySelector('.new-list-name') as HTMLInputElement;
        this.closeFormBtn = this.element.querySelector('.close-form') as HTMLElement;

        this.buttonContainer.addEventListener('click', this._toggleForm);
        this.closeFormBtn.addEventListener('click', this._toggleForm);
        this.formContainer.addEventListener('submit', this._handleAddList);
    }

    @autoBind
    private _toggleForm(event?: Event) {
        if(event) event.preventDefault();
        this.isEditing = !this.isEditing;
        if (this.isEditing) {
            this.buttonContainer.style.display = 'none';
            this.formContainer.style.display = 'block';
            this.inputElement.focus();
        } else {
            this.buttonContainer.style.display = 'flex';
            this.formContainer.style.display = 'none';
            this.inputElement.value = '';
        }
    }

    @autoBind
    private _handleAddList(event: Event) {
        event.preventDefault();
        const listName = this.inputElement.value.trim();
        if (listName) {
            listState.addList(listName);
            this._toggleForm();
        }
    }
}
