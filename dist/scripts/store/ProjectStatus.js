class ProjectState {
    constructor() { }
    ;
    static _instance;
    listeners = [];
    projects = [];
    static getInstance() {
        if (!this._instance) {
            this._instance = new ProjectState();
            return this._instance;
        }
        return this._instance;
    }
    createProject(title, description) {
        const newProject = {
            id: Math.random().toString(),
            title,
            description,
            status: 'active'
        };
        this.projects.push(newProject);
        this.updateListeners();
    }
}
export const projectState = ProjectState.getInstance();
//# sourceMappingURL=ProjectStatus.js.map