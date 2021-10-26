/**
 * Created by yangsong on 2017/10/11.
 */
class RpgTiles extends egret.DisplayObjectContainer {

    private mapId: number;
    private tiles: any = [];
    private screenTiles: string[] = [];
    private cols: number;
    private rows: number;

    public constructor() {
        super();
    }

    public init(mapId: number): void {
        this.mapId = mapId;
        let mapData: any = RES.getRes("map_" + mapId + "_data.json");

        this.cols = Math.floor(mapData.width / RpgGameData.GameTileWidth);
        this.rows = Math.floor(mapData.height / RpgGameData.GameTileHeight);
    }

    public updateCameraPos($x: number, $y: number): void {
        let currCol: number = Math.round($x / RpgGameData.GameTileWidth);
        let currRow: number = Math.round($y / RpgGameData.GameTileHeight);

        let screenCols: number = Math.ceil(App.StageUtils.getWidth() / RpgGameData.GameTileWidth) + 1;
        let screenRows: number = Math.ceil(App.StageUtils.getHeight() / RpgGameData.GameTileHeight) + 1;

        let halfScreenCols: number = Math.ceil(screenCols / 2);
        let halfScreenRows: number = Math.ceil(screenRows / 2);

        let minCol: number = currCol - halfScreenCols;
        let maxCol: number = currCol + halfScreenCols;
        if (minCol < 0) {
            maxCol += -minCol;
            minCol = 0;
        }
        if (maxCol > this.cols) {
            minCol -= (maxCol - this.cols);
            maxCol = this.cols;
        }
        let minRow: number = currRow - halfScreenRows;
        let maxRow: number = currRow + halfScreenRows;
        if (minRow < 0) {
            maxRow += -minRow;
            minRow = 0;
        }
        if (maxRow > this.rows) {
            minRow -= (maxRow - this.rows);
            maxRow = this.rows;
        }

        let screenTiles = [];
        for (let i = minCol; i <= maxCol; i++) {
            for (let j = minRow; j <= maxRow; j++) {
                let tileKey: string = i + "_" + j;
                let tile: RpgTile = this.tiles[tileKey];
                if (!tile) {
                    tile = new RpgTile();
                    tile.init(this.mapId, i, j);
                    this.tiles[tileKey] = tile;
                }
                if (!tile.parent) {
                    this.addChild(tile);
                }
                screenTiles.push(tileKey);
            }
        }

        //移除不在屏幕内的格子
        this.screenTiles.forEach(function (tileKey: string) {
            if (screenTiles.indexOf(tileKey) == -1) {
                let tile: RpgTile = this.tiles[tileKey];
                tile && App.DisplayUtils.removeFromParent(tile);
            }
        }.bind(this));
        this.screenTiles = screenTiles;
    }

    public destory(): void {
        let keys: string[] = Object.keys(this.tiles);
        for (let i = 0; i < keys.length; i++) {
            let key: string = keys[i];
            let tile: RpgTile = this.tiles[key];
            tile.destory();

            this.tiles[key] = null;
            delete this.tiles[key];
        }

        this.screenTiles.splice(0);
    }
}