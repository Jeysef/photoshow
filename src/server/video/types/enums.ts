export enum AssetType {
    VIDEO = "video",
    IMAGE = "image",
    TITLE = "title",
    HTML = "html",
    AUDIO = "audio",
    LUMA = "luma",
}
export enum FilterType {
    // BOOST = "boost",
    // CONTRAST = "contrast",
    // DARKEN = "darken",
    // GRAYSCALE = "grayscale",
    // LIGHTEN = "lighten",
    // MUTED = "muted",
    // NEGATIVE = "negative",
    BLUR = "BLUR",
    GRAYSCALE = "GRAYSCALE",
    BLURGRAYSCALE = "BLURGRAYSCALE",
}
export enum FitType {
    CROP = "crop",
    COVER = "cover",
    CONTAIN = "contain",
    NONE = "none",
}
export enum MotionEffect {
    ZOOM_IN_TOP_LEFT = "ZOOM_IN_TOP_LEFT",
    ZOOM_IN_TOP_RIGHT = "ZOOM_IN_TOP_RIGHT",
    ZOOM_IN_BOTTOM_LEFT = "ZOOM_IN_BOTTOM_LEFT",
    ZOOM_IN_BOTTOM_RIGHT = "ZOOM_IN_BOTTOM_RIGHT",
    ZOOM_IN_CENTER = "ZOOM_IN_CENTER",
    ZOOM_OUT_TOP_LEFT = "ZOOM_OUT_TOP_LEFT",
    ZOOM_OUT_TOP_RIGHT = "ZOOM_OUT_TOP_RIGHT",
    ZOOM_OUT_BOTTOM_LEFT = "ZOOM_OUT_BOTTOM_LEFT",
    ZOOM_OUT_BOTTOM_RIGHT = "ZOOM_OUT_BOTTOM_RIGHT",
    ZOOM_OUT_CENTER = "ZOOM_OUT_CENTER",
    // SLIDE_LEFT = "SLIDE_LEFT",
    // SLIDE_RIGHT = "SLIDE_RIGHT",
    // SLIDE_UP = "SLIDE_UP",
    // SLIDE_DOWN = "SLIDE_DOWN",
}

export enum EffectEffect {
    BLUR = "BLUR",
    GRAYSCALE = "GRAYSCALE",
}
export enum ConnectEffect {
    SPLIT = "SPLIT",
    CONNECT = "CONECT",
}
export type EffectType = MotionEffect | EffectEffect | ConnectEffect;

