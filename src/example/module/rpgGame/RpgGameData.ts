/**
 * Created by yangsong on 2017/10/11.
 */
class RpgGameData {
    public static GameTileWidth: number = 256;
    public static GameTileHeight: number = 256;

    public static GameCellWidth: number = 32;
    public static GameCellHeight: number = 16;

    public static GameAoiWidth: number = 256;
    public static GameAoiHeight: number = 256;

    public static WalkSpeed: number = 3;
}

/**地图json资源数据接口*/
interface IMapData {
    path: string;
    width: number;
    height: number;
    blocks: number[][];
}