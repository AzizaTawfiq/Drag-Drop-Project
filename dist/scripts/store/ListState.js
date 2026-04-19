import { projectState } from "./ProjectState.js";
class ListState {
    static _instance;
    _listeners = [];
    _lists = localStorage.getItem('lists')
        ? JSON.parse(localStorage.getItem('lists'))
        : ['Initial', 'Active', 'Finished'];
    constructor() { }
    get lists() {
        return this._lists;
    }
    static getInstance() {
        if (!this._instance) {
            this._instance = new ListState();
        }
        return this._instance;
    }
    pushListener(listener) {
        this._listeners.push(listener);
        listener(this._lists.slice());
    }
    addList(listName) {
        if (listName.trim().length === 0)
            return;
        if (!this._lists.includes(listName)) {
            this._lists.push(listName);
            this._updateListeners();
        }
    }
    editList(oldName, newName) {
        if (newName.trim().length === 0)
            return;
        const index = this._lists.indexOf(oldName);
        if (index > -1 && !this._lists.includes(newName)) {
            this._lists[index] = newName;
            this._updateListeners();
            projectState.renameStatus(oldName, newName);
        }
    }
    deleteList(listName) {
        this._lists = this._lists.filter(l => l !== listName);
        this._updateListeners();
        projectState.deleteProjectsByStatus(listName);
    }
    _updateListeners() {
        localStorage.setItem('lists', JSON.stringify(this._lists));
        for (const listener of this._listeners) {
            listener(this._lists.slice());
        }
    }
}
export const listState = ListState.getInstance();
//# sourceMappingURL=ListState.js.map