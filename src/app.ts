interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(input: Validatable) {
  console.log(input);
  let isValid: boolean = true;
  if (input.required) {
    isValid = isValid && input.value.toString().trim().length > 0;
  }
  if (input.maxLength && typeof input.value === "string") {
    isValid = isValid && input.value.trim().length <= input.maxLength;
  }
  if (input.minLength && typeof input.value === "string") {
    isValid = isValid && input.value.trim().length >= input.minLength;
  }
  if (input.max != null && typeof input.value === "number") {
    isValid = isValid && input.value <= input.max;
  }
  if (input.min != null && typeof input.value === "number") {
    isValid = isValid && input.value >= input.min;
  }

  return isValid;
}

function AutoBind() {
  return function (_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
      configurable: true,
      get() {
        const boundedFn = originalMethod.bind(this);
        return boundedFn;
      },
    };
    return adjDescriptor;
  };
}

enum ProjectStatus {
  active,
  finished,
}

class Project {
  id = Math.random().toString();
  constructor(
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

type Listener = (items: Project[]) => void;


class ProjectState {
  private projects: Project[] = [];
  private listeners: Listener[] = [];
  private static instance: ProjectState;

  addProject(title: string, description: string, numOfPeople: number) {
    const project = new Project(
      title,
      description,
      numOfPeople,
      ProjectStatus.active
    );
    this.projects.push(project);

    this.listeners.forEach((fn) => {
      fn(this.projects.slice());
    });
  }

  addListener(fn: Listener) {
    this.listeners.push(fn);
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ProjectState();
    }
    return this.instance;
  }
}

const projectState = ProjectState.getInstance();

class ProjectList {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  element: HTMLElement;
  projects: Project[] = [];
  constructor(private type: "active" | "finished") {
    this.templateEl = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById("app")! as HTMLDivElement;

    const nodeEl = document.importNode(this.templateEl.content, true);
    this.element = nodeEl.firstElementChild! as HTMLFormElement;
    this.element.id = `${this.type}-projects`;
    this.attach();
    this.renderContent();
    projectState.addListener((projects: Project[]) => {
      this.projects = projects;
      this.renderProjects();
    });
  }
  renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    this.projects.forEach((proj: Project) => {
      const isActiveProj = proj.status == 0 && this.type =='active';
      const isFinishedProj =  proj.status == 1 && this.type =='finished';
      if (!isFinishedProj && !isActiveProj){
        return
      }
      console.log({xxx: proj.status})
      const listItem = document.createElement("li");
      listItem.textContent = proj.title;
      console.log(listItem);
      listEl.appendChild(listItem);
    });
  }
  attach() {
    this.hostEl.insertAdjacentElement("beforeend", this.element);
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector(
      "h2"
    )!.textContent = `${this.type.toUpperCase()} PROJECTS`;
  }
}

class ProjectInput {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  formEl: HTMLFormElement;

  titleInputEl: HTMLInputElement;
  descriptionInputEl: HTMLInputElement;
  peopleInputEl: HTMLInputElement;

  constructor() {
    this.templateEl = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById("app")! as HTMLDivElement;

    const nodeEl = document.importNode(this.templateEl.content, true);
    this.formEl = nodeEl.firstElementChild! as HTMLFormElement;
    this.formEl.id = "user-input";

    // Form input init
    this.titleInputEl = this.formEl.querySelector("#title")!;
    this.descriptionInputEl = this.formEl.querySelector("#description")!;
    this.peopleInputEl = this.formEl.querySelector("#people")!;

    this.attach();
    this.listener();
  }

  private attach() {
    this.hostEl.insertAdjacentElement("afterbegin", this.formEl);
  }

  private listener() {
    this.formEl.addEventListener("submit", this.submitHandler);
  }

  private validateInput(): [string, string, number] | void {
    const title = this.titleInputEl.value;
    const description = this.descriptionInputEl.value;
    const people = +this.peopleInputEl.value;

    const isTitleValid = validate({
      value: title,
      required: true,
      minLength: 3,
      maxLength: 10,
    });
    const isDescValid = validate({
      value: description,
      required: true,
      minLength: 3,
      maxLength: 10,
    });
    const isPeopleValid = validate({
      value: people,
      required: true,
      min: 1,
      max: 10,
    });
    if (!isTitleValid || !isDescValid || !isPeopleValid) {
      alert("please enter valid values!..");
      return;
    } else {
      return [title, description, +people];
    }
  }
  @AutoBind()
  private submitHandler(event: Event) {
    event.preventDefault();
    const inputValues = this.validateInput();
    if (Array.isArray(inputValues)) {
      const [title, description, people] = inputValues;
      projectState.addProject(title, description, people);
    }
  }
}

const projectIn = new ProjectInput();
const activeProjects = new ProjectList("active");
const finishedProjects = new ProjectList("finished");
