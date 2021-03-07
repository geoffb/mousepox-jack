import { Actor } from "./Actor";

// TODO: Rounded corners
// TODO: Stroke

export class Box extends Actor {

  public width: number;

  public height: number;

  public fillStyle: string | undefined;

  public clip: boolean;

  constructor(width: number, height: number, fillStyle?: string, clip = false) {
    super();
    this.width = width;
    this.height = height;
    this.fillStyle = fillStyle;
    this.clip = clip;
  }

  protected renderSelf(ctx: CanvasRenderingContext2D) {
    const x = -Math.floor(this.width / 2);
    const y = -Math.floor(this.height / 2);

    // Optionally clip the rendering area
    if (this.clip) {
      ctx.beginPath();
      ctx.rect(x, y, this.width, this.height);
      ctx.clip();
    }

    // Render colored rectangle
    if (this.fillStyle !== undefined) {
      ctx.fillStyle = this.fillStyle;
      ctx.fillRect(x, y, this.width, this.height);
    }
  }

}
