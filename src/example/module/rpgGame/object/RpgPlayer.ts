/**
 * Created by yangsong on 2017/10/11.
 */
class RpgPlayer extends RpgGameObject {
    public constructor() {
        super();
    }

    public init(vo: RpgGameObjectVO): void {
        super.init(vo);

        this.addComponent(ComponentType.Avatar);
        this.addComponent(ComponentType.AvatarSkill);
        this.addComponent(ComponentType.Head);
        this.addComponent(ComponentType.Move);
        this.addComponent(ComponentType.Camera);
        this.addComponent(ComponentType.Sort);
        this.addComponent(ComponentType.Control);
        // this.addComponent(ComponentType.AutoBattle);
        // this.addComponent(ComponentType.Battle);
    }

    public destroy(): void {
        super.destroy();
    }
}