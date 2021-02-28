import { TweenGroup } from "@mousepox/tween";
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

  /** Active scene */
  private activeScene: Scene | undefined;

  /** Last update time */
  private updateTime = -1;

  /** Whether the game is currently running */
  private running = false;

  /** Animation callback */
  private animFrameHandler: (time: number) => void;

  constructor(width: number, height: number) {
    // Initialize stage
    this.stage = new Surface(width, height);
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

    // Reset transformation matrix
    ctx.resetTransform();

    // Render active scene
    if (this.activeScene !== undefined) {
      this.activeScene.render(ctx);
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
