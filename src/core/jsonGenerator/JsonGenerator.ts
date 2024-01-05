import { type IMood } from "@/components/pages/audio/types";
import { type IConfig, OrientationType } from "@/types/types";
import * as fs from "fs";
import path from "path";
import Shotstack from ".";
import { LoggerEmoji, LoggerState } from "../controller/enums";
import Logger from "../controller/logger";
import {
    ConnectEffect,
    EffectEffect,
    FitType,
    MotionEffect,
    OutputFormat,
    OutputResolution,
    TitleSize,
    type VolumeEffect,
    type XFadeTransition,
    smoothTransitions,
} from "../schemas/enums";
import { type IDestination, type IEffect, type ISize, type ITitleAsset, type ITransition } from "../schemas/interfaces";
import { getSizeFromResolution } from "../scriptGenerator/functions/functions";
import { concealIncl, getRandomEnum, getRandomFromArray, roundToFloatingPoint, roundedMul } from "../utils/utils";
import type Clip from "./model/Clip";
import type Edit from "./model/Edit";
import type Output from "./model/Output";
import type Soundtrack from "./model/Soundtrack";
import type Timeline from "./model/Timeline";
import type Track from "./model/Track";
import { type Asset } from "./model/assets/Asset";
import { type ImageAsset } from "./model/assets/ImageAsset";
import { type TitleAsset } from "./model/assets/TitleAsset";
import { type VideoAsset } from "./model/assets/VideoAsset";
import { MOOD_PATH } from "@/constants";

export interface IJsonGeneratorProps {
    images: string[];
    destination: IDestination;
    config: IConfig;
}

export class JsonGenerator {
    private readonly images: string[];
    private readonly imagesCount: number;
    private readonly destination: IDestination;
    private readonly config: IConfig;
    /**
     * editable variables
     */
    private isWithSoundtrack = true;
    private isWithTitle = true;
    private isWithEndingVideo = false;

    constructor(props: IJsonGeneratorProps) {
        this.images = props.images;
        this.imagesCount = props.images.length;
        this.destination = props.destination;
        this.config = props.config;
    }

    public static createJson(props: IJsonGeneratorProps): Edit {
        return new JsonGenerator(props).construct();
    }

    private getMood(): IMood {
        if (!MOOD_PATH) {
            Logger.log(LoggerState.ERROR, LoggerEmoji.ERROR, "MOOD_PATH is not provided");
            throw new Error("MOOD_PATH is not provided");
        }
        const jsonString = fs.readFileSync(path.resolve(process.cwd(), MOOD_PATH), "utf8");
        const moods = JSON.parse(jsonString) as IMood[];
        const moodFromConfig = moods.find((mood) => mood.name === this.config.soundtrack);
        if (moodFromConfig) {
            return moodFromConfig;
        }
        if (this.config.soundtrack) {
            Logger.log(LoggerState.WARNING, LoggerEmoji.WARNING, `soundtrack ${this.config.soundtrack} not found in moods`);
        }
        return getRandomFromArray(moods.filter((mood) => !mood.manual));
    }

    public construct = () => {
        const mood = this.getMood();
        let prevTransition: XFadeTransition = getRandomFromArray(smoothTransitions);

        const getRandomTransition = (): ITransition => {
            return { in: prevTransition, out: (prevTransition = getRandomFromArray(smoothTransitions)) };
        };

        // original
        // const randomSkippers = [
        //     [2,3,4],
        //     [3,4,5],
        //     [5,6,7],
        // ]
        // slower
        const randomSkippers = [
            [3, 4, 5],
            [5, 6, 7],
            [7, 8, 9],
        ] as readonly [number[], number[], number[]];

        const getDurationForImage = (mood: IMood): number => {
            let skipper: number;
            if (mood.tempo > 100) {
                skipper = getRandomFromArray(randomSkippers[2]);
            } else if (mood.tempo > 80) {
                skipper = getRandomFromArray(randomSkippers[1]);
            } else {
                skipper = getRandomFromArray(randomSkippers[0]);
            }
            const tempo = mood.tempo;
            const duration = (60 / tempo) * skipper;
            return duration;
        };

        const clips = this.images.reduce(
            (acc, image, i) => {
                const duration = roundToFloatingPoint(getDurationForImage(mood), 2);
                const clip = this.addClip({
                    asset: this.createImageAsset({ src: image }),
                    start: acc.duration,
                    length: duration,
                    fit: FitType.CROP,
                    transition: getRandomTransition(),
                    effects: this.createEffectsForImage(duration, i),
                });

                return {
                    clips: [...acc.clips, clip],
                    duration: acc.duration + duration,
                };
            },
            { clips: [] as Clip[], duration: 0 },
        );

        if (this.isWithEndingVideo) {
            const duration = 6;
            clips.clips.push(
                this.addClip({
                    asset: this.createVideoAsset({
                        src: "assets/worldee.mp4",
                    }),
                    start: clips.duration,
                    length: duration,
                    fit: FitType.CROP,
                }),
            );
            clips.duration += duration;
        }
        console.log("🚀 ~ file: JsonGenerator.ts:127 ~ JsonGenerator ~ clips.duration:", clips.duration);
        const clips2: Clip[] = [];

        if (this.isWithTitle && this.config.title) {
            clips2.push(
                this.addClip({
                    asset: this.createTitleAsset({
                        text: this.config.title,
                        size: TitleSize.LARGE,
                        color: "white",
                        // background: "#00000000",
                    }),
                    start: 0,
                    length: 5,
                    fit: FitType.CROP,
                }),
            );
        }

        const soundtrack = this.isWithSoundtrack ? this.addSoundtrack({ src: "musics/" + mood.name }) : undefined;
        const tracks = clips2.length ? [this.addTrack({ clips: clips.clips }), this.addTrack({ clips: clips2 })] : [this.addTrack({ clips: clips.clips })];
        const timeline = this.addTimeline({ tracks, soundtrack });
        const resolution = this.config.resolution ?? OutputResolution.FULL_HD;
        const output = this.addOutput({
            format: OutputFormat.MP4,
            size: getSizeFromResolution(resolution, this.config.orientation === OrientationType.PORTRAIT),
            resolution: resolution,
            fps: 30,
        });
        const edit = this.addEdit({ timeline, output });
        return edit;
    };

