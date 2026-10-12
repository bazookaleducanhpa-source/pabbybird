import { _decorator, Component, instantiate, Node, NodePool, Prefab } from 'cc';
const { ccclass, property } = _decorator;
import { Pipes } from './Pipes';
@ccclass('PipePool')
export class PipePool extends Component {
    @property({
        type: Prefab,
        tooltip: "Pipe Prefab is here"
    })
    public pipePrefab = null;
    @property({
        type: Node,
        tooltip: "Pipe Pool is here"
    })
    public pipePoolHome;
    public createPipe 
    public pool = new NodePool;
    initPool() {
        let initCount = 4;
        for (let i = 0; i < initCount; i++) {
            this.createPipe = instantiate(this.pipePrefab);
            if(i==0){
                this.pipePoolHome.addChild(this.createPipe);
            }else{
                this.pool.put(this.createPipe);
            }
        }
    }
    addPool() {
        if(this.pool.size() > 0){
            this.createPipe = this.pool.get();

        }else {
            this.createPipe = instantiate(this.pipePrefab);
        }
        this.pipePoolHome.addChild(this.createPipe);
    }
    resetPool() {
        this.pipePoolHome.removeAllChildren();
        this.pool.clear();
        this.initPool();
    }

}


