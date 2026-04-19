import { autoBind } from '../decorators/autoBind.js';
import type { ProjectRules } from '../store/ProjectRules.js';
import { projectState } from '../store/ProjectState.js';
import type { ProjectStatus } from '../utils/project-status.js';
import { assignValidateInputs, handleValidationErrors } from '../utils/validation/validation_helpers.js';
import { Base } from './Base.js';
import { listState } from '../store/ListState.js';
export class Fields extends Base<HTMLFormElement> {
    private _listSelect: HTMLSelectElement;

    constructor() {
        super('fields', 'app', true, 'form');
        this._listSelect = this.element.querySelector('#project-status') as HTMLSelectElement;
        this._renderListOptions(listState.lists);
        listState.pushListener((lists: string[]) => {
            this._renderListOptions(lists);
        });
        this._addProject();
    }

    /**
     * @desc add project
     */
    private _addProject(): void {
      this.element.addEventListener('submit', this._handleAddProject);
    }
    
    /**
     * @desc handles add project
     */
    @autoBind
    private _handleAddProject (event: Event)  : void  {
        event.preventDefault();
     const [titleInput, descInput, statusInput ] = this._targetInputs();
      const [titleValue, descValue ] = this._getInputsValues(titleInput!, descInput!);
      this._validateInputsValues(titleValue, descValue);
      if(this._validateInputsValues(titleValue, descValue)) {
        const payload: ProjectRules = {
            id: Math.random().toString(),
            title: titleValue,
            desc: descValue,
            status: statusInput.value || this._getDefaultList(listState.lists)
        }
        projectState.createProject(payload);
        this._clearInputs(titleInput, descInput, statusInput);      
      } 
      return;
     
    }
    private _clearInputs(titleInput: HTMLInputElement, descInput: HTMLInputElement, statusInput: HTMLSelectElement) {
        titleInput.value = '';
        descInput.value = '';
        statusInput.value = this._getDefaultList(listState.lists);
    }

    /**
     * @desc get inputs values
     * @param titleInput : HTMLInputElement
     * @param descInput : HTMLInputElement
     * @return inputs values [title, desc] : string[]
     */
    private _getInputsValues(titleInput: HTMLInputElement, descInput: HTMLInputElement) : [string, string] {
        const titleValue = titleInput.value;
        const descValue = descInput.value;
        return [titleValue, descValue];
    }

    /**
     * @desc get project inputs
     * @return inputs [title, desc] : [HTMLInputElement, HTMLInputElement]
     */
    private _targetInputs() : [HTMLInputElement, HTMLInputElement, HTMLSelectElement] {
    const titleInput = document.getElementById("title")! as HTMLInputElement;
    const descInput = document.getElementById("desc")! as HTMLInputElement;
    const statusInput = document.getElementById("project-status")! as HTMLSelectElement;
    return [titleInput, descInput, statusInput];
    }

    private _renderListOptions(lists: string[]) : void {
        this._listSelect.innerHTML = '';

        for (const list of lists) {
            const option = document.createElement('option');
            option.value = list;
            option.textContent = list;
            option.style.textTransform = 'capitalize';
            this._listSelect.append(option);
        }

        this._listSelect.value = this._getDefaultList(lists);
    }

    private _getDefaultList(lists: string[]) : string {
        return lists.includes('Initial') ? 'Initial' : (lists[0] ?? 'Initial');
    }

    /**
     * @desc validate inputs values
     * @param titleValue : string
     * @param descValue : string
     * @return boolean
     */

    private _validateInputsValues(titleValue: string, descValue: string) {
      const [titleInputRule, descInputRule] = assignValidateInputs(titleValue, descValue); 
      const titleErrorMessage = titleInputRule ? handleValidationErrors(titleInputRule) : '';
      const descErrorMessage = descInputRule ? handleValidationErrors(descInputRule) : ''; 
      const popupContainer = document.getElementById('popup_container')! as HTMLDivElement; 
      const descPopup = popupContainer.querySelector('.desc_popup')! as HTMLParagraphElement;
         if(titleErrorMessage.length) {
            descPopup.textContent = titleErrorMessage;
            popupContainer.classList.add('visible_popup');
            return false;
        }
        else if(descErrorMessage.length) {
            descPopup.textContent = descErrorMessage;
            popupContainer.classList.add('visible_popup');
            return false;
        } 
      
      return true;
}
}   
