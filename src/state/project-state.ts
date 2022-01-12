import { Project } from "../models/project.js";
import { ProjectStatus } from "../models/project.js";

export type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];
  addListener(fn: Listener<T>) {
    this.listeners.push(fn);
  }
}
class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  addProject(title: string, description: string, numOfPeople: number) {
    const project = new Project(
      title,
      description,
      numOfPeople,
      ProjectStatus.active
    );
    this.projects.push(project);
    this.updateListeners();
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((proj) => proj.id === projectId);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  updateListeners() {
    this.listeners.forEach((fn) => {
      fn(this.projects.slice());
    });
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ProjectState();
    }
    return this.instance;
  }
}
export const projectState = ProjectState.getInstance();
