interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(input: Validatable) {
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

type Listener<T> = (items: T[]) => void;

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateEl: HTMLTemplateElement;
  hostEl: T;
  element: U;
  constructor(
    public templateId: string,
    public hostElId: string,
    public isInStart: boolean,
    public elementId?: string
  ) {
    this.templateEl = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById("app")! as T;

    const nodeEl = document.importNode(this.templateEl.content, true);
    this.element = nodeEl.firstElementChild! as U;
    if (elementId) this.element.id = elementId;
    this.attach(isInStart);
  }

  attach(isInStart: boolean) {
    this.hostEl.insertAdjacentElement(
      isInStart ? "afterbegin" : "beforeend",
      this.element
    );
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

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
const projectState = ProjectState.getInstance();

class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  projects: Project[] = [];
  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.renderContent();
    this.configure();
  }

  public configure(): void {
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
      const listItem = document.createElement("li");
      listItem.textContent = proj.title;
      listEl.appendChild(listItem);
    });
  }
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputEl: HTMLInputElement;
  descriptionInputEl: HTMLInputElement;
  peopleInputEl: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");
    // Form input init
    this.titleInputEl = this.element.querySelector("#title")!;
    this.descriptionInputEl = this.element.querySelector("#description")!;
    this.peopleInputEl = this.element.querySelector("#people")!;

    this.configure();
  }
  configure(): void {
    this.element.addEventListener("submit", this.submitHandler);
  }
  renderContent(): void {}

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