export enum OutputAspectRatio {
    RATIO_16_9 = "16:9",
    RATIO_9_16 = "9:16",
    RATIO_1_1 = "1:1",
    RATIO_4_5 = "4:5",
    RATIO_4_3 = "4:3",
}
export enum OutputFormat {
    MP4 = "mp4",
    GIF = "gif",
    JPG = "jpg",
    PNG = "png",
    BMP = "bmp",
    MP3 = "mp3",
}
export enum OutputFPS {
    FPS_12 = 12,
    FPS_15 = 15,
    FPS_24 = 24,
    FPS_23_976 = 23.976,
    FPS_25 = 25,
    FPS_29_97 = 29.97,
    FPS_30 = 30,
    FPS_60 = 60,
}
export enum OutputQuality {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
}
export enum OutputResolution {
    /** 512x288 */
    PREVIEW = "preview",
    /** 640x360 */
    MOBILE = "mobile",
    /** 1024x576 */
    SD = "sd",
    /** 1280x720 */
    HD = "hd",
    /** 1920x1080 */
    FULL_HD = "1080",
    /**4K */
    R4K = "4K",
}
export enum TextPosition {
    TOP = "top",
    TOP_RIGHT = "top-right",
    RIGHT = "right",
    BOTTOM_RIGHT = "bottom-right",
    BOTTOM = "bottom",
    BOTTOM_LEFT = "bottom-left",
    LEFT = "left",
    TOP_LEFT = "top-left",
    CENTER = "center",
}
export enum TitleSize {
    XX_SMALL = "xx-small",
    X_SMALL = "x-small",
    SMALL = "small",
    MEDIUM = "medium",
    LARGE = "large",
    X_LARGE = "x-large",
    XX_LARGE = "xx-large",
}
export enum TitleStyle {
    MINIMAL = "minimal",
    BLOCKBUSSER = "blockbuster",
    VOUGUE = "vogue",
    SKETCHY = "sketchy",
    CHUNK = "chunk",
    CHUNK_LIGHT = "chunkLight",
    MARKER = "marker",
    FUTURE = "future",
    SUBTITLE = "subtitle",
}
export enum TransitionType {
    FADE = "fade",
    REVEAL = "reveal",
    WIPE_LEFT = "wipeLeft",
    WIPE_RIGHT = "wipeRight",
    SLIDE_LEFT = "slideLeft",
    SLIDE_RIGHT = "slideRight",
    SLIDE_UP = "slideUp",
    SLIDE_DOWN = "slideDown",
    CAROUSEL_LEFT = "carouselLeft",
    CAROUSEL_RIGHT = "carouselRight",
    CAROUSEL_UP = "carouselUp",
    CAROUSEL_DOWN = "carouselDown",
    SHUFFLE_RIGHT_TOP = "shuffleRightTop",
    SHUFFLE_RIGHT_BOTTOM = "shuffleRightBottom",
    SHUFFLE_BOTTOM_RIGHT = "shuffleBottomRight",
    SHUFFLE_BOTTOM_LEFT = "shuffleBottomLeft",
    SHUFFLE_LEFT_BOTTOM = "shuffleLeftBottom",
    SHUFFLE_LEFT_TOP = "shuffleLeftTop",
    SHUFFLE_TOP_LEFT = "shuffleTopLeft",
    ZOOM = "zoom",
}

export enum EffectFilterType {
    BLUR = "BLUR",
    GRAYSCALE = "GRAYSCALE",
    BLURGRAYSCALE = "BLURGRAYSCALE",
}

export enum XFadeTransition {
    FADE = "fade",
    FADE_BLACK = "fadeblack",
    FADE_WHITE = "fadewhite",
    DISTANCE = "distance",
    WIPE_LEFT = "wipeleft",
    WIPE_RIGHT = "wiperight",
    WIPE_UP = "wipeup",
    WIPE_DOWN = "wipedown",
    SLIDE_LEFT = "slideleft",
    SLIDE_RIGHT = "slideright",
    SLIDE_UP = "slideup",
    SLIDE_DOWN = "slidedown",
    SMOOTH_LEFT = "smoothleft",
    SMOOTH_RIGHT = "smoothright",
    SMOOTH_UP = "smoothup",
    SMOOTH_DOWN = "smoothdown",
    RECT_CROP = "rectcrop",
    CIRCLE_CROP = "circlecrop",
    CIRCLE_CLOSE = "circleclose",
    CIRCLE_OPEN = "circleopen",
    HORZ_CLOSE = "horzclose",
    HORZ_OPEN = "horzopen",
    VERT_CLOSE = "vertclose",
    VERT_OPEN = "vertopen",
    DIAG_BL = "diagbl",
    DIAG_BR = "diagbr",
    DIAG_TL = "diagtl",
    DIAG_TR = "diagtr",
    HL_SLICE = "hlslice",
    HR_SLICE = "hrslice",
    VU_SLICE = "vuslice",
    VD_SLICE = "vdslice",
    DISSOLVE = "dissolve",
    PIXELIZE = "pixelize",
    RADIAL = "radial",
    H_BLUR = "hblur",
    WIPE_TL = "wipetl",
    WIPE_TR = "wipetr",
    WIPE_BL = "wipebl",
    WIPE_BR = "wipebr",
    FADEGRAYS = "fadegrays",
    SQUEEZE_V = "squeezev",
    SQUEEZE_H = "squeezeh",
    ZOOM_IN = "zoomin",
}

