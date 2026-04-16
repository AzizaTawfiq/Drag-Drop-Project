declare class ProjectState {
    constructor();
    private static _instance;
    private listeners;
    private projects;
    static getInstance(): ProjectState;
    createProject(title: string, description: string): void;
}
export declare const projectState: ProjectState;
export {};
//# sourceMappingURL=ProjectStatus.d.ts.map