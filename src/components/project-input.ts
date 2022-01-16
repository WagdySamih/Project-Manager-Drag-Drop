import { Component } from "./component";
import { projectState } from "../state/project-state";
import { validate } from "../utils/validation";
import { AutoBind } from "../decorators/autoBind";

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

    const titleValidation = {
      value: title,
      required: true,
      minLength: 3,
      maxLength: 50,
      error: 'Title must be between 3 & 50 letters'
    }
    const descriptionValidation = {
      value: description,
      required: true,
      minLength: 3,
      maxLength: 200,
      error: 'Description must be between 3 & 150 letters'
    }
    const peopleValidation = {
      value: people,
      required: true,
      min: 1,
      max: 10,
      error: 'Assigned people number must be between 1 & 10'
    }
    const isTitleValid = validate(titleValidation);
    const isDescValid = validate(descriptionValidation);
    const isPeopleValid = validate(peopleValidation);
    if (!isTitleValid || !isDescValid || !isPeopleValid) {
      !isTitleValid && alert( titleValidation.error);
      !isDescValid && alert( descriptionValidation.error);
      !isPeopleValid && alert( peopleValidation.error)
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
