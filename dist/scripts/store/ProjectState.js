class ProjectState {
    static _instance;
    _listeners = [];
    _projects = [];
    _localStorageProjects = localStorage.getItem("projects")
        ? JSON.parse(localStorage.getItem("projects"))
        : [];
    constructor() {
        this._projects = this._localStorageProjects;
    }
    ;
    static getInstance() {
        if (!this._instance) {
            this._instance = new ProjectState();
            return this._instance;
        }
        return this._instance;
    }
    pushListener(listener) {
        this._listeners.push(listener);
    }
    createProject(data) {
        this._projects.push(data);
        this._runListeners();
        localStorage.setItem("projects", JSON.stringify(this._projects));
    }
    deleteProject(projectId) {
        const projectsAfterDelete = this._projects.filter((project) => project.id !== projectId);
        this._projects = projectsAfterDelete;
        this._runListeners();
        localStorage.setItem("projects", JSON.stringify(this._projects));
    }
    _runListeners() {
        for (const listener of this._listeners) {
            listener(this._projects.slice());
        }
    }
    changeProjectStatus(projectId, newStatus) {
        const project = this._projects.find((project) => project.id === projectId);
        if (project && project.status !== newStatus) {
            project.status = newStatus;
            this._runListeners();
            localStorage.setItem("projects", JSON.stringify(this._projects));
        }
    }
}
export const projectState = ProjectState.getInstance();
//# sourceMappingURL=ProjectState.js.map