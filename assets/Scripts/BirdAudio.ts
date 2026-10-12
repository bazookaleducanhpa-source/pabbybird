import { _decorator, Component, Node,AudioClip,AudioSource } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BirdAudio')
export class BirdAudio extends Component {
    @property({
        type: [AudioClip],
        tooltip: "Jump sound is here"
    })
    public clips: AudioClip[] =[];

    @property({
        type: AudioSource,
        tooltip: "Audio source is here"
    })
    public audioSource: AudioSource = null!;

    onAudioQueue(index:number){
        let clips: AudioClip = this.clips[index];
        this.audioSource.playOneShot(clips);
    }

}


