import { OutputFPS, type OutputFormat, OutputResolution } from "../../schemas/enums";
import { type IDestination, type ISize } from "../../schemas/interfaces";
import { getSizeFromResolution } from "../../scriptGenerator/functions/functions";

class Output {
    format?: OutputFormat;
    resolution: OutputResolution = OutputResolution.SD;
    fps: OutputFPS = OutputFPS.FPS_25;
    size: ISize = getSizeFromResolution(this.resolution)
    destination: IDestination = { src: "", name: "unnamedVideo" };

    constructor(format?: OutputFormat) {
        this.format = format;
    }

    /**
     * Sets The output format and type of media file to generate. <ul>   <li>`mp4` - mp4 video file</li>   <li>`gif` - animated gif</li>   <li>`jpg` - jpg image file</li>   <li>`png` - png image file</li>   <li>`bmp` - bmp image file</li>   <li>`mp3` - mp3 audio file (audio only)</li> </ul>
     * @param {module:model/Output.FormatEnum} format The output format and type of media file to generate. <ul>   <li>`mp4` - mp4 video file</li>   <li>`gif` - animated gif</li>   <li>`jpg` - jpg image file</li>   <li>`png` - png image file</li>   <li>`bmp` - bmp image file</li>   <li>`mp3` - mp3 audio file (audio only)</li> </ul>
     */
    public setFormat = (format: OutputFormat) => {
        this.format = format;
        return this;
    };

    /**
     * Sets The output resolution of the video or image. <ul>   <li>`preview` - 512px x 288px @ 15fps</li>   <li>`mobile` - 640px x 360px @ 25fps</li>   <li>`sd` - 1024px x 576px @ 25fps</li>   <li>`hd` - 1280px x 720px @ 25fps</li>   <li>`1080` - 1920px x 1080px @ 25fps</li> </ul>
     * @param {module:model/Output.ResolutionEnum} resolution The output resolution of the video or image. <ul>   <li>`preview` - 512px x 288px @ 15fps</li>   <li>`mobile` - 640px x 360px @ 25fps</li>   <li>`sd` - 1024px x 576px @ 25fps</li>   <li>`hd` - 1280px x 720px @ 25fps</li>   <li>`1080` - 1920px x 1080px @ 25fps</li> </ul>
     */
    public setResolution = (resolution: OutputResolution) => {
        this.resolution = resolution;
        return this;
    };

    /**
     * Sets Override the default frames per second. Useful for when the source footage is recorded at 30fps, i.e. on  mobile devices. Lower frame rates can be used to add cinematic quality (24fps) or to create smaller file size/faster render times or animated gifs (12 or 15fps). Default is 25fps. <ul>   <li>`12` - 12fps</li>   <li>`15` - 15fps</li>   <li>`24` - 24fps</li>   <li>`23.976` - 23.976fps</li>   <li>`25` (default) - 25fps</li>   <li>`29.97` - 29.97fps</li>   <li>`30` - 30fps</li> </ul>
     * @param {module:model/Output.FpsEnum} fps Override the default frames per second. Useful for when the source footage is recorded at 30fps, i.e. on  mobile devices. Lower frame rates can be used to add cinematic quality (24fps) or to create smaller file size/faster render times or animated gifs (12 or 15fps). Default is 25fps. <ul>   <li>`12` - 12fps</li>   <li>`15` - 15fps</li>   <li>`24` - 24fps</li>   <li>`23.976` - 23.976fps</li>   <li>`25` (default) - 25fps</li>   <li>`29.97` - 29.97fps</li>   <li>`30` - 30fps</li> </ul>
     */
    public setFps = (fps: number) => {
        this.fps = fps;
        return this;
    };

    /**
     * @param {module:model/Size} size
     */
    public setSize = (size: ISize) => {
        this.size = size;
        return this;
    };

    public setDestination = (destination: IDestination) => {
        this.destination = destination;
        return this;
    };
}

export default Output;