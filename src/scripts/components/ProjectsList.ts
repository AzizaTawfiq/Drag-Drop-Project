import { Base } from './Base.js';
import { projectState } from '../store/ProjectState.js';
import type { ProjectRules } from '../store/ProjectRules.js';
import { Project } from './Project.js';
import { autoBind } from '../decorators/autoBind.js';
import { listState } from '../store/ListState.js';

export class ProjectsList extends Base<HTMLDivElement> {
   
    constructor( private status: string) {
        super('projects-list', 'app', false, `${status.toLowerCase().replace(/\s+/g,'-')}-projects`);
        this._renderProjectsList();
        if(JSON.parse(localStorage.getItem("projects")!)) {
            const localStorageProjects: ProjectRules[] = JSON.parse(localStorage.getItem("projects")!);
           this._showProjectInDom(localStorageProjects);
        }
        projectState.pushListener((projects: ProjectRules[]) => {
         this._showProjectInDom(projects);
        }
    );
    this._runDragging();
    }

    /**
     * @desc Renders the projects list based on the status (Initial, Active, Finished) and updates the DOM accordingly.
     */
  private _renderProjectsList() : void {
   const title = this.element.querySelector('.title')! as HTMLHeadingElement;
   const list = this.element.querySelector('ul')! as HTMLUListElement;
   list.id = `${this.status.toLowerCase().replace(/\s+/g,'-')}-list`;
   title.textContent = `${this.status}`;

   const editBtn = this.element.querySelector('.edit-list') as HTMLButtonElement;
   const deleteBtn = this.element.querySelector('.delete-list') as HTMLButtonElement;

   editBtn.addEventListener('click', () => {
       const newName = prompt('Enter new list name:', this.status);
       if (newName && newName.trim().length > 0 && newName !== this.status) {
           listState.editList(this.status, newName.trim());
       }
   });

   deleteBtn.addEventListener('click', () => {
       if (confirm(`Are you sure you want to delete the '${this.status}' list and all its projects?`)) {
           listState.deleteList(this.status);
       }
   });
  } 
  
    /**
     * @desc Renders the projects in the list based on the provided projects array and updates the DOM accordingly.
     * @param projects : ProjectRules[]
     * @return void
     */
    private _renderProjects(projects: ProjectRules[]) : void {
        const listId = `${this.status.toLowerCase().replace(/\s+/g,'-')}-list`;
        const projectsList = document.getElementById(listId)! as HTMLDivElement;
        if(projectsList) {
            projectsList.innerHTML = '';
            for (const project of projects) {
                new Project(listId, project);
            }
        }
    }

    /**
     * @desc Shows the projects in the DOM by filtering them based on the status and rendering them accordingly.
     * @return void
     */
    private _showProjectInDom(projects:ProjectRules[]) : void {
         const filteredProjects = this._filterProjectsByStatus(projects);
            this._renderProjects(filteredProjects);
    }

   

    /**
     * @desc Filters the projects based on the status (Initial, Active, Finished) and returns the filtered projects array.
     * @param projects : ProjectRules[]
     * @return filteredProjects : ProjectRules[]
     */

    private _filterProjectsByStatus(projects: ProjectRules[]) : ProjectRules[] {
        return projects.filter(project => project.status === this.status);
    }

    /**
     * @desc Attaches event listeners for drag-and-drop functionality, enabling the project item to be draggable and allowing users to move it between different project lists.
     */

    private _runDragging() : void {
        this.element.addEventListener('dragover', this._handleDragOver);
        this.element.addEventListener('drop', this._handleDrop);
    }

    /**
     * @desc Handles the drop event by retrieving the project's ID from the data transfer object, determining the new status based on the target list, and updating the project's status accordingly in the projectState.
     * @param event - The DragEvent triggered when the user drops a project item onto a target list.
    */
    @autoBind
    private _handleDragOver(event: DragEvent) : void {


        event.preventDefault();
    }

    /**
     * @desc Handles the drop event by retrieving the project's ID from the data transfer object, determining the new status based on the target list, and updating the project's status accordingly in the projectState.
     * @param event - The DragEvent triggered when the user drops a project item onto a target list.
    */

    @autoBind
    private _handleDrop(event: DragEvent) : void {
        event.preventDefault();
        const projectId = event.dataTransfer!.getData('text/plain');
        projectState.changeProjectStatus(projectId, this.status);
        
    }


}