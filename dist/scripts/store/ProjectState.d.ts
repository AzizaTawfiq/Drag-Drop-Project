import type { ProjectStatus } from '../utils/project-status.js';
import type { Listener } from './listenerTypes.js';
import type { ProjectRules } from './ProjectRules.js';
declare class ProjectState {
    private static _instance;
    private _listeners;
    private _projects;
    private _sessionId;
    constructor();
    static getInstance(): ProjectState;
    pushListener(listener: Listener): void;
    createProject(data: ProjectRules): void;
    deleteProject(projectId: string): void;
    updateProject(projectId: string, title: string, desc: string): void;
    changeProjectStatus(projectId: string, newStatus: ProjectStatus): void;
    renameStatus(oldStatus: string, newStatus: string): void;
    deleteProjectsByStatus(status: string): void;
    private _runListeners;
}
export declare const projectState: ProjectState;
export {};
//# sourceMappingURL=ProjectState.d.ts.map