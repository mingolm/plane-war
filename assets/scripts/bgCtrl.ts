import {_decorator, CCBoolean, Component, UITransform} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('bgCtrl')
export class bgCtrl extends Component {
    @property(CCBoolean)
    private symbol: boolean = true;


    start() {

    }

    update(deltaTime: number) {
        if (this.symbol) {
            for (let bg of this.node.children) {
                bg.setPosition(bg.getPosition().x, bg.getPosition().y - 50 * deltaTime)
                let bgUi = bg.getComponent(UITransform)
                if (bg.position.y <= -bgUi.height) {
                    console.log(bgUi.height)
                    bg.setPosition(bg.getPosition().x, bgUi.height)
                }
            }
        }
    }

    restart(): void {
        this.symbol = false
    }

    pause(): void {
        this.symbol = false
    }
}

