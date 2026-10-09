import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Result')
export class Result extends Component {
    @property({
        type: Label
    })
    public scoreLable: Label;
    @property({
        type: Label
    })
    public highScoreLabel: Label;
    @property({
        type: Label
    })
    public ResultLabel: Label;

    maxScore: number = 0;
    currentScore: number;
    updateScore(num: number) {
        this.currentScore = num;

        this.scoreLable.string = "Score: " + this.currentScore;
    }
    resetScore() {
        this.updateScore(0);
        this.hideResult();
    
    }
    addScore() {
        this.updateScore(this.currentScore + 1);
    }
    showResult() {
        this.maxScore = Math.max(this.maxScore, this.currentScore);
        this.highScoreLabel.string = "High Score: " + this.maxScore;
        this.highScoreLabel.node.active = true;
        this.ResultLabel.node.active = true;
    }
    hideResult() {
        this.highScoreLabel.node.active = false;

        this.ResultLabel.node.active = false;
    }
}


