import { Configurator, type IConfiguratorProps } from "@/server/video/configurator";
import { OutputResolution } from "@/server/video/types/enums";
import { OrientationType } from "@/types/types";

describe("Should configurator output expected result", () => {
    it("expected result", () => {
        const configuratorProps: IConfiguratorProps = {
            config: {
                orientation: OrientationType.LANDSCAPE,
                resolution: OutputResolution.FULL_HD,
                soundtrack: "adventure-travel-128404.mp3",
                title: "test",
            },
            destination: {
                name: "test",
                src: "out",
            },
            images: ["http://placekitten.com/g/200/300", "http://placekitten.com/g/200/300", "http://placekitten.com/g/200/300"],
        };
        const configurator = new Configurator(configuratorProps);
        const edit = configurator.construct();
        expect(edit.output.destination).toEqual(configuratorProps.destination);
        expect(edit.output.resolution).toEqual(configuratorProps.config.resolution);
        expect(edit.timeline.tracks[0]).not.toBeUndefined();
        expect(edit.timeline.tracks[0]?.clips.length).toEqual(configuratorProps.images.length);
    });
});
