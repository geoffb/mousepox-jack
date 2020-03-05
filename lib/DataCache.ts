/** Load a data file */
async function loadData(url: string) {
  const data = await fetch(url);
  return await data.json();
}

/** Cache of loaded data */
export class DataCache {

  /** Data cache */
  private data: Map<string, any> = new Map();

  /** Load a single data file */
  public async load(url: string) {
    let data = this.data.get(url);
    if (data === undefined) {
      data = await loadData(url);
      this.data.set(url, data);
    }
    return data;
  }

  /** Load a batch of data */
  public loadBatch(urls: string[]) {
    const batch: Array<Promise<any>> = [];
    for (const url of urls) {
      batch.push(this.load(url));
    }
    return Promise.all(batch);
  }

  /** Fetch a previously loaded and cached data file */
  public get(url: string): any {
    const data = this.data.get(url);
    if (data !== undefined) {
      return data;
    } else {
      throw new Error(`[DataCache.get] Invalid data: ${url}`);
    }
  }

}
