import type { ProjectStatus } from "../utils/project-status.js";
import type { Listener } from "./listenerTypes.js";
import type { ProjectRules } from "./ProjectRules.js";

class ProjectState {
   
    private static _instance: ProjectState;
    private _listeners: Listener[] = [];
    private _projects: ProjectRules[] = [];
    private _localStorageProjects: ProjectRules[] = localStorage.getItem(
    "projects"
  )
    ? JSON.parse(localStorage.getItem("projects")!)
    : [];

     constructor() {
        /**
         * @desc initializes the projects array with the projects stored in local storage and runs the listeners to update the UI accordingly.
         */
        this._projects = this._localStorageProjects;
         
     };
    /**
    * @desc singleton pattern
    * @return instance of ProjectState
    */ 
     
    public  static getInstance() {
        if (!this._instance) {
            this._instance = new ProjectState();
            return this._instance;
        }
        return this._instance;
    }


    /**     
     * @desc push listeners to the listeners array
     * @param listener : Listener
     */
    public pushListener(listener: Listener) : void {
        this._listeners.push(listener);
    }

    /**
     * @desc add project
     * @param1 title : string
     * @param2 description : string
     */

    public createProject(data: ProjectRules) : void {
        this._projects.push(data);
        this._runListeners();
        localStorage.setItem("projects", JSON.stringify(this._projects));
    }
    /**
     * @desc move project to another status
     * @param1 projectId : string
     * @param2 newStatus : 'Initial' | 'Active' | 'Finished'
     */

    public deleteProject(projectId: string) : void {
        const projectsAfterDelete = this._projects.filter((project: ProjectRules) => project.id !== projectId);
        this._projects = projectsAfterDelete;
        this._runListeners();
        localStorage.setItem("projects", JSON.stringify(this._projects));
        
    }

    /**
     * @desc move project to another status
    */

    private _runListeners() : void {
        for (const listener of this._listeners) {
            listener(this._projects.slice());
        }
}
/**
     * @desc change project status
     * @param1 projectId : string
     * @param2 newStatus : 'Initial' | 'Active' | 'Finished'
     */
public changeProjectStatus(projectId: string, newStatus: ProjectStatus) : void {
    const project = this._projects.find((project: ProjectRules) => project.id === projectId);
    if (project && project.status !== newStatus) {
        project.status = newStatus;
        this._runListeners();
        localStorage.setItem("projects", JSON.stringify(this._projects));
    }
}

public renameStatus(oldStatus: string, newStatus: string): void {
    let changed = false;
    for (const p of this._projects) {
        if (p.status === oldStatus) {
            p.status = newStatus;
            changed = true;
        }
    }
    if (changed) {
        this._runListeners();
        localStorage.setItem("projects", JSON.stringify(this._projects));
    }
}

public deleteProjectsByStatus(status: string): void {
    const originalLength = this._projects.length;
    this._projects = this._projects.filter(p => p.status !== status);
    if (this._projects.length !== originalLength) {
        this._runListeners();
        localStorage.setItem("projects", JSON.stringify(this._projects));
    }
}
}
export const projectState = ProjectState.getInstance();