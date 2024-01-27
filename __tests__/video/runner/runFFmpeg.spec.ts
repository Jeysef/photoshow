import { OutputResolution } from "@/core/schemas/enums";
import { Configurator, type IConfiguratorProps } from "@/server/video/configurator";
import Edit from "@/server/video/runner/Edit";
import { runFFmpeg } from "@/server/video/runner/runFFmpeg";
import { OrientationType } from "@/types/types";
import path from "path";

describe("Should run test video", () => {
    it("expected successful video render", () => {
        const configuratorProps: IConfiguratorProps = {
            config: {
                orientation: OrientationType.LANDSCAPE,
                resolution: OutputResolution.FULL_HD,
                soundtrack: "adventure-travel-128404.mp3",
                title: "test",
            },
            destination: {
                name: "test.mp4",
                src: path.resolve(__dirname, "test"),
            },
            images: [path.resolve(__dirname, "../../testImages/testImage1.jpg"), path.resolve(__dirname, "../../testImages/testImage2.jpg")],
        };
        const configurator = new Configurator(configuratorProps);
        const configuration = configurator.construct();

        const data = new Edit(configuration);

        runFFmpeg(data);
    });
});
