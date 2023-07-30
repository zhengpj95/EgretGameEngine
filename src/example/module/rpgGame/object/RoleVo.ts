/**
 * 保持玩家实体信息
 */
class RoleVo extends SingtonClass {
    constructor() {
        super();
        this.init();
    }

    public static get ins(): RoleVo {
        return RoleVo.getSingtonInstance();
    }

    public roleId: Long;//需要引入Long包，protobuf的Long只是一个定义
    public title: string;
    public name: string;
    public vip: number;
    public mcName: string;
    public attackDis: number;
    public attackInterval: number;
    public hp: number;

    //todo 初始化测试数据
    public init(): void {
        this.roleId = Long.fromNumber(123123);
        this.title = '[开发者]';
        this.name = 'yangsong';
        this.vip = 8;
        this.attackDis = 3;
        this.attackInterval = 1500;
        this.hp = 1000000;
        this.mcName = 'scenePlayer_0';
    }
}