/**
 * Created by yangsong on 2014/11/22.
 * Controller管理类
 */
class ControllerManager extends SingtonClass {
    private _modules: { [key: number]: BaseController };

    /**
     * 构造函数
     */
    public constructor() {
        super();
        this._modules = {};
    }

    /**
     * 清空处理
     */
    public clear(): void {
        this._modules = {};
    }

    /**
     * 动态添加的Controller
     * @param key 唯一标识
     * @param control
     *
     */
    public register(key: ControllerConst, control: BaseController): void {
        if (this.isExists(key))
            return;

        this._modules[key] = control;
    }

    /**
     * 动态移除Controller
     * @param key 唯一标识
     *
     */
    public unregister(key: ControllerConst): void {
        if (!this.isExists(key))
            return;

        this._modules[key] = null;
        delete this._modules[key];
    }

    /**
     * 是否已经存在Controller
     * @param key 唯一标识
     * @return Boolean
     *
     */
    public isExists(key: ControllerConst): boolean {
        return this._modules[key] != null;
    }

    /**
     * 跨模块消息传递
     * @param controllerD Controller唯一标识
     * @param key 消息唯一标识
     * @param param
     */
    public applyFunc(controllerD: ControllerConst, key: number, ...param: any[]): any {
        let manager: BaseController = this._modules[controllerD];
        if (manager) {
            let params = [];
            //注意这里是 arguments，其已经包括函数的所有参数了，所以从 1 开始
            for (let i = 1; i < arguments.length; i++) {
                params[i - 1] = arguments[i];
            }
            return manager.applyFunc.apply(manager, params);
        } else {
            Log.warn("模块" + controllerD + "不存在");
            return null;
        }
    }

    /**
     * 获取指定Controller的Model对象
     * @param controllerD Controller唯一标识
     * @returns {BaseModel}
     */
    public getControllerModel(controllerD: ControllerConst): BaseModel {
        let manager: BaseController = this._modules[controllerD];
        if (manager) {
            return manager.getModel();
        }
        return null;
    }

    /**
     * 获取指定的Controller
     * @param controllerD
     */
    public getController(controllerD: ControllerConst): BaseController {
        return this._modules[controllerD]
    }
}
