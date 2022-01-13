import { Component } from "./component";
import { ProjectItem } from "./project-item";
import { projectState } from "../state/project-state";

import { DragTarget } from "../models/drag-drop";
import { Project, ProjectStatus } from "../models/project";
import { AutoBind } from "../decorators/autoBind";

export class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  projects: Project[] = [];
  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.renderContent();
    this.configure();
  }

  @AutoBind()
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] == "text/plain") {
      event.preventDefault();
      const listEL = this.element.querySelector("ul")!;
      listEL.classList.add("droppable");
    }
  }
  @AutoBind()
  dragLeaveHandler(_: DragEvent): void {
    const listEL = this.element.querySelector("ul")!;
    listEL.classList.remove("droppable");
  }
  @AutoBind()
  dropHandler(event: DragEvent): void {
    const draggedProjId = event.dataTransfer?.getData("text/plain")!;
    projectState.moveProject(
      draggedProjId,
      this.type == "active" ? ProjectStatus.active : ProjectStatus.finished
    );
  }

  public configure(): void {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    this.element.addEventListener("drop", this.dropHandler);

    projectState.addListener((projects: Project[]) => {
      this.projects = projects;
      this.renderProjects();
    });
  }

  public renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector(
      "h2"
    )!.textContent = `${this.type.toUpperCase()} PROJECTS`;
  }
  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;

    listEl.innerHTML = "";
    this.projects.forEach((proj: Project) => {
      const isActiveProj = proj.status == 0 && this.type == "active";
      const isFinishedProj = proj.status == 1 && this.type == "finished";
      if (!isFinishedProj && !isActiveProj) {
        return;
      }
      new ProjectItem(`${this.type}-projects-list`, proj);
    });
  }
}
