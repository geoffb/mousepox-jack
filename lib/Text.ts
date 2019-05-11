import { Actor } from "./Actor";

export class Text extends Actor {

  public text: string;

  constructor(text: string) {
    super();
    this.text = text;
  }

}
