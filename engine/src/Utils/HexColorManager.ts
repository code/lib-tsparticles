import type { IColor, IRangeColor, IRgb, IRgba } from "../Core/Interfaces/Colors.js";
import type { IColorManager } from "../Core/Interfaces/IColorManager.js";

enum RgbIndexes {
    r = 1,
    g = 2,
    b = 3,
    a = 4,
}

/**
 */
export class HexColorManager implements IColorManager {
    readonly key;
    readonly stringPrefix;

    constructor() {
        this.key = "hex";
        this.stringPrefix = "#";
    }

    handleColor(color: IColor): IRgb | undefined {
        const hexColor = color.value;

        if (typeof hexColor !== "string") {
            return;
        }

        return this.parseString(hexColor);
    }

    handleRangeColor(color: IRangeColor): IRgb | undefined {
        const hexColor = color.value;

        if (typeof hexColor !== "string") {
            return;
        }

        return this.parseString(hexColor);
    }

    parseString(input: string): IRgba | undefined {
        if (!input?.startsWith(this.stringPrefix)) {
            return;
        }

        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i,
            hexFixed = input.replace(shorthandRegex, (_, r: string, g: string, b: string, a: string) => {
                return r + r + g + g + b + b + (a !== undefined ? a + a : "");
            }),
            regex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i,
            result = regex.exec(hexFixed),
            radix = 16,
            defaultAlpha = 1,
            alphaFactor = 0xff;

        return result
            ? {
                  a:
                      result[RgbIndexes.a] !== undefined
                          ? parseInt(result[RgbIndexes.a], radix) / alphaFactor
                          : defaultAlpha,
                  b: parseInt(result[RgbIndexes.b], radix),
                  g: parseInt(result[RgbIndexes.g], radix),
                  r: parseInt(result[RgbIndexes.r], radix),
              }
            : undefined;
    }
}
