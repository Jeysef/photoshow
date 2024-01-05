import { AssetType, type TextPosition } from "../../../schemas/enums";
import { type IHtmlAsset } from "../../../schemas/interfaces";
import { Asset } from "./Asset";

export class HtmlAsset extends Asset implements IHtmlAsset {
    private _type: AssetType.HTML = AssetType.HTML;
    public get type(): AssetType.HTML {
        return this._type;
    }
    public setType(value: AssetType.HTML) {
        this._type = value;
    }
    private _html: string;
    public get html(): string {
        return this._html;
    }
    public setHtml(value: string) {
        this._html = value;
    }
    private _css?: string | undefined;
    public get css(): string | undefined {
        return this._css;
    }
    public setCss(value: string | undefined) {
        this._css = value;
    }
    private _width?: number | undefined; // bounding box in pixels
    public get width(): number | undefined {
        return this._width;
    }
    public setWidth(value: number | undefined) {
        this._width = value;
    }
    private _height?: number | undefined; // bounding box in pixels
    public get height(): number | undefined {
        return this._height;
    }
    public setHeight(value: number | undefined) {
        this._height = value;
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

    constructor(html = "") {
        super({type: AssetType.HTML, html});
        this._html = html;
    }
}
