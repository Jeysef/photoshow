export interface IClipModule {
    getScript: () => string;
}

export interface IClipInterface extends IClipModule {
    effectScript: string;
    filterScript: string;
    fitScript: string;
    fpsScript: string;
    formatScript: string;
    startScript: string;
    customScript: string;
}
