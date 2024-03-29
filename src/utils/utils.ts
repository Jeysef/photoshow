import type { AnyRecord } from "ts-essentials/dist/any-record";
import { type Range, type RangeIncl } from "../types/types";

type EnumType = Record<string, string | number>;
type EnumTypeValue<T extends EnumType> = T[keyof T];
type EnumTypeValues<T extends EnumType> = EnumTypeValue<T>[];

export const getRandomEnum = <T extends EnumType>(anEnum: T, except?: EnumTypeValues<T>): EnumTypeValue<T> => {
    let enumValues = getEnumValues(anEnum);
    if (except) enumValues = enumValues.filter((value) => !except.includes(value));
    const randomIndex = getRandomArrayIndex(enumValues);
    return enumValues[randomIndex]!;
};

export const getRandomEnumStartingWith = <T extends EnumType>(anEnum: T, start: EnumType[keyof EnumType]): EnumTypeValue<T> => {
    const enumValues = getEnumValues(anEnum).filter((value) => value.toString().startsWith(start.toString()));
    const randomIndex = getRandomArrayIndex(enumValues);
    return enumValues[randomIndex]!;
};

export function getRandomArrayIndex<T>(array: T[]): number {
    return getRandomNumber(0, array.length);
}

export function getEnumValues<T extends EnumType>(anEnum: T): EnumTypeValues<T> {
    return Object.values(anEnum) as EnumTypeValues<T>;
}

/**
 *
 * @param min (inclusive)
 * @param max (exclusive)
 * @returns {number} random number between min and max (inclusive min, exclusive max)
 */
export function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 *
 * @param min (inclusive)
 * @param max (inclusive)
 * @returns {number} random number between min and max (inclusive min, inclusive max)
 */
export function getRandomNumberIncl(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getRandomFromArray<T>(array: T[]): T {
    return array[getRandomArrayIndex(array)]!;
}

export const getRandomBoolean = () => {
    return Math.random() < 0.5;
};

export function removeEmoticons(string: string): string {
    const emoticonMatcher = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
    return string.replace(emoticonMatcher, "");
}
export function conceal<MIN extends number, MAX extends number>(min: number, max: number, number: number): Range<MIN, MAX> {
    return Math.min(Math.max(min, number), max - 1) as Range<MIN, MAX>;
}
export function concealIncl<MIN extends number, MAX extends number>(min: number, max: number, number: number): RangeIncl<MIN, MAX> {
    return Math.min(Math.max(min, number), max) as Range<MIN, MAX>;
}

export function roundToFloatingPoint(number: number, decimalPlaces = 3) {
    return Math.round(number * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
}

export function roundedSum(decimalPlaces?: number, ...numbers: number[]) {
    return roundToFloatingPoint(
        numbers.reduce((acc, curr) => acc + curr),
        decimalPlaces,
    );
}
export function roundedSub(decimalPlaces?: number, ...numbers: number[]) {
    return roundToFloatingPoint(
        numbers.reduce((acc, curr) => acc - curr),
        decimalPlaces,
    );
}
export function roundedMul(decimalPlaces?: number, ...numbers: number[]) {
    return roundToFloatingPoint(
        numbers.reduce((acc, curr) => acc * curr),
        decimalPlaces,
    );
}
export function roundedDiv(decimalPlaces?: number, ...numbers: number[]) {
    return roundToFloatingPoint(
        numbers.reduce((acc, curr) => acc / curr),
        decimalPlaces,
    );
}
export function omit<Type extends AnyRecord, Keys extends keyof Type>(obj: Type, key: Keys): Omit<Type, Keys> {
    const { [key]: _, ...rest } = obj;
    return rest;
}
