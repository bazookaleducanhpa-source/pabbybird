import { _decorator, CCInteger, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import { Ground } from './Ground';

@ccclass('GameControll')
export class GameControll extends Component {
    @property({
        type:Ground,
        tooltip:"Ground is here"
    })
    public ground: Ground;

    @property({
        type:CCInteger,
        tooltip:"Game Speed is here"
    })
    public gameSpeed: number = 300;


    update(deltaTime: number) {
    }
}


