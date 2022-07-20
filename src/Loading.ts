export default class Loading extends Laya.Script 
{
    /** @prop {name:progressBar, tips:"loadingprogress", type:Node, default:null}*/
    progressBar: any;

    private progressBarWidth:number;
    
    constructor() 
    { 
        super();
        this.progressBar = null; 
    }
    
    onStart(): void
    {
        this.progressBarWidth = this.progressBar.width;
        this.progressBar.width = 0;
        
        var resourceArray = [
            {url:"res/atlas/main.atlas", type:Laya.Loader.ATLAS},
            {url:"res/atlas/crystal_turn.atlas", type:Laya.Loader.ATLAS},
            {url:"res/sound/background.mp3", type:Laya.Loader.SOUND},
            {url:"res/sound/crystalTurn.mp3", type:Laya.Loader.SOUND},
            {url:"res/sound/countdown_123.mp3", type:Laya.Loader.SOUND},
            {url:"res/sound/countdown_start.mp3", type:Laya.Loader.SOUND},
            {url:"res/sound/press_but.mp3", type:Laya.Loader.SOUND},
            {url:"res/sound/result.mp3", type:Laya.Loader.SOUND}
        ];
       
        Laya.loader.load(resourceArray,Laya.Handler.create(this,this.onLoaded),
        Laya.Handler.create(this,this.onProgress,null,false));
    }

    onLoaded():void
    {
        this.progressBar.width = this.progressBarWidth;
    }

    onProgress(value: number): void
    {
        var percentProgressBar:number = this.progressBarWidth * value;
        this.progressBar.width = percentProgressBar;

        if(value == 1)
        {
            Laya.Scene.open('main.scene', true, 0, Laya.Handler.create(this, ()=>{
                Laya.Scene.destroy("loading.scene");
            }));
            return;
        }
    }
}