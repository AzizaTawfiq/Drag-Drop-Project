import type { ProjectStatus } from '../utils/project-status.js';
import type { Listener } from './listenerTypes.js';
import type { ProjectRules } from './ProjectRules.js';
import { db } from '../firebase/config.js';
import { collection, doc, setDoc, deleteDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { getSessionId } from '../utils/session.js';

class ProjectState {
    private static _instance: ProjectState;
    private _listeners: Listener[] = [];
    private _projects: ProjectRules[] = [];
    private _sessionId: string;

    constructor() {
        this._sessionId = getSessionId();
        const projectsCol = collection(db, 'sessions', this._sessionId, 'projects');

        onSnapshot(projectsCol, (snapshot) => {
            this._projects = snapshot.docs.map(d => d.data() as ProjectRules);
            this._runListeners();
        });
    }

    public static getInstance(): ProjectState {
        if (!this._instance) {
            this._instance = new ProjectState();
            return this._instance;
        }
        return this._instance;
    }

    public pushListener(listener: Listener): void {
        this._listeners.push(listener);
        listener(this._projects.slice());
    }

    public createProject(data: ProjectRules): void {
        const projectDoc = doc(db, 'sessions', this._sessionId, 'projects', data.id);
        setDoc(projectDoc, data);
    }

    public deleteProject(projectId: string): void {
        deleteDoc(doc(db, 'sessions', this._sessionId, 'projects', projectId));
    }

    public updateProject(projectId: string, title: string, desc: string): void {
        updateDoc(doc(db, 'sessions', this._sessionId, 'projects', projectId), { title, desc });
    }

    public changeProjectStatus(projectId: string, newStatus: ProjectStatus): void {
        const project = this._projects.find(p => p.id === projectId);
        if (project && project.status !== newStatus) {
            updateDoc(doc(db, 'sessions', this._sessionId, 'projects', projectId), { status: newStatus });
        }
    }

    public renameStatus(oldStatus: string, newStatus: string): void {
        const affected = this._projects.filter(p => p.status === oldStatus);
        for (const p of affected) {
            updateDoc(doc(db, 'sessions', this._sessionId, 'projects', p.id), { status: newStatus });
        }
    }

    public deleteProjectsByStatus(status: string): void {
        const affected = this._projects.filter(p => p.status === status);
        for (const p of affected) {
            deleteDoc(doc(db, 'sessions', this._sessionId, 'projects', p.id));
        }
    }

    private _runListeners(): void {
        for (const listener of this._listeners) {
            listener(this._projects.slice());
        }
    }
}

export const projectState = ProjectState.getInstance();
