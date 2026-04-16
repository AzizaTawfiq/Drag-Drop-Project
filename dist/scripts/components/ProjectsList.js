var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Base } from './Base.js';
import { projectState } from '../store/ProjectState.js';
import { ProjectStatus } from '../utils/project-status.js';
import { Project } from './Project.js';
import { autoBind } from '../decorators/autoBind.js';
export class ProjectsList extends Base {
    status;
    constructor(status) {
        super('projects-list', 'app', false, `${status.toLowerCase()}-projects`);
        this.status = status;
        this._renderProjectsList();
        if (JSON.parse(localStorage.getItem("projects"))) {
            const localStorageProjects = JSON.parse(localStorage.getItem("projects"));
            this._showProjectInDom(localStorageProjects);
        }
        projectState.pushListener((projects) => {
            this._showProjectInDom(projects);
        });
        this._runDragging();
    }
    _renderProjectsList() {
        const title = this.element.querySelector('.title');
        const list = this.element.querySelector('ul');
        list.id = `${this.status.toLowerCase()}-list`;
        title.textContent = `${this.status} Projects`;
    }
    _renderProjects(projects) {
        const projectsList = document.getElementById(`${this.status.toLowerCase()}-list`);
        projectsList.innerHTML = '';
        for (const project of projects) {
            new Project(`${this.status.toLowerCase()}-list`, project);
        }
    }
    _showProjectInDom(projects) {
        const filteredProjects = this._filterProjectsByStatus(projects);
        this._renderProjects(filteredProjects);
    }
    _filterProjectsByStatus(projects) {
        const filteredProjects = projects.filter(project => {
            if (this.status === 'Initial') {
                return project.status === ProjectStatus.Initial;
            }
            else if (this.status === 'Active') {
                return project.status === ProjectStatus.Active;
            }
            else if (this.status === 'Finished') {
                return project.status === ProjectStatus.Finished;
            }
        });
        return filteredProjects;
    }
    _runDragging() {
        this.element.addEventListener('dragover', this._handleDragOver);
        this.element.addEventListener('drop', this._handleDrop);
    }
    _handleDragOver(event) {
        event.preventDefault();
    }
    _handleDrop(event) {
        event.preventDefault();
        const projectId = event.dataTransfer.getData('text/plain');
        const newStatus = this.element.id === 'initial-projects' && ProjectStatus.Initial ||
            this.element.id === 'active-projects' && ProjectStatus.Active ||
            this.element.id === 'finished-projects' && ProjectStatus.Finished;
        projectState.changeProjectStatus(projectId, newStatus);
    }
}
__decorate([
    autoBind
], ProjectsList.prototype, "_handleDragOver", null);
__decorate([
    autoBind
], ProjectsList.prototype, "_handleDrop", null);
//# sourceMappingURL=ProjectsList.js.map