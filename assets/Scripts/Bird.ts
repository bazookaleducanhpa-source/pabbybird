import { _decorator, CCFloat, Component, Vec3, Vec2, Animation, tween, Tween, RigidBody2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bird')
export class Bird extends Component {
    @property({
        type: CCFloat,
        tooltip: "Jump height is here"
    })
    public jumpHeight: number = 3.5;

        @property({
        type: CCFloat,
        tooltip: "Jump duration is here"
    })
    public jumpDuration: number = 3.5;
    public hitSomething: boolean = false;
    public birdAnimation: Animation;
    public birdLocation: Vec3;
    public birdRotation: Vec3;
    private startPosition: Vec3;
    private previousY = 0;
    private jumpTween: Tween<Vec3> | null = null;
    onLoad() {
        this.birdAnimation = this.getComponent(Animation);
        // Keep the scene-authored spawn position; (0, 0, 0) may be far above the play area.
        this.startPosition = this.node.position.clone();
        this.resetBird();
    }

    resetBird() {
        this.jumpTween?.stop();
        this.jumpTween = null;
        this.birdAnimation?.stop();

        // Reset the physics body too: it can write its angle back onto the node.
        const body = this.getComponent(RigidBody2D);
        if (body) {
            body.angularVelocity = 0;
            body.linearVelocity = new Vec2(0, 0);
        }

        this.node.setRotationFromEuler(0, 0, 0);
        this.node.setPosition(this.startPosition);
        this.previousY = this.startPosition.y;
        this.hitSomething = false;
    }
    fly(){
        this.jumpTween?.stop();
        this.birdAnimation.stop();
        this.node.setRotationFromEuler(0, 0, 30);
        this.jumpTween = tween(this.node.position)
        .to(this.jumpDuration, new Vec3(this.node.position.x, this.node.position.y + this.jumpHeight,0),{ easing: "smooth", onUpdate: (target: Vec3, ratio: number) => {
            this.node.position = target;
    }})
        .start();

        this.birdAnimation.play();
    }

    update() {
        if (this.hitSomething) return;

        const currentY = this.node.position.y;
        const deltaY = currentY - this.previousY;
        if (Math.abs(deltaY) > 0.001) {
            this.node.setRotationFromEuler(0, 0, deltaY > 0 ? 30 : -25);
        }
        this.previousY = currentY;
    }

}


