import { type FFMpegProgress, type IFFMpegProgressData } from "ffmpeg-progress-wrapper";
import { ProcessState, type IProcessInfo, type IProcessMeta, type IStartProcessParams, type RangeIncl, type UserId, type VideoId } from "../../types/types";
import { concealIncl } from "../utils/utils";
import { LoggerEmoji, LoggerState } from "./enums";
import { deleteVideoFolder } from "./fileLoader";
import Logger from "./logger";

class Controller {
    private static instance: Controller;
    private processInfoList: Map<VideoId, { info: IProcessInfo }>;
    videoId: VideoId = "";

    private constructor() {
        this.processInfoList = new Map();
    }

    public static getInstance(): Controller {
        if (!Controller.instance) {
            Controller.instance = new Controller();
        }
        return Controller.instance;
    }
    /**
     * @description this method does not have meaning yet
     */
    public subscribe(videoId: string) {
        if (!this.processInfoList.has(videoId)) {
            return false;
        }
        if (this.processInfoList.get(videoId)!.info.state === ProcessState.SUCCESS) {
        } else {
        }
        return true;
    }

    public onError(videoId: VideoId) {
        Logger.log(LoggerState.ERROR, LoggerEmoji.ERROR, "Process with id " + videoId + " finished with error");
        if (this.processInfoList.has(videoId)) {
            this.processInfoList.get(videoId)!.info.state = ProcessState.ERROR;
            this.processInfoList.get(videoId)!.info.meta.videoProgress = 100;
            return true;
        }
        // this.delete  Video(videoId);
    }

    public onSuccess(videoId: VideoId) {
        Logger.log(LoggerState.INFO, LoggerEmoji.SUCCESS, "Process with id " + videoId + " finished successfully");
        if (this.processInfoList.has(videoId)) {
            this.processInfoList.get(videoId)!.info.state = ProcessState.SUCCESS;
            this.processInfoList.get(videoId)!.info.meta.videoProgress = 100;
            const seconds = Math.round((Date.now() - this.processInfoList.get(videoId)!.info.meta.startTime) / 1000);
            Logger.log(LoggerState.INFO, LoggerEmoji.SUCCESS, "Process with id " + videoId + " took " + seconds + " seconds");
        }
        // this.deleteVideo(videoId);
    }
    private trackProgress(videoId: VideoId, progress: FFMpegProgress, duration: number) {
        const updateProgress = (time: number | null) => {
            if (time) {
                this.processInfoList.get(videoId)!.info.meta.videoProgress = concealIncl(0, 100, Math.min(98, Math.round((time / duration) * 100)));
            }
        };

        // progress.on("details", (details: IFFMpegFileDetails) => console.log("details: ", JSON.stringify(details)));
        progress.on("progress", (progressData: IFFMpegProgressData) => updateProgress(progressData.time));
        progress.on("end", (code: number | undefined) => {
            if (code === 0) this.onSuccess(videoId);
            else this.onError(videoId);
        });
    }

    public startProcess(videoId: VideoId, userId: UserId): boolean {
        Logger.log(LoggerState.INFO, LoggerEmoji.PROCESS, "Creating process for user " + userId + " with videoId " + videoId);
        if (this.processInfoList.has(videoId)) {
            this.processInfoList.get(videoId)!.info.state = ProcessState.LOADING_IMAGES;
            this.processInfoList.get(videoId)!.info.meta.videoProgress = 0;
            this.processInfoList.get(videoId)!.info.meta.photoProgress = 0;
            return true;
        }
        this.processInfoList.set(videoId, {
            info: {
                state: ProcessState.LOADING_IMAGES,
                meta: {
                    videoProgress: 0,
                    videoDuration: 0,
                    photoProgress: 0,
                    videoId: videoId,
                    startTime: 0,
                } satisfies Required<IProcessMeta>,
            },
        });
        return false;
    }
    public addVideo(props: IStartProcessParams): boolean {
        const { videoId, progress, duration } = props;

        if (this.getStateOfProcess(videoId) === ProcessState.ERROR || this.getStateOfProcess(videoId) === ProcessState.LOADING_IMAGES) {
            // Logger.log(LoggerState.INFO, LoggerEmoji.PROCESS, "Starting new process for id" + videoId + "...");
            this.processInfoList.set(videoId, {
                info: {
                    state: ProcessState.LOADING_VIDEO,
                    meta: {
                        videoProgress: 0,
                        videoDuration: 0,
                        photoProgress: 100,
                        videoId: videoId,
                        startTime: Date.now(),
                    } satisfies Required<IProcessMeta>,
                },
            });
            this.subscribe(videoId);
            this.trackProgress(videoId, progress, duration);
            return true;
        }
        return false;
    }

    public getStateOfProcess(videoId: VideoId): ProcessState {
        if (this.processInfoList.has(videoId)) {
            return this.processInfoList.get(videoId)!.info.state;
        }
        return ProcessState.NOT_FOUND;
    }

    public setPhotoProgress(videoId: VideoId, progress: RangeIncl<0, 100>): boolean {
        if (this.processInfoList.has(videoId)) {
            this.processInfoList.get(videoId)!.info.meta.photoProgress = progress;
            return true;
        }
        return false;
    }
    getProgress(videoId: VideoId) {
        if (this.processInfoList.has(videoId)) {
            return this.processInfoList.get(videoId)!.info;
        }
        return false;
    }

    private deleteVideo(videoId: VideoId) {
        setTimeout(() => {
            if (this.processInfoList.has(videoId)) {
                this.processInfoList.delete(videoId);
            }
            deleteVideoFolder(videoId);
        }, 10000);
    }
}

export default Controller.getInstance();
