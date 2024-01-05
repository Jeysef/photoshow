import { AssetType, type TextPosition, type TitleSize, type TitleStyle } from "../../../schemas/enums";
import { type IOffset, type ITitleAsset } from "../../../schemas/interfaces";
import { Asset } from "./Asset";

export class TitleAsset extends Asset implements ITitleAsset {
    private _type: AssetType.TITLE = AssetType.TITLE;
    public get type(): AssetType.TITLE {
        return this._type;
    }
    public setType(value: AssetType.TITLE) {
        this._type = value;
    }
    private _text: string;
    public get text(): string {
        return this._text;
    }
    public setText(value: string) {
        this._text = value;
    }
    private _style?: TitleStyle | undefined;
    public get style(): TitleStyle | undefined {
        return this._style;
    }
    public setStyle(value: TitleStyle | undefined) {
        this._style = value;
    }
    private _color?: string | undefined; // hex color, default: #ffffff, transparent: #80ffffff (50% transparent)
    public get color(): string | undefined {
        return this._color;
    }
    public setColor(value: string | undefined) {
        this._color = value;
    }
    private _size?: TitleSize | undefined;
    public get size(): TitleSize | undefined {
        return this._size;
    }
    public setSize(value: TitleSize | undefined) {
        this._size = value;
    }
    private _background?: string | undefined; // hex color, default: #000000, transparent: #80000000 (50% transparent)
    public get background(): string | undefined {
        return this._background;
    }
    public setBackground(value: string | undefined) {
        this._background = value;
    }
    private _position?: TextPosition | undefined;
    public get position(): TextPosition | undefined {
        return this._position;
    }
    public setPosition(value: TextPosition | undefined) {
        this._position = value;
    }
    private _offset?: IOffset | undefined;
    public get offset(): IOffset | undefined {
        return this._offset;
    }
    public setOffset(value: IOffset | undefined) {
        this._offset = value;
    }

    constructor(text = "") {
        super({ type: AssetType.TITLE, text });
        this._text = text;
        this._type = AssetType.TITLE;
    }
}
