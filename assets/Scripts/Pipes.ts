import { _decorator, Component, Node, Vec3, screen, find, UITransform } from 'cc';
const { ccclass, property } = _decorator;
const random = (min,max) =>{
    return Math.random() * (max - min) + min;
}
@ccclass('Pipes')
export class Pipes extends Component {
    @property({
        type: Node,
        tooltip: "Top pipe is here"
    })
    public topPipe: Node;

    @property({
        type: Node,
        tooltip: "Bottom pipe is here"
    })
    public bottomPipe: Node;

    public tempStartingUpPosition: Vec3 = new Vec3(0, 0, 0);
    public tempStartingDownPosition: Vec3 = new Vec3(0, 0, 0);
    public scene = screen.windowSize;

    public game;
    public pipeSpeed: number;
    public createPipeSpeed: number; //variable to store the pipe speed when the game is running
    public tempPipeSpeed: number; //temporary variable to store the pipe speed when the game is paused
 public isPassed: boolean; //variable to check if the pipe has passed the bird
    onLoad() {
        this.game = find("GameCtrl").getComponent("GameControll");
        this.pipeSpeed = this.game.pipeSpeed;
        this.initPosition();
        this.isPassed = false;
    }
    initPosition() {
        this.tempStartingUpPosition.x =  (this.topPipe.getComponent(UITransform).width + this.scene.width);
        this.tempStartingDownPosition.x =  (this.bottomPipe.getComponent(UITransform).width + this.scene.width);
        let gap = random(90, 100);
        let topheight = random(0, 450);
        this.tempStartingUpPosition.y = topheight;
        this.tempStartingDownPosition.y = topheight - (gap*10);
        this.topPipe.setPosition(this.tempStartingUpPosition);
        this.bottomPipe.setPosition(this.tempStartingDownPosition);
    }
    update(deltaTime: number) {
        this.tempPipeSpeed = this.pipeSpeed * deltaTime;
        this.tempStartingDownPosition = this.bottomPipe.position;
        this.tempStartingUpPosition = this.topPipe.position;

        this.tempStartingDownPosition.x -= this.tempPipeSpeed;
        this.tempStartingUpPosition.x -= this.tempPipeSpeed;
        this.topPipe.setPosition(this.tempStartingUpPosition);
        this.bottomPipe.setPosition(this.tempStartingDownPosition);
        if(this.isPassed == false && this.topPipe.position.x <= 0){
            this.isPassed = true;
            this.game.passedPipe();
    }
    if (this.topPipe.position.x < (0-this.scene.width)) {
        this.destroy();
    }
}
}

