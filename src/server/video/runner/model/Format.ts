import {type IClipChildrenProps} from "./Clip";
import type Clip from "./Clip";
import { type IClipModule } from "./Interface";

class Format implements IClipModule {
  private readonly clip: Clip;

  constructor(props: IClipChildrenProps) {
    this.clip = props.clip;
    return this;
  }
  formats = {
    yuv420p: "yuv420p",
    yuvj420p: "yuvj420p",
    yuv422p: "yuv422p",
    yuvj422p: "yuvj422p",
    yuva444p: "yuva444p", // has alpha
    yuvj444p: "yuvj444p",
    nv12: "nv12",
    nv16: "nv16",
    nv21: "nv21",
    rgba: "rgba", // has alpha
  };

  addFormat = () => {
    return `${this.clip.label}format=pix_fmts=${this.formats.rgba}${this.clip.newLabel};`;
  };

  public getScript = () => {
    return this.addFormat();
  };
}

export default Format;
