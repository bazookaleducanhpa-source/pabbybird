import { _decorator, CCInteger, Component, Node, input, Input, EventKeyboard, KeyCode, director, Contact2DType, Collider2D, IPhysics2DContact } from 'cc';
const { ccclass, property, } = _decorator;
import { Ground } from './Ground';
import { Result } from './Result';
import { Bird } from './Bird';
import { PipePool} from './PipePool';
import { BirdAudio } from './BirdAudio';
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
    onLoad() {
        this.InitListeners();
        this.result.resetScore();
        director.pause();
        this.isOver = true;
    }
    InitListeners() {
        // input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this.node.on(Node.EventType.TOUCH_START,()=>{
            if(this.isOver == true){
                this.resetGame();
                this.bird.resetBird();
                this.startGame();
            }
            if(this.isOver == false){
                this.bird.fly();
                this.birdAudio.onAudioQueue(4);
            }
        },this);
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
        this.result.showResult();
        this.isOver = true;
        this.birdAudio.onAudioQueue(0)
        director.pause();
    }
    resetGame() {
        this.result.resetScore();
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
        this.contactGroundPipe();
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


