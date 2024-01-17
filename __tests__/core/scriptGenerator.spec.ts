import logger from "@/core/controller/logger";
import { JsonGenerator } from "@/core/jsonGenerator/JsonGenerator";
import type Edit from "@/core/jsonGenerator/model/Edit";
import { OutputResolution } from "@/core/schemas/enums";
import ScriptGenerator from "@/core/scriptGenerator/Timeline";
import { OrientationType } from "@/types/types";

jest.mock("../../src/core/controller/logger", () => ({
    log: jest.fn(),
}));

describe("ScriptGenerator", () => {
    let edit: Edit;

    beforeEach(() => {
        edit = JsonGenerator.createJson({
            images: ["image1", "image2"],
            destination: { name: "name", src: "src" },
            config: { soundtrack: "good-vibes-127577.mp3", resolution: OutputResolution.SD, orientation: OrientationType.LANDSCAPE, title: "title" },
        });
    });

    it("should construct without errors", () => {
        const generator = new ScriptGenerator(edit);
        expect(generator).toBeInstanceOf(ScriptGenerator);
    });

    it("should return script", () => {
        const generator = new ScriptGenerator(edit);
        const script = generator.returnScript();
        expect(script).toContain("-y");
        expect(script).toContain("image1");
        expect(script).toContain("image2");
        expect(script).toContain("musics/good-vibes-127577.mp3");
        expect(script).toContain("-filter_complex_script");
        expect(script).toContain("filterComplex.txt");
        expect(script).toContain("src/name.mp4");
    });
    it("should log warning when unknown soundtrack", () => {
        edit = JsonGenerator.createJson({
            images: ["image1", "image2"],
            destination: { name: "name", src: "src" },
            config: { soundtrack: "soundtrack1", resolution: OutputResolution.SD, orientation: OrientationType.LANDSCAPE, title: "title" },
        });
        const generator = new ScriptGenerator(edit);
        const script = generator.returnScript();
        expect(logger.log).toHaveBeenCalledTimes(1);
        expect(logger.log).toHaveBeenCalledWith("\x1b[33m", "⚠️", "soundtrack soundtrack1 not found in moods");
    });

    it("should return filter complex script", () => {
        const generator = new ScriptGenerator(edit);
        const script = generator.returnFilterComplexScript();
        expect(script).not.toBeFalsy();
        console.log("SFDSF");
    });

    it("should return duration", () => {
        const generator = new ScriptGenerator(edit);
        const duration = generator.returnDuration();
        console.log("🚀 ~ fidssdsddn:", duration);
        expect(duration).toBeGreaterThanOrEqual(4);
    });
});
