import type Output from "../jsonGenerator/model/Output";
import type RendererTrack from "../jsonGenerator/model/Track";
import Track, { type ITrackOutput } from "./model/Track";

export interface ITracksProps {
    tracks: RendererTrack[];
    background: string;
    output: Output;
}

export interface ITracksOutput extends ITrackOutput {
    tracksCount: number;
}

class Tracks {
    private readonly inputTracks: RendererTrack[];
    constructor(private props: ITracksProps) {
        this.inputTracks = this.props.tracks;
    }

    private getTracks(props: ITracksProps) {
        const inputTracks: Track[] = [];
        this.inputTracks.reduce(
            (accumulator, track, index) => {
                const newTrack = new Track({
                    track: track,
                    index: index,
                    background: props.background,
                    output: props.output,
                    prevTrack: accumulator,
                });
                inputTracks.push(newTrack);
                return newTrack;
            },
            undefined as Track | undefined,
        );
        return inputTracks;
    }

    /**
     * czech: vkládám podklady tak že poslední je nahoře a všechny předchozí jsou postupně pod ním
     */
    private overlayTracks(tracks: Track[], tracksOutput: ITrackOutput[]) {
        return tracks.reduceRight(
            (accumulator, track, currentIndex, tracks) => {
                const currentTrack = tracksOutput[currentIndex];
                if (!currentTrack) throw new Error("currentTrack is undefined");
                let overlay = {
                    script: "",
                    outputStreamLabel: currentTrack.outputStreamLabel,
                };
                if (currentIndex < tracks.length - 1) {
                    const previousTrack = tracks[currentIndex + 1];
                    if (!previousTrack) throw new Error("previousTrack is undefined");
                    // the previous track will be on top of the current track
                    overlay = track.overlayBy(previousTrack);
                }
                return {
                    script: accumulator.script + overlay.script,
                    outputStreamLabel: overlay.outputStreamLabel,
                };
            },
            {
                script: "",
                outputStreamLabel: "",
            },
        );
    }

    public getOutput(): ITracksOutput {
        const tracks = this.getTracks(this.props);
        const tracksOutput = tracks.map((track) => track.getOutput());
        const overlay = this.overlayTracks(tracks, tracksOutput);
        return {
            assets: tracksOutput.map((track) => track.assets).flat(),
            script: tracksOutput.reduce((acc, curr) => acc + curr.script + ";", "") + overlay.script,
            outputStreamLabel: overlay.outputStreamLabel,
            tracksCount: tracks.length,
            clipsCount: tracksOutput.reduce((acc, curr) => acc + curr.clipsCount, 0),
            duration: tracksOutput.reduce((acc, curr) => (acc > curr.duration ? acc : curr.duration), 0),
        };
    }
}

export default Tracks;
