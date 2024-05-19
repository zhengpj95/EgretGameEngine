/**
 * Created by yangsong on 2017/10/11.
 * 相当于场景界面，包含地图层，玩家模型层，特效处理层等
 */
class RpgGameView extends BaseSpriteView {
    private background: RpgBackground;
    private gameObjectLayer: egret.DisplayObjectContainer;
    private gameEffectLayer: egret.DisplayObjectContainer;
    private blocksData: number[][];
    private player: RpgPlayer;
    private monsters: RpgMonster[];

    public constructor($controller: BaseController, $parent: egret.DisplayObjectContainer) {
        super($controller, $parent);
    }

    public initUI(): void {
        super.initUI();

        this.background = new RpgBackground();
        this.addChild(this.background);

        this.gameObjectLayer = new egret.DisplayObjectContainer();
        this.gameObjectLayer.name = '_gameObjectLayer';
        this.addChild(this.gameObjectLayer);

        this.gameEffectLayer = new egret.DisplayObjectContainer();
        this.gameEffectLayer.name = '_gameEffectLayer';
        this.addChild(this.gameEffectLayer);
    }

    public initData(): void {
        super.initData();

        this.monsters = [];
    }

    /**
     * 面板开启执行函数，用于子类继承
     * @param param 参数
     */
    public open(...param: any[]): void {
        super.open(param);

        const gameModel: RpgGameModel = param[0];//RpgGameController 传入

        this.initBackground(gameModel.mapId);
        this.initBlocks(gameModel.mapId);
        this.createPlayer(gameModel.playerData);
        this.createMonsters(gameModel.monsterNum);
    }

    private initBackground(mapId: number): void {
        this.background.init(mapId);
    }

    private initBlocks(mapId: number): void {
        const mapData: IMapData = RES.getRes("map_" + mapId + "_data.json");
        this.blocksData = mapData.blocks;
    }

    private createPlayer(playData: { mcName: string, propertyData: IRpgGameObjectPropertyData }): void {
        const col: number = App.RandomUtils.limitInteger(1, this.blocksData[0].length - 2);
        const row: number = App.RandomUtils.limitInteger(1, this.blocksData.length - 2);

        this.player = ObjectPool.pop("RpgPlayer");
        this.player.init({
            col: col,
            row: row,
            mcName: playData.mcName,
            mcPath: "resource/assets/rpgGame/player/",
            skillPath: "resource/assets/rpgGame/skill/",
            gameView: this,
            propertyData: playData.propertyData,
            objectType: ObjectType.Player
        });
    }

    private createMonsters(monsterNum: number): void {
        const monstersData: RpgGameObjectVO[] = [];
        for (var i = 0; i < monsterNum; i++) {
            var col: number = App.RandomUtils.limitInteger(1, this.blocksData[0].length - 2);
            var row: number = App.RandomUtils.limitInteger(1, this.blocksData.length - 2);
            var mcName: string = "monster_" + App.RandomUtils.limitInteger(0, 9);
            var mcPath: string = "resource/assets/rpgGame/monster/";
            monstersData.push({
                col: col,
                row: row,
                mcName: mcName,
                mcPath: mcPath,
                gameView: this,
                // dis: App.MathUtils.getDistance(col, row, this.player.col, this.player.row),
                propertyData: {
                    name: "monster_" + App.RandomUtils.limitInteger(1, 1000),
                    attackDis: 3,
                    attackInterval: 3000,
                    hp: 2000,
                    dis: App.MathUtils.getDistance(col, row, this.player.col, this.player.row)
                },
                objectType: ObjectType.Monster
            });
        }

        monstersData.sort(function (a, b) {
            if (a.propertyData.dis < a.propertyData.dis) {
                return -1;
            } else {
                return 1;
            }
        });

        const executor: FrameExecutor = new FrameExecutor(1);
        monstersData.forEach(function (data: RpgGameObjectVO) {
            executor.regist(function () {
                const monster: RpgMonster = ObjectPool.pop("RpgMonster");
                monster.init(data);
                this.monsters.push(monster);
            }, this);
        }.bind(this));
        executor.execute();
    }

    public showHpChange(gameObj: RpgGameObject, changeHp: number, txtColor: number = 0xFF0000): void {
        const hpTxt: egret.TextField = ObjectPool.pop("egret.TextField");
        hpTxt.size = 25;
        hpTxt.textColor = txtColor;
        hpTxt.width = 100;
        hpTxt.height = 20;
        hpTxt.textAlign = egret.HorizontalAlign.CENTER;
        hpTxt.strokeColor = 0x000000;
        hpTxt.stroke = 2;
        hpTxt.text = changeHp.toString();
        hpTxt.x = gameObj.x;
        hpTxt.y = gameObj.y - 150;
        hpTxt.alpha = 1;
        App.AnchorUtils.setAnchorX(hpTxt, 0.5);
        this.gameEffectLayer.addChild(hpTxt);

        egret.Tween.get(hpTxt).to({"y": gameObj.y - 250, "alpha": 0}, 1000).call(function () {
            App.DisplayUtils.removeFromParent(hpTxt);
            ObjectPool.push(hpTxt);
        });
    }

    public removeMonster(monster: RpgMonster): void {
        const index: number = this.monsters.indexOf(monster);
        if (index != -1) {
            this.monsters.splice(index, 1);
        }

        monster.destroy();
        monster = null;
    }

    public resize(): void {
        if (!this.player) {
            return;
        }
        const cameraComponent: CameraComponent = <CameraComponent>this.player.getComponent(ComponentType.Camera);
        cameraComponent.dealMoveObjs();
        cameraComponent.dealBgCamera();
    }

    public getBlocksData(): number[][] {
        return this.blocksData;
    }

    public getGameObjectLayer(): egret.DisplayObjectContainer {
        return this.gameObjectLayer;
    }

    public getGameEffectLayer(): egret.DisplayObjectContainer {
        return this.gameEffectLayer;
    }

    public getBackground(): RpgBackground {
        return this.background;
    }

    public getMonsters(): RpgMonster[] {
        return this.monsters;
    }
}