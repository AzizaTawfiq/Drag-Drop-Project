type ListListener = (lists: string[]) => void;
declare class ListState {
    private static _instance;
    private _listeners;
    private _lists;
    private _sessionId;
    private constructor();
    get lists(): string[];
    static getInstance(): ListState;
    pushListener(listener: ListListener): void;
    addList(listName: string): void;
    editList(oldName: string, newName: string): void;
    deleteList(listName: string): void;
    private _notifyListeners;
}
export declare const listState: ListState;
export {};
//# sourceMappingURL=ListState.d.ts.map