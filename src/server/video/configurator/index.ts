import { env } from "@/env";
import { OrientationType, type IConfig, type IMood } from "@/types/types";
import Big from "big.js";
import fs from "fs-extra";
import path from "path";
import { getRandomEnumStartingWith, getRandomFromArray } from "../../../utils/utils";
import { getSizeFromResolution } from "../functions";
import logger from "../logger";
import { LoggerEmoji, LoggerState } from "../logger/enums";
import { FitType, MotionEffect, OutputResolution, TitleSize, smoothTransitions, type OutputFormat, type XFadeTransition } from "../types/enums";
import { type IDestination, type IEffect, type ISize, type ITitleAsset, type ITransition } from "../types/interfaces";
import Shotstack from "./model";
import type Clip from "./model/Clip";
import type Edit from "./model/Edit";
import type Output from "./model/Output";
import type Soundtrack from "./model/Soundtrack";
import type Timeline from "./model/Timeline";
import type Track from "./model/Track";
import type { Asset } from "./model/assets/Asset";
import type { ImageAsset } from "./model/assets/ImageAsset";
import type { TitleAsset } from "./model/assets/TitleAsset";

Big.DP = 2;

export interface IConfiguratorProps {
    images: string[];
    destination: IDestination;
    config: IConfig;
}

interface IClipData {
    clips: Clip[];
    duration: Big;
}

export class Configurator {
    constructor(private readonly props: IConfiguratorProps) {}

    private getMood(): IMood {
        const moodsPath = path.resolve(process.cwd(), env.NEXT_PUBLIC_MOODS_FILE);
        try {
            const moods = fs.readJSONSync(moodsPath) as IMood[];
            const moodFromConfig = moods.find((mood) => mood.name === this.props.config.soundtrack);
            if (moodFromConfig) {
                return moodFromConfig;
            }
            if (this.props.config.soundtrack) {
                if (this.props.config.soundtrack !== "automatic") {
                    // TODO: calculate mood from soundtrack
                    const customMood: IMood = {
                        name: this.props.config.soundtrack,
                        tempo: 100,
                        duration: 60,
                        automatic: false,
                    };
                    return customMood;
                }
            }
            return getRandomFromArray(moods.filter((mood) => mood.automatic));
        } catch (e) {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            logger.log(LoggerState.ERROR, LoggerEmoji.ERROR, `error reading moods file: ${moodsPath}. Error: ${e}`);
            throw e;
        }
    }

    private addSoundtrack = (props: IMood): Soundtrack => {
        const soundtrack = new Shotstack.Soundtrack();
        const soundtrackPath = path.resolve(process.cwd(), env.NEXT_PUBLIC_SOUNDTRACKS_DIR, props.name);
        soundtrack.setSrc(soundtrackPath);
        soundtrack.setFadeIn(2).setFadeOut(2);
        // if (props.effect) {
        //     soundtrack.setEffect(props.effect);
        // }

        return soundtrack;
    };

    private createClip = (props: { asset: Asset; start: Big; length: Big; fit: FitType; transition?: ITransition; effects?: IEffect[] }): Clip => {
        const clip = new Shotstack.Clip();
        clip.setAsset(props.asset).setStart(props.start).setLength(props.length).setFit(props.fit);
        if (props.transition) clip.setTransition(props.transition);
        if (props.effects) clip.setEffect(props.effects);

        return clip;
    };

    private createImageAsset = (props: { src: string }): ImageAsset => {
        const imageAsset = new Shotstack.ImageAsset();
        imageAsset.setSrc(props.src);
        return imageAsset;
    };

    private createTitleAsset = (props: Omit<ITitleAsset, "type">): TitleAsset => {
        const { text, style, size, position, color, background, offset } = props;
        const titleAsset = new Shotstack.TitleAsset();
        titleAsset.setText(text);
        if (style) titleAsset.setStyle(style);
        if (size) titleAsset.setSize(size);
        if (position) titleAsset.setPosition(position);
        if (color) titleAsset.setColor(color);
        if (background) titleAsset.setBackground(background);
        if (offset) titleAsset.setOffset(offset);
        return titleAsset;
    };

