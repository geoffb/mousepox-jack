import { TweenGroup } from "@mousepox/tween";
import { ActionQueue } from "./ActionQueue";
import { Actor } from "./Actor";
import { DataCache } from "./DataCache";
import { ImageCache } from "./ImageCache";
import { Keyboard } from "./Keyboard";
import { SoundCache } from "./SoundCache";

export abstract class Scene extends Actor {

  /** Width of scene */
  protected readonly width: number;

  /** Height of scene */
  protected readonly height: number;

  /** Data cache */
  protected readonly data: DataCache;

  /** Image cache */
  protected readonly images: ImageCache;

  /** Sound cache */
  protected readonly sounds: SoundCache;

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
    sounds: SoundCache,
    tweens: TweenGroup,
    keyboard: Keyboard,
  ) {
    super();
    this.width = width;
    this.height = height;
    this.data = data;
    this.images = images;
    this.sounds = sounds;
    this.tweens = tweens;
    this.keyboard = keyboard;
    this.init();
  }

  public activate(): void {
    // Perform actions when this scene is activated
    return;
  }

  public update(_dt: number): void {
    return;
  }

  public deactivate(): void {
    // Perform actions when this scene is deactivated
    return;
  }

  protected init(): void {
    return;
  }

}