export const smoothTransitions = [
    XFadeTransition.FADE,
    XFadeTransition.FADE_BLACK,
    XFadeTransition.FADE_WHITE,
    XFadeTransition.WIPE_LEFT,
    XFadeTransition.WIPE_RIGHT,
    XFadeTransition.WIPE_UP,
    XFadeTransition.WIPE_DOWN,
    XFadeTransition.SMOOTH_DOWN,
    XFadeTransition.SMOOTH_LEFT,
    XFadeTransition.SMOOTH_UP,
    XFadeTransition.SMOOTH_DOWN,
    XFadeTransition.HORZ_OPEN,
    XFadeTransition.HORZ_CLOSE,
    XFadeTransition.VERT_CLOSE,
    XFadeTransition.VERT_OPEN,
    XFadeTransition.DIAG_BL,
    XFadeTransition.DIAG_BR,
    XFadeTransition.DIAG_TL,
    XFadeTransition.DIAG_TR,
    XFadeTransition.DISSOLVE,
    // XFadeTransition.PIXELIZE,
    XFadeTransition.H_BLUR,
    XFadeTransition.ZOOM_IN,
];

export enum TransitionTypeFast {
    FADE = "fadeFast",
    REVEAL = "revealFast",
    WIPE_LEFT = "wipeLeftFast",
    WIPE_RIGHT = "wipeRightFast",
    SLIDE_LEFT = "slideLeftFast",
    SLIDE_RIGHT = "slideRightFast",
    SLIDE_UP = "slideUpFast",
    SLIDE_DOWN = "slideDownFast",
    CAROUSEL_LEFT = "carouselLeftFast",
    CAROUSEL_RIGHT = "carouselRightFast",
    CAROUSEL_UP = "carouselUpFast",
    CAROUSEL_DOWN = "carouselDownFast",
    SHUFFLE_RIGHT_TOP = "shuffleRightTopFast",
    SHUFFLE_RIGHT_BOTTOM = "shuffleRightBottomFast",
    SHUFFLE_BOTTOM_RIGHT = "shuffleBottomRightFast",
    SHUFFLE_BOTTOM_LEFT = "shuffleBottomLeftFast",
    SHUFFLE_LEFT_BOTTOM = "shuffleLeftBottomFast",
    SHUFFLE_LEFT_TOP = "shuffleLeftTopFast",
    SHUFFLE_TOP_LEFT = "shuffleTopLeftFast",
    ZOOM = "zoomFast",
}
export enum TransitionTypeSlow {
    FADE = "fadeSlow",
    REVEAL = "revealSlow",
    WIPE_LEFT = "wipeLeftSlow",
    WIPE_RIGHT = "wipeRightSlow",
    SLIDE_LEFT = "slideLeftSlow",
    SLIDE_RIGHT = "slideRightSlow",
    SLIDE_UP = "slideUpSlow",
    SLIDE_DOWN = "slideDownSlow",
    CAROUSEL_LEFT = "carouselLeftSlow",
    CAROUSEL_RIGHT = "carouselRightSlow",
    CAROUSEL_UP = "carouselUpSlow",
    CAROUSEL_DOWN = "carouselDownSlow",
    SHUFFLE_RIGHT_TOP = "shuffleRightTopSlow",
    SHUFFLE_RIGHT_BOTTOM = "shuffleRightBottomSlow",
    SHUFFLE_BOTTOM_RIGHT = "shuffleBottomRightSlow",
    SHUFFLE_BOTTOM_LEFT = "shuffleBottomLeftSlow",
    SHUFFLE_LEFT_BOTTOM = "shuffleLeftBottomSlow",
    SHUFFLE_LEFT_TOP = "shuffleLeftTopSlow",
    SHUFFLE_TOP_LEFT = "shuffleTopLeftSlow",
    ZOOM = "zoomSlow",
}
export enum VolumeEffect {
    FADE_IN = "fadeIn",
    FADE_OUT = "fadeOut",
    FADE_IN_OUT = "fadeInFadeOut",
}