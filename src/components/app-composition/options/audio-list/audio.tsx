export interface AudioProps {
    audioName: string;
}

function Audio(props: AudioProps) {
    const { audioName: name } = props;
    const audioSrc = `/api/audio?audioName=${name}`;
    return { description: <span>{name}</span>, preview: <span className="h-8 overflow-hidden flex flex-shrink-0 flex-grow basis-full"><video src={audioSrc} controls={true} className="h-8" style={{aspectRatio: "100"}} /></span> };
}

export default Audio;
