import { Fields } from './components/Fields.js';
import { Popup } from './components/popup.js';
import { ProjectsList } from './components/ProjectsList.js';
import { ListForm } from './components/ListForm.js';
import { listState } from './store/ListState.js';

new Fields();
new ListForm();
new Popup();

let activeLists: ProjectsList[] = [];

listState.pushListener((lists: string[]) => {
    for (const list of activeLists) {
        list.element.remove();
    }
    activeLists = [];

    for (const listName of lists) {
        activeLists.push(new ProjectsList(listName));
    }
});