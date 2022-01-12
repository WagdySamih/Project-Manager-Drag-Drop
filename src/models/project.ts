export enum ProjectStatus {
  active,
  finished,
}

export class Project {
  id = Math.random().toString();
  constructor(
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}