    private createEffectsForImage = (duration: number, i: number): IEffect[] => {
        const effects: IEffect[] = [];
        const speed = 0.55;
        const split = Math.random() < 0.3;
        if (split) {
            /**
             *          [stream] // with MotionEffect
             *           [split]
             * [splitStream1][splitStream2]
             * [EffectEffect]       |
             *           [connect]
             */
            const connectDuration = 0.5;
            const connectOffsetPercent = ((number) => concealIncl(0, 100, number) / 100)(20);
            const stream1Duration = concealIncl(0, duration, roundedMul(undefined, duration, connectOffsetPercent));
            const stream2Duration = concealIncl(0, duration, roundedMul(undefined, duration, 1 - connectOffsetPercent));

            effects.push({ type: i === 0 ? MotionEffect.ZOOM_IN_CENTER : getRandomEnum(MotionEffect), duration: stream1Duration, speed });
            effects.push({ type: ConnectEffect.SPLIT, stream1Duration, stream2Duration, connectDuration });
            effects.push({ type: getRandomEnum(EffectEffect), duration: stream2Duration, speed });
            effects.push({ type: ConnectEffect.CONNECT, duration: connectDuration, offset: stream1Duration });
        } else {
            effects.push({ type: i === 0 ? MotionEffect.ZOOM_IN_CENTER : getRandomEnum(MotionEffect), duration, speed });
        }
        return effects;
    };

    private addSoundtrack = (props: { src: string; effect?: VolumeEffect }): Soundtrack => {
        const soundtrack = new Shotstack.Soundtrack();
        soundtrack.setSrc(props.src);
        if (props.effect) {
            soundtrack.setEffect(props.effect);
        }

        return soundtrack;
    };

    private addClip = (props: { asset: Asset; start: number; length: number; fit: FitType; transition?: ITransition; effects?: IEffect[] }): Clip => {
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

    private createVideoAsset = (props: { src: string }): VideoAsset => {
        const videoAsset = new Shotstack.VideoAsset();
        videoAsset.setSrc(props.src);
        return videoAsset;
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

    private addTrack = (props: { clips: Clip[] }): Track => {
        const track = new Shotstack.Track();
        track.setClips(props.clips);
        return track;
    };

    private addTimeline = (props: { tracks: Track[]; soundtrack?: Soundtrack; background?: string }): Timeline => {
        const timeline = new Shotstack.Timeline();
        timeline.setTracks(props.tracks);
        if (props.background) timeline.setBackground(props.background);
        if (props.soundtrack) timeline.setSoundtrack(props.soundtrack);
        return timeline;
    };

    private addOutput = (props: { format: OutputFormat; size: ISize; resolution: OutputResolution; fps: number }): Output => {
        const output = new Shotstack.Output();
        output.setFormat(props.format).setResolution(props.resolution).setFps(props.fps).setDestination(this.destination);
        return output;
    };

    private addEdit = (props: { timeline: Timeline; output: Output }): Edit => {
        const edit = new Shotstack.Edit();
        edit.setTimeline(props.timeline).setOutput(props.output);
        return edit;
    };
}
