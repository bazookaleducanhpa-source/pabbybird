import { _decorator, CCInteger, Component, Node, input, Input, EventKeyboard, KeyCode, director } from 'cc';
const { ccclass, property, } = _decorator;
import { Ground } from './Ground';
import { Result } from './Result';
import { Bird } from './Bird';
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

    onLoad() {
        this.InitListeners();
        this.result.resetScore();
        director.pause();
    }
    
    InitListeners() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this.node.on(Node.EventType.TOUCH_START,()=>{
            this.bird.fly();
        },this);
    }
    //TESTING PURPOSES
    onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_A:
                this.gameOver();
                break;
            case KeyCode.KEY_P:
                this.result.addScore();
                break;
            case KeyCode.KEY_Q:
                this.resetGame();
                this.bird.resetBird();
                break;
        }

    }
    startGame(){
        this.result.hideResult();
        director.resume();
    }


    gameOver() {
        this.result.showResult();
        director.pause();
    }
    resetGame() {
        this.result.resetScore();
        this.startGame();
    }
}


