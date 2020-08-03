import { Actor } from "./Actor";

// TODO: Rounded corners
// TODO: Stroke

export class Box extends Actor {

  public width: number;

  public height: number;

  public fillStyle: string;

  constructor(width: number, height: number, fillStyle = "#FFFFFF") {
    super();
    this.width = width;
    this.height = height;
    this.fillStyle = fillStyle;
  }

  protected renderSelf(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.fillStyle;
    ctx.fillRect(-Math.floor(this.width / 2), -Math.floor(this.height / 2), this.width, this.height);
  }

}
