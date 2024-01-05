import { type VolumeEffect } from "../../schemas/enums";

/**
 * The Soundtrack model module.
 * @module model/Soundtrack
 * @version v1
 */
class Soundtrack {
    src?: string;
    effect?: VolumeEffect;
    /**
     * Constructs a new <code>Soundtrack</code>.
     * A music or audio file in mp3 format that plays for the duration of the rendered video or the length of the audio file, which ever is shortest.
     * @alias module:model/Soundtrack
     * @class
     * @param src {String} The URL of the mp3 audio file. The URL must be publicly accessible or include credentials.
     */
    constructor(src?: string) {
        this.src = src;
    }

    /**
     * Sets The URL of the mp3 audio file. The URL must be publicly accessible or include credentials.
     * @param {String} src The URL of the mp3 audio file. The URL must be publicly accessible or include credentials.
     */
    public setSrc = (src: string) => {
        this.src = src;
        return this;
    };

    /**
     * Sets The effect to apply to the audio file <ul>   <li>`fadeIn` - fade volume in only</li>   <li>`fadeOut` - fade volume out only</li>   <li>`fadeInFadeOut` - fade volume in and out</li> </ul>
     * @param {module:model/Soundtrack.EffectEnum} effect The effect to apply to the audio file <ul>   <li>`fadeIn` - fade volume in only</li>   <li>`fadeOut` - fade volume out only</li>   <li>`fadeInFadeOut` - fade volume in and out</li> </ul>
     */
    public setEffect = (effect: VolumeEffect) => {
        this.effect = effect;
        return this;
    }
}

export default Soundtrack;