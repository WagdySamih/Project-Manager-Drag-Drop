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
    console.log(isTitleValid);
    console.log(isDescValid);

    console.log(isPeopleValid);

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
      console.log(title, description, people);
    }
  }
}

const projectIn = new ProjectInput();
