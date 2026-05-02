import { projectState } from './ProjectState.js';
import { db } from '../firebase/config.js';
import { doc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { getSessionId } from '../utils/session.js';

type ListListener = (lists: string[]) => void;

const DEFAULT_LISTS = ['Initial', 'Active', 'Finished'];

class ListState {
    private static _instance: ListState;
    private _listeners: ListListener[] = [];
    private _lists: string[] = [];
    private _sessionId: string;

    private constructor() {
        this._sessionId = getSessionId();
        const listsDocRef = doc(db, 'sessions', this._sessionId, 'meta', 'lists');

        onSnapshot(listsDocRef, (snapshot) => {
            if (!snapshot.exists()) {
                setDoc(listsDocRef, { names: DEFAULT_LISTS });
                return;
            }
            const data = snapshot.data() as { names: string[] };
            this._lists = data.names;
            this._notifyListeners();
        });
    }

    public get lists(): string[] {
        return this._lists;
    }

    public static getInstance(): ListState {
        if (!this._instance) {
            this._instance = new ListState();
        }
        return this._instance;
    }

    public pushListener(listener: ListListener): void {
        this._listeners.push(listener);
        listener(this._lists.slice());
    }

    public addList(listName: string): void {
        if (listName.trim().length === 0) return;
        if (!this._lists.includes(listName)) {
            const listsDocRef = doc(db, 'sessions', this._sessionId, 'meta', 'lists');
            updateDoc(listsDocRef, { names: [...this._lists, listName] });
        }
    }

    public editList(oldName: string, newName: string): void {
        if (newName.trim().length === 0) return;
        const index = this._lists.indexOf(oldName);
        if (index > -1 && !this._lists.includes(newName)) {
            const updatedLists = [...this._lists];
            updatedLists[index] = newName;
            const listsDocRef = doc(db, 'sessions', this._sessionId, 'meta', 'lists');
            updateDoc(listsDocRef, { names: updatedLists });
            projectState.renameStatus(oldName, newName);
        }
    }

    public deleteList(listName: string): void {
        const updatedLists = this._lists.filter(l => l !== listName);
        const listsDocRef = doc(db, 'sessions', this._sessionId, 'meta', 'lists');
        updateDoc(listsDocRef, { names: updatedLists });
        projectState.deleteProjectsByStatus(listName);
    }

    private _notifyListeners(): void {
        for (const listener of this._listeners) {
            listener(this._lists.slice());
        }
    }
}

export const listState = ListState.getInstance();
