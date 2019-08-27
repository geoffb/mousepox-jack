import { IRectangle } from "@mousepox/math";

/** Sprite sheet */
export class SpriteSheet {

  public image: HTMLImageElement;

  public width: number;

  public height: number;

  private boundsCache: Map<number, IRectangle> = new Map();

  constructor(image: HTMLImageElement, width: number, height: number) {
    this.width = width;
    this.height = height;
    this.image = image;
  }

  public getSpriteBounds(index: number): IRectangle {
    let bounds = this.boundsCache.get(index);
    if (bounds === undefined) {
      bounds = { x: 0, y: 0, width: this.width, height: this.height };
      const spriteWidth = Math.floor(this.image.width / this.width);
      bounds.x = (index % spriteWidth) * this.width;
      bounds.y = Math.floor(index / spriteWidth) * this.height;
      this.boundsCache.set(index, bounds);
      return bounds;
    } else {
      return bounds;
    }
  }

}
