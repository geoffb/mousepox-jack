/** Load an image */
async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject();
    image.src = url;
  });
}

/** Cache of loaded images */
export class ImageCache {

  /** Image cache */
  private images: Map<string, HTMLImageElement> = new Map();

  /** Load a single image */
  public async load(url: string) {
    let image = this.images.get(url);
    if (image === undefined) {
      image = await loadImage(url);
      this.images.set(url, image);
    }
    return image;
  }

  /** Load a batch of images */
  public loadBatch(urls: string[]) {
    const batch: Array<Promise<HTMLImageElement>> = [];
    for (const url of urls) {
      batch.push(this.load(url));
    }
    return Promise.all(batch);
  }

  /** Fetch a previously loaded and cached image */
  public get(url: string): HTMLImageElement {
    const image = this.images.get(url);
    if (image !== undefined) {
      return image;
    } else {
      throw new Error(`[ImageCache.get] Invalid image: ${url}`);
    }
  }

}
