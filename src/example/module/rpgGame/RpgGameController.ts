/**
 * Created by yangsong on 2017/10/11.
 */
class RpgGameController extends BaseController {

    private gameView: RpgGameView;
    private gameModel: RpgGameModel;

    public constructor() {
        super();

        //View初始化
        this.gameView = new RpgGameView(this, LayerManager.Game_Main);
        App.ViewManager.register(ViewConst.RpgGame, this.gameView);

        //Model初始化
        this.gameModel = new RpgGameModel(this);

        //注册模块消息
        this.registerFunc(RpgGameConst.GameInit, this.gameInit, this);
        this.registerFunc(RpgGameConst.GameResize, this.gameResize, this);
    }

    private gameInit(mapId: number) {
        let roleVo = RoleVo.ins;//本玩家信息
        this.gameModel.mapId = mapId;
        this.gameModel.playerData = {
            mcName: roleVo.mcName,
            propertyData: {
                name: roleVo.name,
                title: roleVo.title,
                vip: roleVo.vip,
                attackDis: roleVo.attackDis,
                attackInterval: roleVo.attackInterval,
                hp: roleVo.hp
            }
        };
        this.gameModel.monsterNum = 200;

        App.ViewManager.open(ViewConst.RpgGame, this.gameModel);
    }

    private gameResize(): void {
        this.gameView.resize();
    }
}