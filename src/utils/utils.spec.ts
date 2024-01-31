import { describe, expect, it } from "@jest/globals";
import {
    conceal,
    concealIncl,
    getRandomBoolean,
    getRandomEnum,
    getRandomFromArray,
    getRandomNumber,
    removeEmoticons,
    roundToFloatingPoint,
    roundedDiv,
    roundedMul,
    roundedSub,
    roundedSum,
} from "./utils";

describe("getRandomEnum", () => {
    enum TestEnum {
        A = "a",
        B = "b",
        C = "c",
    }

    it("should return a random enum value", () => {
        const value = getRandomEnum(TestEnum);
        expect(Object.values(TestEnum)).toContain(value);
    });

    it("should exclude specified values", () => {
        const value = getRandomEnum(TestEnum, [TestEnum.A]);
        expect(value).not.toBe(TestEnum.A);
    });
});

describe("getRandomNumber", () => {
    it("should return a random number between min and max", () => {
        const min = 1;
        const max = 10;
        const value = getRandomNumber(min, max);
        expect(value).toBeGreaterThanOrEqual(min);
        expect(value).toBeLessThanOrEqual(max);
    });
});

describe("getRandomFromArray", () => {
    it("should return a random element from the array", () => {
        const array = [1, 2, 3];
        const value = getRandomFromArray(array);
        expect(array).toContain(value);
    });
});

describe("getRandomBoolean", () => {
    it("should return a random boolean value", () => {
        const value = getRandomBoolean();
        expect(typeof value).toBe("boolean");
    });
});
describe("removeEmoticons", () => {
    it("should remove emoticons from the string", () => {
        const string = "Hello 😊 World 🌎";
        const result = removeEmoticons(string);
        expect(result).toBe("Hello  World ");
    });
});

describe("conceal", () => {
    it("should return the number if it is within the range", () => {
        const min = 0;
        const max = 10;
        const number = 5;
        const result = conceal(min, max, number);
        expect(result).toBe(number);
    });

    it("should return the minimum value if the number is less than the minimum", () => {
        const min = 0;
        const max = 10;
        const number = -5;
        const result = conceal(min, max, number);
        expect(result).toBe(min);
    });

    it("should return the maximum value minus one if the number is greater than or equal to the maximum", () => {
        const min = 0;
        const max = 10;
        const number = 15;
        const result = conceal(min, max, number);
        expect(result).toBe(max - 1);
    });
});

describe("concealIncl", () => {
    it("should return the number if it is within the range", () => {
        const min = 0;
        const max = 10;
        const number = 5;
        const result = concealIncl(min, max, number);
        expect(result).toBe(number);
    });

    it("should return the minimum value if the number is less than the minimum", () => {
        const min = 0;
        const max = 10;
        const number = -5;
        const result = concealIncl(min, max, number);
        expect(result).toBe(min);
    });

    it("should return the maximum value if the number is greater than or equal to the maximum", () => {
        const min = 0;
        const max = 10;
        const number = 15;
        const result = concealIncl(min, max, number);
        expect(result).toBe(max);
    });
});

describe("roundToFloatingPoint", () => {
    it("should round the number to the specified number of decimal places", () => {
        const number = 1.23456789;
        const decimalPlaces = 3;
        const result = roundToFloatingPoint(number, decimalPlaces);
        expect(result).toBe(1.235);
    });
});

describe("roundedSum", () => {
    it("should return the sum of the numbers rounded to the specified number of decimal places", () => {
        const decimalPlaces = 3;
        const numbers = [1.234, 2.345, 3.456];
        const result = roundedSum(decimalPlaces, ...numbers);
        expect(result).toBe(7.035);
    });
});

describe("roundedSub", () => {
    it("should return the difference of the numbers rounded to the specified number of decimal places", () => {
        const decimalPlaces = 3;
        const numbers = [3.456, 2.345, 1.234];
        const result = roundedSub(decimalPlaces, ...numbers);
        expect(result).toBe(-0.123);
    });
});

describe("roundedMul", () => {
    it("should return the product of the numbers rounded to the specified number of decimal places", () => {
        const decimalPlaces = 3;
        const numbers = [1.234, 2.345, 3.456];
        const result = roundedMul(decimalPlaces, ...numbers);
        expect(result).toBe(10.001);
    });
});

describe("roundedDiv", () => {
    it("should return the quotient of the numbers rounded to the specified number of decimal places", () => {
        const decimalPlaces = 3;
        const numbers = [3.456, 2.345, 1.234];
        const result = roundedDiv(decimalPlaces, ...numbers);
        expect(result).toBe(1.194);
    });
});
