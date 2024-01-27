import type { ISubmitProps } from "@/types/types";
import { Configurator } from "./configurator";
import Edit from "./runner/Edit";
import { getDestinationPath } from "./runner/destinationPath";
import saveImages from "./runner/fileLoader";
import { runFFmpeg } from "./runner/runFFmpeg";
import type { IDestination } from "./types/interfaces";

export default async function (props: ISubmitProps) {
    const { formData, config, userId } = props;
    const videoId = userId + "/" + crypto.randomUUID();

    try {
        const { imagePaths } = await saveImages({ formData, videoId });

        const destination: IDestination = { name: "video", src: getDestinationPath(videoId) };

        const configuration = new Configurator({ config, images: imagePaths, destination }).construct();
        const data = new Edit(configuration);

        runFFmpeg(data);
        return { videoId };
    } catch (err) {
        console.error(err);
        return;
    }
}
