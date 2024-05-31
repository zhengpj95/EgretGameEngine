/**
 * Created by yangsong on 2017/10/11.
 */
class RpgGameModel extends BaseModel {
    public mapId: number;
    public playerData: {
        mcName: string,
        mcPath: string,
        skillPath: string,
        propertyData: IRpgGameObjectPropertyData
    };
    public monsterNum: number;

    public constructor($controller: BaseController) {
        super($controller)
    }

    // 设置rpg玩家数据
    public setPlayerData(): void {
        const roleVo = RoleVo.ins;
        this.playerData = {
            mcName: roleVo.mcName,
            mcPath: "resource/assets/rpgGame/player/",
            skillPath: "resource/assets/rpgGame/skill/",
            propertyData: {
                name: roleVo.name,
                title: roleVo.title,
                vip: roleVo.vip,
                attackDis: roleVo.attackDis,
                attackInterval: roleVo.attackInterval,
                hp: roleVo.hp,
            }
        }
    }
}