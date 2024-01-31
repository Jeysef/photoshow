import { env } from "@/env";
import { OrientationType, type IConfig, type IMood } from "@/types/types";
import fs from "fs-extra";
import path from "path";
import { getRandomEnum, getRandomFromArray, roundToFloatingPoint } from "../../../utils/utils";
import { getSizeFromResolution } from "../functions";
import logger from "../logger";
import { LoggerEmoji, LoggerState } from "../logger/enums";
import { FitType, MotionEffect, OutputResolution, smoothTransitions, type OutputFormat, type XFadeTransition } from "../types/enums";
import { type IDestination, type IEffect, type ISize, type ITransition } from "../types/interfaces";
import Shotstack from "./model";
import type Clip from "./model/Clip";
import type Edit from "./model/Edit";
import type Output from "./model/Output";
import type Soundtrack from "./model/Soundtrack";
import type Timeline from "./model/Timeline";
import type Track from "./model/Track";
import type { Asset } from "./model/assets/Asset";
import type { ImageAsset } from "./model/assets/ImageAsset";

export interface IConfiguratorProps {
    images: string[];
    destination: IDestination;
    config: IConfig;
}

interface IClipData {
    clips: Clip[];
    duration: number;
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
                logger.log(LoggerState.WARNING, LoggerEmoji.WARNING, `soundtrack ${this.props.config.soundtrack} not found in moods`);
            }
            return getRandomFromArray(moods.filter((mood) => mood.automatic));
        } catch (e) {
            logger.log(LoggerState.ERROR, LoggerEmoji.ERROR, `error reading moods file: ${moodsPath}`);
            throw e;
        }
    }

    private addSoundtrack = (props: IMood): Soundtrack => {
        const soundtrack = new Shotstack.Soundtrack();
        const soundtrackPath = path.resolve(process.cwd(), env.NEXT_PUBLIC_SOUNDTRACKS_DIR, props.name);
        soundtrack.setSrc(soundtrackPath);
        // if (props.effect) {
        //     soundtrack.setEffect(props.effect);
        // }

        return soundtrack;
    };

    private createClip = (props: { asset: Asset; start: number; length: number; fit: FitType; transition?: ITransition; effects?: IEffect[] }): Clip => {
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

    private getDurationFromMood = ({ tempo }: IMood): number => {
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
        return roundToFloatingPoint((60 / tempo) * getSkipper(), 2);
    };

    private createEffectsForImage = (duration: number, i: number): IEffect[] => {
        const effects: IEffect[] = [];
        const speed = 0.3;
        effects.push({ type: i === 0 ? MotionEffect.ZOOM_IN_CENTER : getRandomEnum(MotionEffect), duration, speed });
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
                return { clips: [...acc.clips, clip], duration: acc.duration + duration };
            },
            { clips: [] as Clip[], duration: 0 },
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
        output.setResolution(props.resolution).setFps(props.fps).setDestination(this.props.destination);
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

        const soundtrack = this.addSoundtrack(mood);
        const tracks = [this.createTrack({ clips: clips.clips })];
        const timeline = this.createTimeline({ tracks, soundtrack });

        const resolution = this.props.config.resolution ?? OutputResolution.FULL_HD;
        const output = this.createOutput({
            size: getSizeFromResolution(resolution, this.props.config.orientation === OrientationType.PORTRAIT),
            resolution: resolution,
            fps: 30,
        });

        const edit = this.createEdit({ timeline, output });

        return edit;
    }
}
