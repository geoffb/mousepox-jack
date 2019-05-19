import { IRectangle } from "@mousepox/math";

/** Sprite sheet */
export class SpriteSheet {

  public image: HTMLImageElement;

  public size: number;

  private boundsCache: Map<number, IRectangle> = new Map();

  constructor(image: HTMLImageElement, size: number) {
    this.size = size;
    this.image = image;
  }

  public getSpriteBounds(index: number): IRectangle {
    let bounds = this.boundsCache.get(index);
    if (bounds === undefined) {
      bounds = { x: 0, y: 0, width: this.size, height: this.size };
      const spriteWidth = Math.floor(this.image.width / this.size);
      bounds.x = (index % spriteWidth) * this.size;
      bounds.y = Math.floor(index / spriteWidth) * this.size;
      this.boundsCache.set(index, bounds);
      return bounds;
    } else {
      return bounds;
    }
  }

}
