namespace App {
  export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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
      this.hostEl = document.getElementById(hostElId)! as T;

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
}
