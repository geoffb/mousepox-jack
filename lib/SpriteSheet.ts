import { IRectangle } from "@mousepox/math";

/** Sprite sheet */
export class SpriteSheet {

  public readonly image: HTMLImageElement;

  public readonly width: number;

  public readonly height: number;

  private readonly boundsCache: Map<number, IRectangle> = new Map();

  constructor(image: HTMLImageElement, width: number, height: number) {
    this.width = Math.floor(width);
    this.height = Math.floor(height);
    this.image = image;
  }

  public getSpriteBounds(index: number): IRectangle {
    let bounds = this.boundsCache.get(index);
    if (bounds === undefined) {
      bounds = { x: 0, y: 0, width: this.width, height: this.height };
      const spriteWidth = Math.floor(this.image.width / this.width);
      bounds.x = Math.floor((index % spriteWidth) * this.width);
      bounds.y = Math.floor(index / spriteWidth) * this.height;
      this.boundsCache.set(index, bounds);
      return bounds;
    } else {
      return bounds;
    }
  }

}
