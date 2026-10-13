import { _decorator, CCInteger, Component, Node, input, Input, EventKeyboard, EventTouch, KeyCode, director, Contact2DType, Collider2D, IPhysics2DContact } from 'cc';
const { ccclass, property, } = _decorator;
import { Ground } from './Ground';
import { Result } from './Result';
import { Bird } from './Bird';
import { PipePool} from './PipePool';
import { BirdAudio } from './BirdAudio';

declare global {
    interface Window {
        gameReady?: () => void;
        gameStart?: () => void;
        gameClose?: () => void;
        gameEnd?: () => void;
        install?: () => void;
        plbx_html?: { google_play_url?: string; appstore_url?: string; download?: () => void };
        super_html?: { google_play_url?: string; appstore_url?: string; download?: () => void };
    }
}

@ccclass('GameControll')
export class GameControll extends Component {
    @property({
        type:Ground,
        tooltip:"Ground is here"
    })
    public ground: Ground;

    @property({
        type: Result,
        tooltip: "Result is here"
    })
    public result: Result;

    @property({
        type: Bird,
        tooltip: "Bird is here"
    })
    public bird: Bird;

    @property({
        type:CCInteger,
        tooltip:"Game Speed is here"
    })
    public gameSpeed: number = 100;
    @property({
        type: CCInteger,
        tooltip: "Pipe Speed is here"
    })
    public pipeSpeed: number = 200;

    public isOver: boolean = false;
    @property({
        type: PipePool,
        tooltip: "Pipe Pool is here"
    })
    public pipePool: PipePool;
    @property({
        type: BirdAudio,
        tooltip: "Bird Audio is here"
    })
    public birdAudio: BirdAudio;

    @property({
        tooltip: "App Store URL"
    })
    public iosStoreUrl: string = '';

    @property({
        tooltip: "Google Play URL"
    })
    public googlePlayUrl: string = '';

    onLoad() {
        this.InitListeners();
        this.contactGroundPipe();
        this.result.resetScore();
        director.pause();
        this.isOver = true;
        if (typeof window !== 'undefined') {
            // Register Inspector URLs with the Playbox bridge, matching the
            // setStoreUrls() flow used by the BasePlayable_Cocos template.
            if (this.googlePlayUrl) {
                if (window.plbx_html) window.plbx_html.google_play_url = this.googlePlayUrl;
                if (window.super_html) window.super_html.google_play_url = this.googlePlayUrl;
            }
            if (this.iosStoreUrl) {
                if (window.plbx_html) window.plbx_html.appstore_url = this.iosStoreUrl;
                if (window.super_html) window.super_html.appstore_url = this.iosStoreUrl;
            }

            // Playturbo invokes this exported callback when the playable starts.
            window.gameStart = () => {
                if (this.isOver) {
                    this.isOver = false;
                    this.startGame();
                }
            };
            // Release gameplay/audio when the playable host closes the ad.
            window.gameClose = () => {
                director.pause();
                this.birdAudio?.audioSource?.stop();
            };
        }
        // Playturbo/Mintegral waits for this signal before ending its loading state.
        if (typeof window !== 'undefined' && window.gameReady) {
            window.gameReady();
        }
    }
    InitListeners() {
    this.node.on(Node.EventType.TOUCH_START, this.onStartInput, this);
    this.result.ResultLabel.node.on(Node.EventType.TOUCH_START, this.onCTAClick, this);

    // KEY_DOWN là sự kiện input toàn cục, không phải sự kiện của Node.
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
}

private onStartInput() {
    this.handleStartInput();
}

private onCTAClick(event: EventTouch) {
    // Cocos Creator 3.8 exposes this flag; EventTouch has no stopPropagation() method.
    event.propagationStopped = true;
    if (this.isOver && typeof window !== 'undefined') {
        // Let the ad network bridge handle its click beacon and store redirect.
        if (window.plbx_html?.download) {
            window.plbx_html.download();
            return;
        }
        if (window.super_html?.download) {
            window.super_html.download();
            return;
        }

        const isIOS = /iPad|iPhone|iPod/i.test(window.navigator?.userAgent ?? '');
        const storeUrl = isIOS ? this.iosStoreUrl : this.googlePlayUrl;

        if (storeUrl) {
            window.open(storeUrl, '_blank');
        } else if (window.install) {
            window.install();
        }
    }
}

private onKeyDown(event: EventKeyboard) {
    if (event.keyCode === KeyCode.SPACE) {
        this.handleStartInput();
    }
}

private handleStartInput() {
    if (this.isOver) {
        this.resetGame();
        this.bird.resetBird();
        this.startGame();
    } else {
        this.bird.fly();
        this.birdAudio.onAudioQueue(4);
    }
}

    // //TESTING PURPOSES
    // onKeyDown(event: EventKeyboard) {
    //     switch (event.keyCode) {
    //         case KeyCode.KEY_A:
    //             this.gameOver();
    //             break;
    //         case KeyCode.KEY_P:
    //             this.result.addScore();
    //             break;
    //         case KeyCode.KEY_Q:
    //             this.resetGame();
    //             this.bird.resetBird();
    //             break;
    //     }

    // }
    startGame(){
        this.result.hideResult();
        director.resume();
    }


    gameOver() {
        if (this.isOver) return;
        this.result.showResult();
        this.result.ResultLabel.string = 'Install Now';
        this.isOver = true;
        if (typeof window !== 'undefined' && window.gameEnd) {
            window.gameEnd();
        }
        this.birdAudio.onAudioQueue(0)
        director.pause();
    }
    resetGame() {
        this.result.resetScore();
        this.result.ResultLabel.string = 'Try Again?';
        this.pipePool.resetPool();
        this.isOver = false
        this.startGame();

    }
    passedPipe() {
        this.result.addScore();
        this.birdAudio.onAudioQueue(2);
        this.createPipe();
    }
    createPipe() {
        this.pipePool.addPool();
    }
    contactGroundPipe() {
        let collider = this.bird.getComponent(Collider2D);

        if(collider){
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }
    onBeginContact(contact: IPhysics2DContact | null, selfCollider: Collider2D, otherCollider: Collider2D) {
     this.bird.hitSomething = true;
     this.birdAudio.onAudioQueue(1);
    }
    birdStruck() {
        if(this.bird.hitSomething == true){
            this.gameOver();
        }
    }
    update(deltaTime: number) {
     if(this.isOver == false){
         this.birdStruck();
     }
    }

}


