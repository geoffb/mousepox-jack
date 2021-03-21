import { Ease, TweenGroup } from "@mousepox/tween";
import { Box } from "./Box";
import { DataCache } from "./DataCache";
import { ImageCache } from "./ImageCache";
import { Keyboard } from "./Keyboard";
import { Scene } from "./Scene";
import { SoundCache } from "./SoundCache";
import { SpriteSheet } from "./SpriteSheet";
import { ISpriteFont, SpriteText } from "./SpriteText";
import { Surface } from "./Surface";

/** Sprite font definition */
interface ISpriteFontDefinition {
  sheet: string;
  width: number;
  height: number;
  glyphs: string;
}

/** Game options */
export interface IGameOptions {
  stageAlpha?: boolean;
  stagePixel?: boolean;
}

/** A 2D game */
export class Game {

  /** Main drawing surfadce */
  public stage: Surface;

  /** Scenes */
  public readonly scenes: Map<string, Scene> = new Map();

  /** Tween animations */
  public readonly tweens = new TweenGroup();

  /** Data cache */
  public readonly data = new DataCache();

  /** Image cache */
  public readonly images = new ImageCache();

  /** Sound cache */
  public readonly sounds = new SoundCache();

  /** Keyboard */
  public readonly keyboard = new Keyboard(document.body);

  /** Colored overlay used to fade in/out */
  private readonly overlay: Box;

  /** Active scene */
  private activeScene: Scene | undefined;

  /** Last update time */
  private updateTime = -1;

  /** Whether the game is currently running */
  private running = false;

  /** Animation callback */
  private animFrameHandler: (time: number) => void;

  constructor(width: number, height: number, options?: IGameOptions) {
    this.overlay = new Box(width, height, "#000");
    this.overlay.position.set(width / 2, height / 2);
    this.overlay.visible = false;

    // Initialize stage
    this.stage = new Surface(width, height, options?.stagePixel, options?.stageAlpha);
    const style = this.stage.canvas.style;
    style.position = "absolute";
    style.left = "0";
    style.top = "0";

    document.body.appendChild(this.stage.canvas);

    this.fitStageToWindow();

    // Automatically adjust stage to window size when it changes
    window.addEventListener("resize", this.fitStageToWindow.bind(this), false);

    this.animFrameHandler = this.update.bind(this);
  }

  public onUpdateBegin = () => { return; };

  public onUpdateEnd = () => { return; };

  /** Load a sprite font and optionally set as default */
  public async loadSpriteFont(url: string, makeDefault = false): Promise<ISpriteFont> {
    const config = await this.data.load(url) as ISpriteFontDefinition;
    const image = await this.images.load(config.sheet);
    const font: ISpriteFont = {
      glyphs: config.glyphs,
      sheet: new SpriteSheet(image, config.width, config.height),
    };
    if (makeDefault) {
      SpriteText.DefaultFont = font;
    }
    return font;
  }

  /** Start game */
  public start() {
    this.running = true;
    this.updateTime = performance.now();
    window.requestAnimationFrame(this.animFrameHandler);
  }

  /** Stop game */
  public stop() {
    this.running = false;
  }

  /** Add a new scene */
  public addScene<T extends Scene>(name: string, SceneClass: new (...args: any[]) => T): T {
    const scene = new SceneClass(
      this.stage.width,
      this.stage.height,
      this.data,
      this.images,
      this.sounds,
      this.tweens,
      this.keyboard);
    this.scenes.set(name, scene);
    return scene;
  }

  /** Activate a previously added scene */
  public activateScene(name: string) {
    const scene = this.scenes.get(name);
    if (scene !== undefined) {
      if (this.activeScene !== undefined) {
        this.activeScene.deactivate();
      }
      scene.activate();
      this.activeScene = scene;
    } else {
      throw new Error(`Invalid scene name: ${name}`);
    }
  }

  public fadeIn(duration?: number, fillStyle?: string): Promise<void> {
    if (fillStyle !== undefined) {
      this.overlay.fillStyle = fillStyle;
    }
    this.overlay.visible = true;
    if (duration !== undefined && duration > 0) {
      this.overlay.opacity = 0;
      return this.tweens.create(this.overlay)
        .to({
          opacity: 1,
        }, duration, Ease.QuadInOut)
        .promise();
    } else {
      this.overlay.opacity = 1;
      return Promise.resolve();
    }
  }

  public fadeOut(duration?: number, fillStyle?: string): Promise<void> {
    if (fillStyle !== undefined) {
      this.overlay.fillStyle = fillStyle;
    }
    this.overlay.visible = true;
    if (duration !== undefined && duration > 0) {
      this.overlay.opacity = 1;
      return this.tweens.create(this.overlay)
        .to({
          opacity: 0,
        }, duration, Ease.QuadInOut)
        .call(() => this.overlay.visible = false)
        .promise();
    } else {
      this.overlay.visible = false;
      return Promise.resolve();
    }
  }

  /** Update game */
  private update(time: number) {
    // Calculate delta time
    const dt = time - this.updateTime;
    this.updateTime = time;

    this.onUpdateBegin();

    // Update active scene
    if (this.activeScene !== undefined) {
      this.activeScene.update(dt);
    }

    this.keyboard.endFrame();

    // Update tween animations
    this.tweens.update(dt);

    // Render game
    this.render();

    this.onUpdateEnd();

    // While running, keep requesting animation frames
    if (this.running) {
      window.requestAnimationFrame(this.animFrameHandler);
    }
  }

  /** Render game */
  private render() {
    const ctx = this.stage.context;

    // Render active scene
    if (this.activeScene !== undefined) {
      ctx.resetTransform();
      this.activeScene.render(ctx);
    }

    // Render overlay
    if (this.overlay.visible) {
      ctx.resetTransform();
      this.overlay.render(ctx);
    }
  }

  /** Fit stage canvas to current window size */
  private fitStageToWindow() {
    const canvas = this.stage.canvas;

    // Viewport width
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Determine scale while maintaining aspect ratio
    const scale = Math.min(width / canvas.width, height / canvas.height);

    // Calculate centered position for scaled canvas
    const left = width / 2 - (canvas.width / 2 * scale);
    const top = height / 2 - (canvas.height / 2 * scale);

    // Apply styles
    canvas.style.width = `${canvas.width * scale}px`;
    canvas.style.height = `${canvas.height * scale}px`;
    canvas.style.left = `${left}px`;
    canvas.style.top = `${top}px`;
  }

}
