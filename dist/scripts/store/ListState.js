import { projectState } from './ProjectState.js';
import { db } from '../firebase/config.js';
import { doc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { getSessionId } from '../utils/session.js';
const DEFAULT_LISTS = ['Initial', 'Active', 'Finished'];
class ListState {
    static _instance;
    _listeners = [];
    _lists = [];
    _sessionId;
    constructor() {
        this._sessionId = getSessionId();
        const listsDocRef = doc(db, 'sessions', this._sessionId, 'meta', 'lists');
        onSnapshot(listsDocRef, (snapshot) => {
            if (!snapshot.exists()) {
                setDoc(listsDocRef, { names: DEFAULT_LISTS });
                return;
            }
            const data = snapshot.data();
            this._lists = data.names;
            this._notifyListeners();
        });
    }
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
            const listsDocRef = doc(db, 'sessions', this._sessionId, 'meta', 'lists');
            updateDoc(listsDocRef, { names: [...this._lists, listName] });
        }
    }
    editList(oldName, newName) {
        if (newName.trim().length === 0)
            return;
        const index = this._lists.indexOf(oldName);
        if (index > -1 && !this._lists.includes(newName)) {
            const updatedLists = [...this._lists];
            updatedLists[index] = newName;
            const listsDocRef = doc(db, 'sessions', this._sessionId, 'meta', 'lists');
            updateDoc(listsDocRef, { names: updatedLists });
            projectState.renameStatus(oldName, newName);
        }
    }
    deleteList(listName) {
        const updatedLists = this._lists.filter(l => l !== listName);
        const listsDocRef = doc(db, 'sessions', this._sessionId, 'meta', 'lists');
        updateDoc(listsDocRef, { names: updatedLists });
        projectState.deleteProjectsByStatus(listName);
    }
    _notifyListeners() {
        for (const listener of this._listeners) {
            listener(this._lists.slice());
        }
    }
}
export const listState = ListState.getInstance();
//# sourceMappingURL=ListState.js.map