import { Actor } from "./Actor";

const scratch = document.createElement("canvas");
const sctx = scratch.getContext("2d") as CanvasRenderingContext2D;

export class Text extends Actor {

  public text: string;

  public size: number;

  public fillStyle: string;

  public font: string;

  public width = 0;

  constructor(text: string, size = 16, fillStyle = "#FFF", font = "monospace") {
    super();
    this.text = text;
    this.size = size;
    this.fillStyle = fillStyle;
    this.font = font;

    sctx.font = `${this.size}px ${this.font}`;
    const metrics = sctx.measureText(this.text);
    this.width = metrics.width;
  }

  protected renderSelf(ctx: CanvasRenderingContext2D) {
    ctx.font = `${this.size}px ${this.font}`;

    const metrics = ctx.measureText(this.text);
    this.width = metrics.width;

    ctx.fillStyle = this.fillStyle;
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillText(this.text, -this.width / 2, -this.size / 2);
  }

}
