import { JsonGenerator, type IJsonGeneratorProps } from "@/core/jsonGenerator/JsonGenerator";
import { OutputResolution } from "@/core/schemas/enums";
import { OrientationType } from "@/types/types";

describe("JsonGenerator", () => {
    let props: IJsonGeneratorProps;

    beforeEach(() => {
        props = {
            images: ["image1", "image2"],
            destination: { name: "name", src: "src" },
            config: { soundtrack: "soundtrack1", resolution: OutputResolution.SD, orientation: OrientationType.LANDSCAPE, title: "title" },
        };
    });

    it("should construct without errors", () => {
        const generator = new JsonGenerator(props);
        expect(generator).toBeInstanceOf(JsonGenerator);
    });

    it("should create JSON", () => {
        const edit = JsonGenerator.createJson(props);
        expect(edit).toBeDefined();
    });

    it("should create JSON with soundtrack", () => {
        props = {
            images: ["image1", "image2"],
            destination: { name: "name", src: "src" },
            config: { resolution: OutputResolution.SD, orientation: OrientationType.LANDSCAPE, title: "title" },
        };
        const edit = JsonGenerator.createJson(props);
        expect(edit.timeline.soundtrack).toBeDefined();
    });

    it("should create JSON with title", () => {
        const edit = JsonGenerator.createJson(props);
        expect(edit.timeline.tracks[1]?.clips[0]).toBeDefined();
    });

    it("should be JSON serializable", () => {
        const edit = JsonGenerator.createJson(props);
        const json = JSON.stringify(edit);
        expect(json).toBeDefined();
    });
});
