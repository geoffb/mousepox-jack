import { Actor } from "./Actor";
import { SpriteSheet } from "./SpriteSheet";

/** A sprite animation */
export interface ISpriteAnimation {
  frames: number[];
  delay: number;
}

/** A group of sprite animations */
export interface ISpriteAnimationData {
  [index: string]: ISpriteAnimation;
}

export class SpriteAnimation extends Actor {

  /** Sprite sheet */
  public sheet: SpriteSheet;

  /** Sprite animation data */
  public data: ISpriteAnimationData;

  /** Sprite index */
  private index = 0;

  /** Current animation */
  private animation: string | undefined;

  /** Current animation frame */
  private frame = 0;

  /** Elapsed time since last frame change */
  private elapsed = 0;

  constructor(sheet: SpriteSheet, data: ISpriteAnimationData) {
    super();
    this.sheet = sheet;
    this.data = data;
  }

  /** Play an animation */
  public play(animation: string) {
    this.animation = animation;
    const anim = this.data[this.animation];
    this.frame = 0;
    this.index = anim.frames[this.frame];
    this.elapsed = 0;
  }

  protected renderSelf(ctx: CanvasRenderingContext2D, dt: number) {
    // Update animation with passage of time
    if (this.animation !== undefined) {
      const anim = this.data[this.animation];
      this.elapsed += dt;
      if (this.elapsed >= anim.delay) {
        this.frame++;
        this.index = anim.frames[this.frame];
        this.elapsed -= anim.delay;
      }
    }

    // Render sprite
    const bounds = this.sheet.getSpriteBounds(this.index);
    ctx.drawImage(
      this.sheet.image,
      bounds.x, bounds.y, bounds.width, bounds.height,
      -bounds.width / 2, -bounds.height / 2, bounds.width, bounds.height);
  }

}
