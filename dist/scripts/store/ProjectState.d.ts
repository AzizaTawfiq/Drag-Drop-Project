import type { ProjectStatus } from "../utils/project-status.js";
import type { Listener } from "./listenerTypes.js";
import type { ProjectRules } from "./ProjectRules.js";
declare class ProjectState {
    private static _instance;
    private _listeners;
    private _projects;
    private _localStorageProjects;
    constructor();
    static getInstance(): ProjectState;
    pushListener(listener: Listener): void;
    createProject(data: ProjectRules): void;
    deleteProject(projectId: string): void;
    private _runListeners;
    changeProjectStatus(projectId: string, newStatus: ProjectStatus): void;
}
export declare const projectState: ProjectState;
export {};
//# sourceMappingURL=ProjectState.d.ts.map