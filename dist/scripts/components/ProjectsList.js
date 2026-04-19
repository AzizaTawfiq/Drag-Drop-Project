var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Base } from './Base.js';
import { projectState } from '../store/ProjectState.js';
import { Project } from './Project.js';
import { autoBind } from '../decorators/autoBind.js';
import { listState } from '../store/ListState.js';
export class ProjectsList extends Base {
    status;
    constructor(status) {
        super('projects-list', 'app', false, `${status.toLowerCase().replace(/\s+/g, '-')}-projects`);
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
        list.id = `${this.status.toLowerCase().replace(/\s+/g, '-')}-list`;
        title.textContent = `${this.status}`;
        const editBtn = this.element.querySelector('.edit-list');
        const deleteBtn = this.element.querySelector('.delete-list');
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
    _renderProjects(projects) {
        const listId = `${this.status.toLowerCase().replace(/\s+/g, '-')}-list`;
        const projectsList = document.getElementById(listId);
        if (projectsList) {
            projectsList.innerHTML = '';
            for (const project of projects) {
                new Project(listId, project);
            }
        }
    }
    _showProjectInDom(projects) {
        const filteredProjects = this._filterProjectsByStatus(projects);
        this._renderProjects(filteredProjects);
    }
    _filterProjectsByStatus(projects) {
        return projects.filter(project => project.status === this.status);
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
        projectState.changeProjectStatus(projectId, this.status);
    }
}
__decorate([
    autoBind
], ProjectsList.prototype, "_handleDragOver", null);
__decorate([
    autoBind
], ProjectsList.prototype, "_handleDrop", null);
//# sourceMappingURL=ProjectsList.js.map