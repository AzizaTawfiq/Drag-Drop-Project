import type { ProjectRules } from "./ProjectRules.js";

export type Listener = (projects: ProjectRules[]) => void;