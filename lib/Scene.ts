import { TweenGroup } from "@mousepox/tween";
import { ActionQueue } from "./ActionQueue";
import { Actor } from "./Actor";
import { DataCache } from "./DataCache";
import { ImageCache } from "./ImageCache";
import { Keyboard } from "./Keyboard";

export abstract class Scene extends Actor {

  /** Width of scene */
  protected readonly width: number;

  /** Height of scene */
  protected readonly height: number;

  protected readonly data: DataCache;

  /** Image cache */
  protected readonly images: ImageCache;

  /** Tweens */
  protected readonly tweens: TweenGroup;

  /** Keyboard */
  protected readonly keyboard: Keyboard;

  /** Action queue */
  protected readonly actionQueue = new ActionQueue();

  constructor(
    width: number,
    height: number,
    data: DataCache,
    images: ImageCache,
    tweens: TweenGroup,
    keyboard: Keyboard,
  ) {
    super();
    this.width = width;
    this.height = height;
    this.data = data;
    this.images = images;
    this.tweens = tweens;
    this.keyboard = keyboard;
    this.init();
  }

  public abstract update(dt: number): void;

  protected abstract init(): void;

}