    private getDurationFromMood = ({ tempo }: IMood): Big => {
        const getSkipper = (): number => {
            const randomSkippers = [
                [3, 4, 5],
                [5, 6, 7],
                [7, 8, 9],
            ] as readonly [number[], number[], number[]];

            if (tempo > 100) {
                return getRandomFromArray(randomSkippers[2]);
            } else if (tempo > 80) {
                return getRandomFromArray(randomSkippers[1]);
            } else {
                return getRandomFromArray(randomSkippers[0]);
            }
        };
        return Big(getSkipper()).times(60).div(tempo);
    };

    private createEffectsForImage = (duration: Big, i: number): IEffect[] => {
        const effects: IEffect[] = [];
        const speed = 0.3;
        effects.push({ type: i === 0 ? MotionEffect.ZOOM_IN_CENTER : getRandomEnumStartingWith(MotionEffect, "ZOOM_IN"), duration, speed });
        return effects;
    };

    private createImageClips = (mood: IMood): IClipData => {
        let prevTransition: XFadeTransition = getRandomFromArray(smoothTransitions);

        const getRandomTransition = (): ITransition => {
            return { in: prevTransition, out: (prevTransition = getRandomFromArray(smoothTransitions)) };
        };
        const clips = this.props.images.reduce(
            (acc, image, index) => {
                const duration = this.getDurationFromMood(mood);
                const clip = this.createClip({
                    asset: this.createImageAsset({ src: image }),
                    start: acc.duration,
                    length: duration,
                    fit: FitType.CROP,
                    transition: getRandomTransition(),
                    effects: this.createEffectsForImage(duration, index),
                });
                return { clips: [...acc.clips, clip], duration: acc.duration.add(duration) };
            },
            { clips: [] as Clip[], duration: Big("0") },
        );

        return clips;
    };

    private createTrack = (props: { clips: Clip[] }): Track => {
        const track = new Shotstack.Track();
        track.setClips(props.clips);
        return track;
    };

    private createOutput = (props: { format?: OutputFormat; size: ISize; resolution: OutputResolution; fps: number }): Output => {
        let output = new Shotstack.Output();
        if (props.format) output = output.setFormat(props.format);
        output.setResolution(props.resolution).setFps(props.fps).setDestination(this.props.destination).setSize(props.size);
        return output;
    };

    private createTimeline = (props: { tracks: Track[]; soundtrack?: Soundtrack; background?: string }): Timeline => {
        const timeline = new Shotstack.Timeline();
        timeline.setTracks(props.tracks);
        if (props.background) timeline.setBackground(props.background);
        if (props.soundtrack) timeline.setSoundtrack(props.soundtrack);
        return timeline;
    };

    private createEdit = (props: { timeline: Timeline; output: Output }): Edit => {
        const edit = new Shotstack.Edit();
        edit.setTimeline(props.timeline).setOutput(props.output);
        return edit;
    };

    public construct(): Edit {
        const mood = this.getMood();
        const clips = this.createImageClips(mood);
        const resolution = this.props.config.resolution ?? OutputResolution.FULL_HD;
        const size = getSizeFromResolution(resolution, this.props.config.orientation === OrientationType.PORTRAIT);
        const clips2: Clip[] = [];

        if (this.props.config.title) {
            clips2.push(
                this.createClip({
                    asset: this.createTitleAsset({
                        text: this.props.config.title,
                        size: TitleSize.LARGE,
                        color: "white",
                        // background: "#00000000",
                    }),
                    start: Big(0),
                    length: Big(5),
                    fit: FitType.CROP,
                }),
            );
        }

        const soundtrack = this.addSoundtrack(mood);
        const tracks = clips2.length
            ? [this.createTrack({ clips: clips.clips }), this.createTrack({ clips: clips2 })]
            : [this.createTrack({ clips: clips.clips })];
        const timeline = this.createTimeline({ tracks, soundtrack });

        const output = this.createOutput({
            size: size,
            resolution: resolution,
            fps: 30,
        });

        const edit = this.createEdit({ timeline, output });

        return edit;
    }
}
