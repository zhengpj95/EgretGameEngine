/**
 * Created by yangsong on 2017/10/11.
 * 场景实体
 */
class RpgGameObject {
    /**实体上所挂载的Component实例*/
    private readonly _components: { [componentName: string]: Component };

    public id: number;
    public x: number;
    public y: number;
    public col: number;
    public row: number;
    public mcName: string;
    public mcPath: string;
    public skillPath: string;
    public gameView: RpgGameView;
    public speed: number;
    public dir: Dir;
    public pathChange: boolean;
    public action: string;
    public propertyData: any;
    public battleObj: RpgGameObject;
    private _data: RpgGameObjectVO;

    private _inCamera: boolean;
    private _path: PathNode[];

    public constructor() {
        this._components = {};
    }

    public get data() {
        return this._data;
    }

    public init(data: RpgGameObjectVO): void {
        this._data = data;
        this.id = data.id;
        this.col = data.col;
        this.row = data.row;
        this.gameView = data.gameView;
        this.mcPath = data.mcPath;
        this.mcName = data.mcName;
        this.skillPath = data.skillPath;
        this.speed = data.speed || RpgGameData.WalkSpeed;
        this.dir = data.dir || Dir.Bottom;
        this.propertyData = data.propertyData;

        const p: egret.Point = RpgGameUtils.convertCellToXY(this.col, this.row);
        this.x = p.x;
        this.y = p.y;
        this.action = Action.Stand;
    }

    public destroy(): void {
        let componentNames: string[] = Object.keys(this._components);
        while (componentNames.length) {
            var componentName: string = componentNames[0];
            this.removeComponent(componentName);

            componentNames = Object.keys(this._components);
        }

        this._path = null;
        this.gameView = null;
        this.battleObj = null;
        this.propertyData = null;
    }

    // 把Component挂载到实体身上
    public addComponent(componentName: string): void {
        if (this._components[componentName]) {
            return;
        }

        const component: Component = ObjectPool.pop(componentName);
        component.type = componentName;
        component.entity = this;
        component.start();

        ComponentSystem.addComponent(component);

        this._components[componentName] = component;
    }

    // 从实体身上移除Component
    public removeComponent(componentName: string): void {
        const component: Component = this._components[componentName];
        if (!component) {
            return;
        }

        ComponentSystem.removeComponent(component);

        component.stop();
        ObjectPool.push(component);

        this._components[componentName] = null;
        delete this._components[componentName];
    }

    // 获取Component
    public getComponent(componentName: string): Component {
        return this._components[componentName];
    }

    public get path(): PathNode[] {
        return this._path;
    }

    public set path(value: PathNode[]) {
        this._path = value;
        this.pathChange = true;
        if (this._path) {
            this.action = Action.Move;
        } else {
            this.action = Action.Stand;
        }
    }

    public setInCamera(value: boolean) {
        this._inCamera = value;
    }

    public getInCamera(): boolean {
        return this._inCamera;
    }
}

/**rpg场景实体数据接口*/
interface RpgGameObjectVO {
    id?: number;
    col?: number;
    row?: number;
    gameView?: RpgGameView;
    mcPath?: string;
    mcName?: string;
    skillPath?: string;
    speed?: number;
    dir?: Dir;
    propertyData?: IRpgGameObjectPropertyData;
    objectType?: ObjectType;
}

/**场景实体vo身上的propertyData数据*/
interface IRpgGameObjectPropertyData {
    name:string,
    hp: number
    attackDis: number,
    attackInterval: number,
    title?: string,
    vip?: number,
    dis?: number;
}

/**实体对象类型*/
const enum ObjectType {
    Player = 1,     //玩家
    Npc = 2,        //Npc
    Monster = 3,    //怪物
    Pet = 4,        //宠物
    DropItem = 5,   //掉落
}