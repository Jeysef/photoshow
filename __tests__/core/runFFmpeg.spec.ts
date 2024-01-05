import Logger from "@/src/core/controller/logger";
import { IShow, createShow } from "@/src/core/controller/runFFmpeg";
import { IJsonGeneratorProps } from "@/src/core/jsonGenerator/JsonGenerator";
import { OutputResolution } from "@/src/core/schemas/enums";
import ScriptGenerator from "@/src/core/scriptGenerator/Timeline";
import { OrientationType } from "@/src/types/types";
import fs from 'fs';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  writeFileSync: jest.fn(),
}));

jest.mock("../../src/core/controller/logger", () => ({
  log: jest.fn(),
}));

jest.mock('../../src/core/scriptGenerator/Timeline', () => {
  return jest.fn().mockImplementation(() => ({
    returnFilterComplexScript: jest.fn().mockReturnValue('filter'),
    returnScript: jest.fn().mockReturnValue(['code']),
    returnDuration: jest.fn().mockReturnValue(100),
    filterComplexFileName: 'filterComplexFileName',
  }));
});


describe('createShow', () => {
  it('should create a show', () => {
    const props: IJsonGeneratorProps = {
      config: {
        orientation: OrientationType.LANDSCAPE,
        resolution: OutputResolution.SD,
      },
      images: [],
      destination: {
        src: 'src',
        name: 'name',
      },
    };
    const show: IShow = createShow(props);

    expect(show).toHaveProperty('progress');
    expect(show).toHaveProperty('duration');
    expect(show.duration).toBe(100);

    expect(fs.writeFileSync).toHaveBeenCalledTimes(2);
    expect(Logger.log).toHaveBeenCalledTimes(2);
    expect(ScriptGenerator).toHaveBeenCalledTimes(1);
  });
});