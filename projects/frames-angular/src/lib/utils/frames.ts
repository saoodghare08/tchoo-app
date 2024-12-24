export class CkoFrames {
  Frames: any;
  config: any;

  constructor(config: any) {
    let myWindowObject = window as any;
    let myWindowFrames = myWindowObject.frames as any;
    this.Frames = myWindowFrames.Frames as any;
    this.config = config;
  }

  init() {
    this.Frames.init(this.config);
  }

  getFrames() {
    return this.Frames;
  }

  async getTokenisedCard() {
    return this.Frames.submitCard();
  }
}
