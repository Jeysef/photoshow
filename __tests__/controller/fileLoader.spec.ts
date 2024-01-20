import { createVideoFolder, deleteImagesFromFolder, deleteVideoFolder, folderExists, getImagesFromFolder, writeImages } from "@/core/controller/fileLoader";
import { getDestinationPath } from "@/core/helpers";
import path from "path";

jest.mock("@/core/helpers", () => {
    const originalModule = jest.requireActual<typeof import("@/core/helpers")>("@/core/helpers");
    return {
        __esModule: true,
        ...originalModule,
        getDestinationPath: jest.fn((videoId: string) => {
            console.log("videoId", videoId);
            return path.resolve(process.cwd(), "__tests__", videoId);
        }),
    } as typeof originalModule;
});

describe("fileLoader", () => {
    it("should create a folder", () => {
        const folder = "testFolder";
        createVideoFolder(folder);
        expect(folderExists(getDestinationPath(folder))).toBe(true);
    });
    it("should delete a folder", () => {
        const folder = "testFolder";
        createVideoFolder(folder);
        expect(folderExists(getDestinationPath(folder))).toBe(true);
        deleteVideoFolder(folder);
        expect(folderExists(getDestinationPath(folder))).toBe(false);
    });
    it("should save images to a folder", async () => {
        const folder = "testFolder";
        createVideoFolder(folder);
        expect(folderExists(getDestinationPath(folder))).toBe(true);
        const images: File[] = [new File(["foo"], "foo.jpg", { type: "image/jpg" }), new File(["bar"], "bar.jpg", { type: "image/jpg" })];
        await writeImages(images, getDestinationPath(folder));
        const readImages = getImagesFromFolder(getDestinationPath(folder));
        expect(readImages.length).toBe(2);
        deleteImagesFromFolder(getDestinationPath(folder));
        const readImages2 = getImagesFromFolder(getDestinationPath(folder));
        expect(readImages2.length).toBe(0);
        expect(folderExists(getDestinationPath(folder))).toBe(true);
        deleteVideoFolder(folder);
        expect(folderExists(getDestinationPath(folder))).toBe(false);
    });
    it("should return names of images in a folder", () => {
        const readImages = getImagesFromFolder(getDestinationPath("testImages"));
        console.log("🚀 ~ file: fileLoader.spec.ts:48 ~ it ~ readImages:", readImages);
        expect(readImages.length).toBe(2);
        expect(readImages[0]).toBe("testImage1.jpg");
        expect(readImages[1]).toBe("testImage2.jpg");
    });
});
