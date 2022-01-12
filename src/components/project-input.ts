import { Component } from "./component.js";
import { projectState } from "../state/project-state.js";
import { validate } from "../utils/validation.js";
import { AutoBind } from "../decorators/autoBind.js";

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
