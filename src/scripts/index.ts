import { Fields } from './components/Fields.js';
import { Popup } from './components/popup.js';
import { ProjectsList } from './components/ProjectsList.js';
new Fields();
new ProjectsList('Initial');
new ProjectsList('Active');
new ProjectsList('Finished');
new Popup();