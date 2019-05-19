import { TweenGroup } from "@mousepox/tween";
import { Actor } from "./Actor";
import { ImageCache } from "./ImageCache";

export abstract class Scene extends Actor {

  /** Width of scene */
  protected readonly width: number;

  /** Height of scene */
  protected readonly height: number;

  /** Image cache */
  protected readonly images: ImageCache;

  /** Tweens */
  protected readonly tweens: TweenGroup;

  constructor(width: number, height: number, images: ImageCache, tweens: TweenGroup) {
    super();
    this.width = width;
    this.height = height;
    this.images = images;
    this.tweens = tweens;
    this.init();
  }

  protected abstract init(): void;

}
