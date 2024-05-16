/**
 * Created by yangsong on 2017/10/11.
 */
class Component {
    public dealTime: number;
    public dealInterval: number;

    public entity: RpgGameObject; // 场景实体，在创建场景实体时赋值
    public isRunning: boolean; // 在运行中
    public type: string; // ComponentType

    public constructor() {
    }

    public start(): void {
        this.dealTime = 0;
        this.dealInterval = 0;
        this.isRunning = true;
    }

    public stop(): void {
        this.dealTime = null;
        this.dealInterval = null;

        this.entity = null;
        this.isRunning = false;
        this.type = null;
    }

    public update(advancedTime: number): void {

    }
}