import { Grid } from "@mousepox/math";
import { Actor } from "./Actor";
import { SpriteSheet } from "./SpriteSheet";

export class SpriteGrid extends Actor {

  public sheet: SpriteSheet;

  public grid?: Grid;

  public get width(): number {
    if (this.grid !== undefined) {
      return this.grid.width * this.sheet.width;
    } else {
      return 0;
    }
  }

  public get height(): number {
    if (this.grid !== undefined) {
      return this.grid.height * this.sheet.height;
    } else {
      return 0;
    }
  }

  constructor(sheet: SpriteSheet, grid?: Grid) {
    super();
    this.sheet = sheet;
    this.grid = grid;
  }

  protected renderSelf(ctx: CanvasRenderingContext2D) {
    if (this.grid === undefined) { return; }

    const width = this.grid.width * this.sheet.width;
    const height = this.grid.height * this.sheet.height;

    const ox = -width / 2;
    const oy = -height / 2;

    this.grid.forEach((index, x, y) => {
      const bounds = this.sheet.getSpriteBounds(index);
      ctx.drawImage(this.sheet.image,
        bounds.x, bounds.y, this.sheet.width, this.sheet.height,
        ox + x * this.sheet.width, oy + y * this.sheet.height, this.sheet.width, this.sheet.height);
    });

  }

}
