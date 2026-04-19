import type { Listener } from "./listenerTypes.js";
import { projectState } from "./ProjectState.js";

type ListListener = (lists: string[]) => void;

class ListState {
    private static _instance: ListState;
    private _listeners: ListListener[] = [];
    private _lists: string[] = localStorage.getItem('lists')
        ? JSON.parse(localStorage.getItem('lists')!)
        : ['Initial', 'Active', 'Finished'];

    private constructor() {}

    public get lists() {
        return this._lists;
    }

    public static getInstance() {
        if (!this._instance) {
            this._instance = new ListState();
        }
        return this._instance;
    }

    public pushListener(listener: ListListener) {
        this._listeners.push(listener);
        listener(this._lists.slice());
    }

    public addList(listName: string) {
        if (listName.trim().length === 0) return;
        if (!this._lists.includes(listName)) {
            this._lists.push(listName);
            this._updateListeners();
        }
    }

    public editList(oldName: string, newName: string) {
        if (newName.trim().length === 0) return;
        const index = this._lists.indexOf(oldName);
        if (index > -1 && !this._lists.includes(newName)) {
            this._lists[index] = newName;
            this._updateListeners();
            projectState.renameStatus(oldName, newName);
        }
    }

    public deleteList(listName: string) {
        this._lists = this._lists.filter(l => l !== listName);
        this._updateListeners();
        projectState.deleteProjectsByStatus(listName);
    }

    private _updateListeners() {
        localStorage.setItem('lists', JSON.stringify(this._lists));
        for (const listener of this._listeners) {
            listener(this._lists.slice());
        }
    }
}

export const listState = ListState.getInstance();
