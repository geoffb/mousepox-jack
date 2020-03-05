/** Load a sound */
async function loadAudio(url: string): Promise<HTMLAudioElement> {
  return new Promise((resolve, reject) => {
    const sound = new Audio(url);
    sound.addEventListener("canplaythrough", () => resolve(sound), false);
    sound.addEventListener("error", () => reject(), false);
    // sound.onload = () => resolve(sound);
    // sound.onerror = () => reject();
    // sound.src = url;
  });
}

/** Cache of loaded images */
export class SoundCache {

  /** Volume of sounds played */
  public volume = 1;

  /** Aliases for sounds */
  private aliases: Map<string, HTMLAudioElement> = new Map();

  /** Sound cache */
  private sounds: Map<string, HTMLAudioElement> = new Map();

  /** Register and load a batch of sounds */
  public async register(sounds: { [index: string]: string; }) {
    const urls: string[] = [];
    for (const key in sounds) {
      urls.push(sounds[key]);
    }
    await this.loadBatch(urls);
    for (const key in sounds) {
      this.aliases.set(key, this.get(sounds[key]));
    }
  }

  /** Play a previously registered sound */
  public play(alias: string, volume?: number) {
    const vol = volume ?? this.volume;
    if (vol <= 0) { return; }
    const sound = this.aliases.get(alias);
    if (sound !== undefined) {
      sound.volume = vol;
      sound.currentTime = 0;
      sound.play();
    } else {
      throw new Error(`[SoundCache.play] Invalid sound alias: ${alias}`);
    }
  }

  /** Load a single sound */
  public async load(url: string) {
    let sound = this.sounds.get(url);
    if (sound === undefined) {
      console.debug(`SoundCache.load: ${url}`);
      sound = await loadAudio(url);
      this.sounds.set(url, sound);
      console.debug(`Finished loading sound: ${url}`);
    }
    return sound;
  }

  /** Load a batch of sounds */
  public loadBatch(urls: string[]) {
    const batch: Array<Promise<HTMLAudioElement>> = [];
    for (const url of urls) {
      batch.push(this.load(url));
    }
    return Promise.all(batch);
  }

  /** Fetch a previously loaded and cached sound */
  public get(url: string): HTMLAudioElement {
    const sound = this.sounds.get(url);
    if (sound !== undefined) {
      return sound;
    } else {
      throw new Error(`[ImageCache.get] Invalid sound: ${url}`);
    }
  }

}
