import { projectState } from './../store/ProjectState.js';
import type { ProjectRules } from '../store/ProjectRules.js';
import { Base } from './Base.js';
import { autoBind } from '../decorators/autoBind.js';
import { assignValidateInputs, handleValidationErrors } from '../utils/validation/validation_helpers.js';
import { Popup } from './popup.js';
export class Project extends Base<HTMLDivElement> {
    private _project: ProjectRules;
    constructor(projectsListId:string,project:ProjectRules) {
        super('project-item', projectsListId, true, project.id);
        this._project = project;
        this._renderProject();
        this._editProject();
        this._deleteProject();
        this._runDragging();
    }

    /**
     * @desc Renders the project details (title and description) and updates the DOM accordingly.
     */
    private _renderProject() : void {
        const title = this.element.querySelector('.project_title')! as HTMLHeadingElement;
        const desc = this.element.querySelector('.project_desc')! as HTMLParagraphElement;
        title.textContent = this._project.title;
        desc.textContent = this._project.desc;
    }

    /**
     * @desc Handles the deletion of a project by invoking the deleteProject method from the projectState, passing the project's ID as an argument.
     */
     @autoBind

    private _handleDeleteProject() : void {
        Popup.showConfirm(
            'Are you sure you want to delete this project?',
            () => projectState.deleteProject(this._project.id),
            { title: 'Delete Project' }
        );
    }

    @autoBind
    private _handleEditProject() : void {
        Popup.showForm(
            'Edit Project',
            [
                { name: 'title', label: 'Project Title', value: this._project.title, placeholder: 'Enter project title' },
                { name: 'desc', label: 'Project Description', value: this._project.desc, placeholder: 'Enter project description' }
            ],
            (values) => {
                const trimmedTitle = (values.title ?? '').trim();
                const trimmedDesc = (values.desc ?? '').trim();
                const validationError = this._validateInputsValues(trimmedTitle, trimmedDesc);

                if (validationError) {
                    return validationError;
                }

                projectState.updateProject(this._project.id, trimmedTitle, trimmedDesc);
            },
            {
                message: 'Update project',
                confirmText: 'Save',
                cancelText: 'Cancel'
            }
        );
    }

    /**
     * @desc Attaches an event listener to the delete button of the project item, allowing users to delete the project when the button is clicked.
     */
    private _editProject() : void {
        const editBtn = this.element.querySelector('.edit')! as HTMLButtonElement;
        editBtn.addEventListener('click', this._handleEditProject);
    }

    private _deleteProject() : void {
        const deleteBtn = this.element.querySelector('.delete')! as HTMLButtonElement;
        deleteBtn.addEventListener('click', this._handleDeleteProject);
}

private _validateInputsValues(titleValue: string, descValue: string) : string | null {
    const [titleInputRule, descInputRule] = assignValidateInputs(titleValue, descValue);
    if (!titleInputRule || !descInputRule) {
        return 'Invalid project data.';
    }
    const titleErrorMessage = handleValidationErrors(titleInputRule);
    const descErrorMessage = handleValidationErrors(descInputRule);
    if (titleErrorMessage.length) {
        return titleErrorMessage;
    }

    if (descErrorMessage.length) {
        return descErrorMessage;
    }

    return null;
}
/**
 * @desc Attaches event listeners for drag-and-drop functionality, enabling the project item to be draggable and allowing users to move it between different project lists.
 */
private _runDragging() : void {
    this.element.addEventListener('dragstart',this. _handleDragStart);
    this.element.addEventListener('dragend', this._handleDragEnd);

}
/**
 * @desc Handles the drag start event by setting the opacity of the project item to indicate that it is being dragged, and storing the project's ID in the data transfer object for later retrieval during the drop event.
 * @param event - The DragEvent triggered when the user starts dragging the project item.
 */
 @autoBind
private  _handleDragStart( event: DragEvent) : void {
    this .element.style.opacity = '0.5';
    event.dataTransfer!.setData('text/plain', this._project.id);
    event.dataTransfer!.effectAllowed = 'move';
}

/**
 * @desc Handles the drag end event by resetting the opacity of the project item to its original state, indicating that the dragging action has concluded.
 */
@autoBind
private _handleDragEnd() : void {
    this.element.style.opacity = '1';
}


}
