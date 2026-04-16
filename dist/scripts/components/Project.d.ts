import type { ProjectRules } from '../store/ProjectRules.js';
import { Base } from './Base.js';
export declare class Project extends Base<HTMLDivElement> {
    private _project;
    constructor(projectsListId: string, project: ProjectRules);
    private _renderProject;
    private _handleDeleteProject;
    private _deleteProject;
    private _runDragging;
    private _handleDragStart;
    private _handleDragEnd;
}
//# sourceMappingURL=Project.d.ts.map