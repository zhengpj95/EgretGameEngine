class Main extends egret.DisplayObjectContainer {
	public constructor() {
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}

	//引入Long包，并挂载到protobuf上
    public initLong() {
        let global: any = window;
        global.Long = global.Long ? global.Long : global.dcodeIO ? global.dcodeIO.Long : undefined;

        protobuf.util.Long = Long;
        protobuf.configure();
    }

	private onAddToStage(event: egret.Event) {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);

		//注入自定义的素材解析器
		egret.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
		egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

		//适配方式(全屏适配)
		App.StageUtils.startFullscreenAdaptation(650, 1000, this.onResize);

        this.initLong();
		//初始化
		if (!DEBUG) {
			this.initLifecycle();
		}
		this.initScene();

		//加载资源配置文件
		this.loadResConfig();
	}

	private initLifecycle(): void {
		egret.lifecycle.addLifecycleListener((context) => {
			// custom lifecycle plugin
		});

		egret.lifecycle.onPause = () => {
			egret.ticker.pause();
			App.TimerManager.pause();
			App.TweenUtils.pause();
		};

		egret.lifecycle.onResume = () => {
			egret.ticker.resume();
			App.TimerManager.resume();
			App.TweenUtils.resume();
		};
	}

	private onResize(): void {
		if (App.ControllerManager.isExists(ControllerConst.RpgGame)) {
			App.ControllerManager.applyFunc(ControllerConst.RpgGame, RpgGameConst.GameResize);
		}
	}

	private loadResConfig(): void {
		//初始化Resource资源加载库
		App.ResourceUtils.addConfig("resource/default.res.json", "resource/");
		App.ResourceUtils.addConfig("resource/resource_core.res.json", "resource/");
		App.ResourceUtils.addConfig("resource/resource_ui.res.json", "resource/");
		App.ResourceUtils.addConfig("resource/resource_battle.res.json", "resource/");
		App.ResourceUtils.addConfig("resource/resource_rpg.res.json", "resource/");
		App.ResourceUtils.loadConfig(this.onConfigComplete, this);
	}

	/**
	 * 配置文件加载完成,开始预加载preload资源组。
	 */
	private onConfigComplete(): void {
		//加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
		let theme = new eui.Theme("resource/default.thm.json", this.stage);
		theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);
	}

	/**
	 * 主题文件加载完成
	 */
	private onThemeLoadComplete(): void {
		//模块初始化
		this.initModule();

		//设置加载进度界面
		App.SceneManager.runScene(SceneConsts.LOADING);

		//开启游戏
		new RpgTest();
		// new EUITest();

		// 需要搭建服务端，需要处理resource/config/global.json
		// new ProtoBufTest();
		// 未完成的测试案例，不可调试
		// new ActTest();
		// new StarlingSwfTest();
	}

	/**
	 * 初始化所有场景
	 */
	private initScene(): void {
		// 给每个层级加上name，方便debug
		LayerManager.Game_Main.name = 'game_main';
		LayerManager.UI_Main.name = 'ui_main';
		LayerManager.UI_Popup.name = 'ui_popup';
		LayerManager.UI_Message.name = 'ui_message';
		LayerManager.UI_Tips.name = 'ui_tips';

		App.SceneManager.register(SceneConsts.LOADING, new LoadingScene());
		App.SceneManager.register(SceneConsts.UI, new UIScene());
		App.SceneManager.register(SceneConsts.Game, new GameScene());
		App.SceneManager.register(SceneConsts.RpgGame, new RpgGameScene());
	}

	/**
	 * 初始化所有模块
	 */
	private initModule(): void {
		App.ControllerManager.register(ControllerConst.Loading, new LoadingController());
	}
}


