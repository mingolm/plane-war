import {_decorator, CCBoolean, CCInteger, Component, resources, Sprite, SpriteFrame, v3, view} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('enemyCtrl')
export class enemyCtrl extends Component {
    @property(CCInteger)
    private speed: number = 250;

    @property(CCBoolean)
    public isDestroy: boolean = false;

    start() {
    }

    update(deltaTime: number) {
        if (!this.isDestroy) {
            // 移动
            this.node.setWorldPosition(v3(this.node.getWorldPosition().x, this.node.getWorldPosition().y - this.speed * deltaTime));
            // 离开屏幕销毁
            if (this.node.getPosition().y < -view.getFrameSize().height) {
                this.node.destroy();
            }
        }
    }

    die() {
        if (!this.isDestroy) {
            this.isDestroy = true;
            resources.load(
                "sprite/enemy0_die/spriteFrame",
                SpriteFrame,
                (err: Error, data: SpriteFrame) => {
                    if (!err) {
                        this.node.getComponent(Sprite).spriteFrame = data;
                    }
                    // 300ms后销毁
                    setTimeout(() => {
                        this.node.destroy();
                    }, 200);
                }
            );
        }
    }
}

