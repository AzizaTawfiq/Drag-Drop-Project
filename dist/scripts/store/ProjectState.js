import { db } from '../firebase/config.js';
import { collection, doc, setDoc, deleteDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { getSessionId } from '../utils/session.js';
class ProjectState {
    static _instance;
    _listeners = [];
    _projects = [];
    _sessionId;
    constructor() {
        this._sessionId = getSessionId();
        const projectsCol = collection(db, 'sessions', this._sessionId, 'projects');
        onSnapshot(projectsCol, (snapshot) => {
            this._projects = snapshot.docs.map(d => d.data());
            this._runListeners();
        });
    }
    static getInstance() {
        if (!this._instance) {
            this._instance = new ProjectState();
            return this._instance;
        }
        return this._instance;
    }
    pushListener(listener) {
        this._listeners.push(listener);
        listener(this._projects.slice());
    }
    createProject(data) {
        const projectDoc = doc(db, 'sessions', this._sessionId, 'projects', data.id);
        setDoc(projectDoc, data);
    }
    deleteProject(projectId) {
        deleteDoc(doc(db, 'sessions', this._sessionId, 'projects', projectId));
    }
    updateProject(projectId, title, desc) {
        updateDoc(doc(db, 'sessions', this._sessionId, 'projects', projectId), { title, desc });
    }
    changeProjectStatus(projectId, newStatus) {
        const project = this._projects.find(p => p.id === projectId);
        if (project && project.status !== newStatus) {
            updateDoc(doc(db, 'sessions', this._sessionId, 'projects', projectId), { status: newStatus });
        }
    }
    renameStatus(oldStatus, newStatus) {
        const affected = this._projects.filter(p => p.status === oldStatus);
        for (const p of affected) {
            updateDoc(doc(db, 'sessions', this._sessionId, 'projects', p.id), { status: newStatus });
        }
    }
    deleteProjectsByStatus(status) {
        const affected = this._projects.filter(p => p.status === status);
        for (const p of affected) {
            deleteDoc(doc(db, 'sessions', this._sessionId, 'projects', p.id));
        }
    }
    _runListeners() {
        for (const listener of this._listeners) {
            listener(this._projects.slice());
        }
    }
}
export const projectState = ProjectState.getInstance();
//# sourceMappingURL=ProjectState.js.map