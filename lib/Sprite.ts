import { Actor } from "./Actor";
import { SpriteSheet } from "./SpriteSheet";

export class Sprite extends Actor {

  /** Sprite sheet */
  public sheet: SpriteSheet;

  /** Sprite index */
  public index = 0;

  constructor(sheet: SpriteSheet, index = 0) {
    super();
    this.sheet = sheet;
    this.index = index;
  }

  protected renderSelf(ctx: CanvasRenderingContext2D) {
    const bounds = this.sheet.getSpriteBounds(this.index);
    ctx.drawImage(
      this.sheet.image,
      bounds.x, bounds.y, bounds.width, bounds.height,
      Math.round(-bounds.width / 2), Math.round(-bounds.height / 2),
      bounds.width, bounds.height);
  }

}
