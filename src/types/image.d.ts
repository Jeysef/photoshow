declare module "*.svg" {
    const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
    export default SVG;
}

declare module "*.svg?url" {
    import { type StaticImageData } from "next/image";

    const content: StaticImageData;
    export default content;
}
