import { Actor } from "./Actor";
import { Grid } from "./Grid";
import { SpriteSheet } from "./SpriteSheet";

export class SpriteGrid extends Actor {

  public sheet: SpriteSheet;

  public grid: Grid;

  constructor(sheet: SpriteSheet, grid: Grid) {
    super();
    this.sheet = sheet;
    this.grid = grid;
  }

  protected renderSelf(ctx: CanvasRenderingContext2D) {
    const size = this.sheet.size;
    const width = this.grid.width * size;
    const height = this.grid.height * size;

    const ox = -width / 2;
    const oy = -height / 2;

    this.grid.forEach((index, x, y) => {
      const bounds = this.sheet.getSpriteBounds(index);
      ctx.drawImage(this.sheet.image,
        bounds.x, bounds.y, size, size,
        ox + x * size, oy + y * size, size, size);
    });

  }

}
