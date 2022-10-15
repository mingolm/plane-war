import {_decorator, CCInteger, Component, v3, view} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('bulletCtrl')
export class bulletCtrl extends Component {
    @property(CCInteger)
    private speed: number = 800; // 子弹速度

    start() {

    }

    update(deltaTime: number) {
        // 移动
        this.node.setWorldPosition(v3(this.node.getWorldPosition().x, this.node.getWorldPosition().y + this.speed * deltaTime));
        // 离开屏幕销毁子弹
        if (this.node.getPosition().y > view.getFrameSize().height) {
            this.node.destroy();
        }
    }

    miss() {
        try {
            this.node?.destroy();
        } catch (e) {
            // ..
        }
    }
}

