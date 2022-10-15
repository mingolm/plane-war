import {
    _decorator,
    Collider2D,
    Component,
    Contact2DType,
    EventTouch,
    find,
    instantiate,
    IPhysics2DContact,
    Node,
    PhysicsSystem2D,
    Prefab,
    resources,
    Sprite,
    SpriteFrame,
    v3
} from 'cc';
import {bulletCtrl} from "db://assets/scripts/bulletCtrl";
import {enemyCtrl} from "db://assets/scripts/enemyCtrl";
import {bgCtrl} from "db://assets/scripts/bgCtrl";

const {ccclass, property} = _decorator;

@ccclass('playerCtrl')
export class playerCtrl extends Component {
    @property({type: Prefab})
    private bulletPrefab: Prefab = null;

    @property({type: Prefab})
    private enemyPrefab: Prefab = null;

    onLoad() {
        console.log("player onload")
        // 注册全局碰撞回调函数
        PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    onBeginContact(
        selfCollider: Collider2D,
        otherCollider: Collider2D,
        contact: IPhysics2DContact | null
    ) {
        // 销毁 子弹*敌机
        if ((selfCollider.tag === 0 && otherCollider.tag === 1) || (selfCollider.tag === 1 && otherCollider.tag === 0)) {
            console.log("up")

            if (selfCollider.tag === 0) {
                selfCollider.getComponent(bulletCtrl).miss();
                otherCollider.getComponent(enemyCtrl).die();
            } else {
                selfCollider.getComponent(enemyCtrl).die();
                otherCollider.getComponent(bulletCtrl).miss();
            }
        }

        if ((selfCollider.tag === 1 && otherCollider.tag === 2) || (selfCollider.tag === 2 && otherCollider.tag === 1)) {
            console.log("game over")

            selfCollider.tag === 1
                ? selfCollider.getComponent(enemyCtrl).die()
                : otherCollider.getComponent(enemyCtrl).die();
            this.gameOver()
        }

    }

    gameOver(): void {
        find("Canvas/bg").getComponent(bgCtrl).pause();
        // 暂停所有计时器
        this.unscheduleAllCallbacks();
        this.node.off(Node.EventType.MOUSE_MOVE);
        resources.load(
            "sprite/hero1_die/spriteFrame",
            SpriteFrame,
            (err: Error, data: SpriteFrame) => {
                if (!err) {
                    this.node.getComponent(Sprite).spriteFrame = data;
                }
            }
        );
    }

    start() {
        // touch move
        this.node.on(Node.EventType.MOUSE_MOVE, (evt: EventTouch) => {
            this.node.setWorldPosition(
                v3(evt.getUILocation().x, evt.getUILocation().y)
            );
        });

        // attack
        this.schedule(() => {
            let bullet: Node = instantiate(this.bulletPrefab);
            bullet.setParent(this.node.parent);
            bullet.setPosition(
                this.node.getPosition().x,
                this.node.getPosition().y + 80
            );
        }, 0.5)

        this.schedule(() => {
            let aNumber: number = 175 * Math.random() + 1;
            let xPos: number = Math.floor(aNumber);
            let symbol: boolean = Math.random() > 0.5;
            if (!symbol && xPos !== 0) {
                xPos = -xPos;
            }

            let enemy: Node = instantiate(this.enemyPrefab);
            enemy.setParent(this.node.parent);
            enemy.setPosition(xPos, 420);
        }, 0.5)
    }

    update(deltaTime: number) {

    }

    onDestroy(): void {
        this.node.destroy();
        // 暂停所有计时器
        this.unscheduleAllCallbacks();
    }
}

