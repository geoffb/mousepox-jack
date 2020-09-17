import { Howl } from "howler";

/** Cache of loaded sounds */
export class SoundCache {

  /** Volume of sounds played */
  public volume = 1;

  /** Howls cache */
  private howls: Map<string, Howl> = new Map();

  /** Register and load a batch of sounds */
  public async register(sounds: { [index: string]: string; }) {
    for (const key in sounds) {
      const howl = new Howl({
        src: sounds[key],
      });
      this.howls.set(key, howl);
    }
  }

  /** Play a previously registered sound */
  public play(alias: string, volume?: number) {
    const vol = volume ?? this.volume;
    if (vol <= 0) { return; }
    const howl = this.howls.get(alias);
    if (howl !== undefined) {
      howl.volume(vol);
      howl.play();
    }
  }

}
