import { Base } from './Base.js';
import { projectState } from '../store/ProjectState.js';
import type { ProjectRules } from '../store/ProjectRules.js';
import { ProjectStatus } from '../utils/project-status.js';
import { Project } from './Project.js';
import { autoBind } from '../decorators/autoBind.js';
export class ProjectsList extends Base<HTMLDivElement> {
   
    constructor( private status: 'Initial' | 'Active' | 'Finished') {
        super('projects-list', 'app', false, `${status.toLowerCase()}-projects`);
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
   list.id = `${this.status.toLowerCase()}-list`;
   title.textContent = `${this.status} Projects`;
  } 
  
    /**
     * @desc Renders the projects in the list based on the provided projects array and updates the DOM accordingly.
     * @param projects : ProjectRules[]
     * @return void
     */
    private _renderProjects(projects: ProjectRules[]) : void {
        const projectsList = document.getElementById(`${this.status.toLowerCase()}-list`)! as HTMLDivElement;
        projectsList.innerHTML = '';
        for (const project of projects) {
            new Project(`${this.status.toLowerCase()}-list`, project);
           /* const content = this._createProjectElement(project);
              projectsList.innerHTML += content; */
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
     * @desc Creates a project element and appends it to the projects list in the DOM.
     * @param project : ProjectRules
     * @return void
     */
   /*  private _createProjectElement(project: ProjectRules) {
        const content = ` 
        <div class="project" draggable="true" >
        <h2 class="project_title" id="project_title">${project.title}</h2>
        <p class="project_desc" id="project_desc">${project.desc}</p>
        </div>
        `
        return content
    } */

    /**
     * @desc Filters the projects based on the status (Initial, Active, Finished) and returns the filtered projects array.
     * @param projects : ProjectRules[]
     * @return filteredProjects : ProjectRules[]
     */

    private _filterProjectsByStatus(projects: ProjectRules[]) : ProjectRules[] {
        const filteredProjects= projects.filter(project => {
            if(this.status === 'Initial') {
                return project.status === ProjectStatus.Initial;
            } else if(this.status === 'Active') {
                return project.status === ProjectStatus.Active;
            } else if(this.status === 'Finished') {
                return project.status === ProjectStatus.Finished;
            }
        });
        return filteredProjects;
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
        const newStatus = this.element.id === 'initial-projects' && ProjectStatus.Initial ||
                          this.element.id === 'active-projects' &&  ProjectStatus.Active ||
                          this.element.id === 'finished-projects' && ProjectStatus.Finished;
        projectState.changeProjectStatus(projectId, newStatus);
        
    }


}