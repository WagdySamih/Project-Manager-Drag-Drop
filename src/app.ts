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

  private validateInput(): [String, String, Number] | void {
    const title = this.titleInputEl.value;
    const description = this.descriptionInputEl.value;
    const people = +this.peopleInputEl.value;
    if (!title.trim().length || !description.trim().length || !people) {
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
      console.log(title, description, people);
    }
  }
}

const projectIn = new ProjectInput();
