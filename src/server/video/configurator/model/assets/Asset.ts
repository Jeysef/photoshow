import { type AssetType, type TextPosition, type TitleSize, type TitleStyle, type VolumeEffect } from "../../../types/enums";
import { type IAsset, type ICrop, type IOffset } from "../../../types/interfaces";

export class Asset {
    asset: IAsset;

    constructor(asset: IAsset) {
        this.asset = asset;
    }

    get type(): AssetType {
        return this.asset.type;
    }

    get src(): string | undefined {
        if ("src" in this.asset) {
            return this.asset.src;
        }
        return undefined;
    }

    get trim(): number | undefined {
        if ("trim" in this.asset) {
            return this.asset.trim;
        }
        return undefined;
    }

    get volume(): number | undefined {
        if ("volume" in this.asset) {
            return this.asset.volume;
        }
        return undefined;
    }

    get volumeEffect(): VolumeEffect | undefined {
        if ("volumeEffect" in this.asset) {
            return this.asset.volumeEffect;
        }
        return undefined;
    }

    get crop(): ICrop | undefined {
        if ("crop" in this.asset) {
            return this.asset.crop;
        }
        return undefined;
    }

    get text(): string | undefined {
        if ("text" in this.asset) {
            return this.asset.text;
        }
        return undefined;
    }

    get style(): TitleStyle | undefined {
        if ("style" in this.asset) {
            return this.asset.style;
        }
        return undefined;
    }

    get color(): string | undefined {
        if ("color" in this.asset) {
            return this.asset.color;
        }
        return undefined;
    }

    get size(): TitleSize | undefined {
        if ("size" in this.asset) {
            return this.asset.size;
        }
        return undefined;
    }

    get background(): string | undefined {
        if ("background" in this.asset) {
            return this.asset.background;
        }
        return undefined;
    }

    get position(): TextPosition | undefined {
        if ("position" in this.asset) {
            return this.asset.position;
        }
        return undefined;
    }

    get offset(): IOffset | undefined {
        if ("offset" in this.asset) {
            return this.asset.offset;
        }
        return undefined;
    }

    get html(): string | undefined {
        if ("html" in this.asset) {
            return this.asset.html;
        }
        return undefined;
    }

    get css(): string | undefined {
        if ("css" in this.asset) {
            return this.asset.css;
        }
        return undefined;
    }

    get width(): number | undefined {
        if ("width" in this.asset) {
            return this.asset.width;
        }
        return undefined;
    }

    get height(): number | undefined {
        if ("height" in this.asset) {
            return this.asset.height;
        }
        return undefined;
    }

    get effect(): VolumeEffect | undefined {
        if ("effect" in this.asset) {
            return this.asset.effect;
        }
        return undefined;
    }
}
