var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { autoBind } from '../decorators/autoBind.js';
import { projectState } from '../store/ProjectState.js';
import { assignValidateInputs, handleValidationErrors } from '../utils/validation/validation_helpers.js';
import { Base } from './Base.js';
import { listState } from '../store/ListState.js';
export class Fields extends Base {
    constructor() {
        super('fields', 'app', true, 'form');
        this._addProject();
    }
    _addProject() {
        this.element.addEventListener('submit', this._handleAddProject);
    }
    _handleAddProject(event) {
        event.preventDefault();
        const [titleInput, descInput] = this._targetInputs();
        const [titleValue, descValue] = this._getInputsValues(titleInput, descInput);
        this._validateInputsValues(titleValue, descValue);
        if (this._validateInputsValues(titleValue, descValue)) {
            const payload = {
                id: Math.random().toString(),
                title: titleValue,
                desc: descValue,
                status: (listState.lists.length > 0 ? listState.lists[0] : 'Initial')
            };
            projectState.createProject(payload);
            this._clearInputs(titleInput, descInput);
        }
        return;
    }
    _clearInputs(titleInput, descInput) {
        titleInput.value = '';
        descInput.value = '';
    }
    _getInputsValues(titleInput, descInput) {
        const titleValue = titleInput.value;
        const descValue = descInput.value;
        return [titleValue, descValue];
    }
    _targetInputs() {
        const titleInput = document.getElementById("title");
        const descInput = document.getElementById("desc");
        return [titleInput, descInput];
    }
    _validateInputsValues(titleValue, descValue) {
        const [titleInputRule, descInputRule] = assignValidateInputs(titleValue, descValue);
        const titleErrorMessage = titleInputRule ? handleValidationErrors(titleInputRule) : '';
        const descErrorMessage = descInputRule ? handleValidationErrors(descInputRule) : '';
        const popupContainer = document.getElementById('popup_container');
        const descPopup = popupContainer.querySelector('.desc_popup');
        if (titleErrorMessage.length) {
            descPopup.textContent = titleErrorMessage;
            popupContainer.classList.add('visible_popup');
            return false;
        }
        else if (descErrorMessage.length) {
            descPopup.textContent = descErrorMessage;
            popupContainer.classList.add('visible_popup');
            return false;
        }
        return true;
    }
}
__decorate([
    autoBind
], Fields.prototype, "_handleAddProject", null);
//# sourceMappingURL=Fields.js.map