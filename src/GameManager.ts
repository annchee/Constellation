export default class GameManager extends Laya.Script {

    public static instance:GameManager;

    /** @prop {name:actionNum, tips:"actionnum", type:Node, default:null}*/
    actionNum: any;
    /** @prop {name:crystalTurnAnim, tips:"crystalturnanim", type:Node, default:null}*/
    crystalTurnAnim: any;

    /** @prop {name:magicLight, tips:"magiclight", type:Node, default:null}*/
    magicLight: any;
    /** @prop {name:magicStone, tips:"magicstone", type:Node, default:null}*/
    magicStone: any;
    /** @prop {name:magic, tips:"magic", type:Node, default:null}*/
    magic: any;
    /** @prop {name:whiteBg, tips:"whitebg", type:Node, default:null}*/
    whiteBg: any;
    /** @prop {name:stone, tips:"stone", type:Node, default:null}*/
    stone: any;
    /** @prop {name:character, tips:"character", type:Node, default:null}*/
    character: any;
    /** @prop {name:resultPanel, tips:"resultpanel", type:Node, default:null}*/
    resultPanel: any;
    
    /** @prop {name:finalCrystal, tips:"finalcrystal", type:Node, default:null}*/
    finalCrystal: any;
    /** @prop {name:finalCrystalTxt, tips:"finalcrystaltext", type:Node, default:null}*/
    finalCrystalTxt: any;
    /** @prop {name:finalCrystalBlurTxt, tips:"finalcrystalblurtext", type:Node, default:null}*/
    finalCrystalBlurTxt: any;

    /** @prop {name:digitMinute, tips:"digitminute", type:Node, default:null}*/
    digitMinute: any;
    /** @prop {name:digitSecond, tips:"digitsecond", type:Node, default:null}*/
    digitSecond: any;

    /** @prop {name:betTxt, tips:"bettext", type:Node, default:null}*/
    betTxt: any;

    /** @prop {name:audioBtn, tips:"audiobtn", type:Node, default:null}*/
    audioBtn: any;

    private nActionNum: number = 5;
    private randomStone: number;

    private crystalArray1: Array<any> = new Array();
    private crystalArray2: Array<any> = new Array();
    private recordArray: Array<any> = new Array();
    private recordTimeHourArray: Array<any> = new Array();
    private recordTimeMinArray: Array<any> = new Array();

    private upPos: boolean = true;
    private crystalUpPos: boolean = true;

    private horoscope1:Laya.Sprite;
    private horoscope2:Laya.Sprite;

    private currentResultHour: number ;
    private currentResultMinute: number ;

    private soundChannel: Laya.SoundChannel;
    private audioStatus:boolean = true;
    private playTime:number = 0;
    private currentMusic: string = 'background';
    
    constructor() 
    { 
        super(); 

        GameManager.instance = this;

        this.actionNum = null;
        this.crystalTurnAnim = null;

        this.magicLight = null;
        this.magicStone = null;
        this.magic = null;

        this.whiteBg = null;
        this.stone = null;
        this.character = null;

        this.resultPanel = null;
        
        this.finalCrystal = null;
        this.finalCrystalTxt = null;
        this.finalCrystalBlurTxt = null;

        this.digitMinute = null;
        this.digitSecond = null;

        this.betTxt = null;

        this.audioBtn = null;

        Laya.SoundManager.setMusicVolume(0.3);
        this.playMusic(this.currentMusic);
        
    }

    onStart(): void
    {
        Laya.timer.clear(this, this.onFinalCrystalFloat);
        Laya.Tween.to(this.whiteBg, {alpha:0}, 1000, Laya.Ease.linearInOut);

        this.magic.visible = false;
        this.finalCrystal.visible = false;
        this.finalCrystal.alpha = 0;

        this.upPos = true;
        this.crystalUpPos = true;

        this.preGame();
    }

    preGame(): void
    {
        this.nActionNum = 5;
        this.crystalArray1 = new Array();
        this.crystalArray2 = new Array();

        for(var i = 1; i <= 10 ; i++)
        {
            this.horoscope1 = this.owner.getChildByName("crystal1_"+i) as Laya.Sprite;
            this.horoscope1.visible = true;
            this.crystalArray1[i] = this.horoscope1;
        }

        for(var i = 1; i <= 2 ; i++)
        {
            this.horoscope2 = this.owner.getChildByName("crystal2_"+i) as Laya.Sprite;
            this.horoscope2.visible = true;
            this.crystalArray2[i] = this.horoscope2;
        }

        this.audioBtn.on(Laya.Event.MOUSE_UP, this, this.onAudio);
        Laya.timer.loop(1600, this, this.onCrystalFloat);
        Laya.timer.loop(1000,this, this.onCountDown);
    }

    onCountDown(): void
    {
        var dm = new Date().getUTCMinutes();
        var ds = new Date().getUTCSeconds();

        var seconds = parseInt(ds.toString());
        if(dm == 0 )
        {
            var secondDigitMin = 0;
        }
        else if(dm >= 1 && dm <=9)
        {
            var secondDigitMin = parseInt(dm.toString()[0]);
        }
        else
        {
            var secondDigitMin = parseInt(dm.toString()[1]);
        }

        var temp_min = secondDigitMin*60 + seconds;
        var diff = 600 - temp_min; 
        var diffMin = Math.floor(diff / 60);
        var diffSec = Math.floor(diff % 60); 

        this.digitMinute.value = diffMin < 10 ? "0" + diffMin : "" + diffMin;
        this.digitSecond.value = diffSec < 10 ? "0" + diffSec : "" + diffSec;

        if(diffMin == 0 && diffSec == 6)
        {
            this.betTxt.text = "-";
            this.betTxt.fontSize = 30;
            Laya.timer.loop(1000,this,this.onAction);
        }
        else if(diffMin == 0 && (diffSec > 6 && diffSec <= 59))
        {
            this.betTxt.text = "Close Bet";
            this.betTxt.fontSize = 25;
            
        }
        else if(diffMin == 9)
        {
            this.betTxt.text = "Wait";
            this.betTxt.fontSize = 30;

        }
        else if(diffMin != 0 && diffMin != 10)
        {
            this.betTxt.text = "Bet";
            this.betTxt.fontSize = 30;
        }
    }

    onCrystalFloat(): void
    {
        if(this.upPos)
        {
            for(var i = 1; i <= 10; i++ ){
                Laya.Tween.to(this.crystalArray1[i],{y:this.crystalArray1[i].y+5},1500,Laya.Ease.linearInOut);
            }

            for(var i = 1; i <= 2; i++ ){
                Laya.Tween.to(this.crystalArray2[i],{y:this.crystalArray2[i].y-5},1500,Laya.Ease.linearInOut);
            }

            this.upPos = false;
        }
        else
        {
            for(var i = 1; i <= 10; i++ ){
                Laya.Tween.to(this.crystalArray1[i],{y:this.crystalArray1[i].y-5},1500,Laya.Ease.linearInOut);
            }

            for(var i = 1; i <= 2; i++ ){
                Laya.Tween.to(this.crystalArray2[i],{y:this.crystalArray2[i].y+5},1500,Laya.Ease.linearInOut);
            }

            this.upPos = true;
        }
    }

    onAction(): void
    {
        this.actionNum.visible = true;
        this.actionNum.scale(30,30);
        this.actionNum.alpha = .2;

        Laya.Tween.to(this.actionNum,{scaleX:1,scaleY:1,alpha:1},500,Laya.Ease.linearInOut);

        if(this.nActionNum <= 0)
        { 
            if(this.nActionNum == 0)
            {
                this.playSound('countdown_start',1.0);
                this.actionNum.text = "START";
            }
            else
            {
                Laya.timer.clear(this, this.onAction);
                this.actionNum.visible = false;
                this.onGame();
            }
        }
        else
        {
            this.playSound('countdown_123',0.5);
            this.actionNum.text = ""+ this.nActionNum;
        }

        this.nActionNum --;
    }

    onGame(): void
    {
       Laya.timer.clear(this,this.onCrystalFloat);
       this.playSound('crystalTurn',0.5);

       for(var i = 1; i <= 10 ; i++)
        {
            this.horoscope1 = this.owner.getChildByName("crystal1_"+i) as Laya.Sprite;
            this.horoscope1.visible = false;
            this.crystalArray1[i] = this.horoscope1;
        }

        for(var i = 1; i <= 2 ; i++)
        {
            this.horoscope2 = this.owner.getChildByName("crystal2_"+i) as Laya.Sprite;
            this.horoscope2.visible = false;
            this.crystalArray2[i] = this.horoscope2;
        }

       this.crystalTurnAnim.visible = true;
       this.crystalTurnAnim.play(0, false);
       this.crystalTurnAnim.on(Laya.Event.COMPLETE, this, this.onHold_1);
    }

    onHold_1(): void
    {
        this.crystalTurnAnim.visible = false;
        this.crystalTurnAnim.stop();
        this.whiteBg.alpha = 1;
        Laya.Tween.to(this.magicStone, {alpha:1}, 1500, Laya.Ease.linearInOut);

        Laya.timer.once(2000, this, this.onRandomStone);
    }

    onRandomStone(): void
    {
        Laya.Tween.to(this.whiteBg, {alpha:0}, 2000, Laya.Ease.linearInOut);
        this.resultPanel.visible = true;
        this.stone.visible = true;
        this.stone.y = 123;
        Laya.Tween.to(this.stone, {alpha:1}, 1500, Laya.Ease.linearInOut);

        this.playSound('result',0.5);

        this.randomStone = Math.floor(Math.random() * 12);
        switch(this.randomStone)
        {
            case 0:{
                this.stone.texture = "main/aries.png";
                this.finalCrystalTxt.text = "ARIES";
                break;
            }
            case 1:{
                this.stone.texture = "main/taurus.png";
                this.finalCrystalTxt.text = "TAURUS";
                break;
            }
            case 2:{
                this.stone.texture = "main/germini.png";
                this.finalCrystalTxt.text = "GERMINI";
                break;
            }
            case 3:{
                this.stone.texture = "main/cancer.png";
                this.finalCrystalTxt.text = "CANCER";
                break;
            }
            case 4:{
                this.stone.texture = "main/leo.png"; 
                this.finalCrystalTxt.text = "LEO";
                break;
            }
            case 5:{
                this.stone.texture = "main/virgo.png";
                this.finalCrystalTxt.text = "VIRGO";
                break;
            }
            case 6:{
                this.stone.texture = "main/libra.png";
                this.finalCrystalTxt.text = "LIBRA";
                break;
            }
            case 7:{
                this.stone.texture = "main/scorpio.png";
                this.finalCrystalTxt.text = "SCORPIO";
                break;
            }
            case 8:{
                this.stone.texture = "main/sagittarius.png";
                this.finalCrystalTxt.text = "SAGITARIUS";
                break;
            }
            case 9:{
                this.stone.texture = "main/capricorn.png";
                this.finalCrystalTxt.text = "CAPRICORN";
                break;
            }
            case 10:{
                this.stone.texture = "main/aquarius.png";
                this.finalCrystalTxt.text = "AQUARIUS";
                break;
            }
            default:{
                this.stone.texture = "main/pisces.png";
                this.finalCrystalTxt.text = "PISCES";
                break;
            }
        }

        this.recordArray.unshift(this.randomStone);

        this.currentResultHour = new Date().getHours();
        this.currentResultMinute = new Date().getUTCMinutes();

        var tempHour = this.currentResultHour < 10 ? "0" + this.currentResultHour: "" + this.currentResultHour;
        var tempMin = this.currentResultMinute < 10 ? "0" + this.currentResultMinute: "" + this.currentResultMinute;
        this.recordTimeHourArray.unshift(tempHour);
        this.recordTimeMinArray.unshift(tempMin);

        var resultBox : Laya.Sprite = this.owner.getChildByName("record_crystal") as Laya.Sprite;
        
        if(this.recordArray.length <= 6)
        {
            for( var i = 0; i < this.recordArray.length; i++ )
            {
                var result : Laya.Sprite = resultBox.getChildByName("record_" + i) as Laya.Sprite;
                result.loadImage("main/record_" + this.recordArray[i] + ".png");

                var recordTime : Laya.Text = result.getChildByName("time_" + i) as Laya.Text;
                recordTime.text = "" + this.recordTimeHourArray[i] + " : " + this.recordTimeMinArray[i];
            }
        }
        else{
            
            this.recordArray.splice(this.recordArray.length - 1, 1);
            this.recordTimeHourArray.splice(this.recordTimeHourArray.length - 1, 1);
            this.recordTimeMinArray.splice(this.recordTimeMinArray.length - 1, 1);

            for( var i = 0; i < this.recordArray.length; i++ )
            {
                var result : Laya.Sprite = resultBox.getChildByName("record_" + i) as Laya.Sprite;
                result.loadImage("main/record_" + this.recordArray[i] + ".png");

                var recordTime : Laya.Text = result.getChildByName("time_" + i) as Laya.Text;
                recordTime.text = "" + this.recordTimeHourArray[i] + " : " + this.recordTimeMinArray[i];
            }
        }

        Laya.timer.once(3000, this, this.onHold_2);
    }

    onHold_2(): void
    {
        Laya.Tween.to(this.stone, {y: 623}, 5000, Laya.Ease.linearInOut);
        Laya.Tween.to(this.whiteBg, {alpha:1}, 6000, Laya.Ease.linearInOut);

        Laya.timer.once(6000, this, this.onHold_3);
    }

    onHold_3(): void
    {
        Laya.Tween.to(this.whiteBg, {alpha:0}, 3000, Laya.Ease.linearInOut);
        Laya.Tween.to(this.magicStone, {alpha:0}, 2000, Laya.Ease.linearInOut);
        Laya.Tween.to(this.magicLight, {alpha:1}, 2000, Laya.Ease.linearInOut);

        this.stone.alpha = 0;
        this.stone.visible = false;

        this.resultPanel.visible = false;
        this.character.visible = true;

        switch(this.randomStone){
            case 0:{
                this.character.texture = "main/character_aries.png";
                break;
            }
            case 1:{
                this.character.texture = "main/character_taurus.png";
                break;
            }
            case 2:{
                this.character.texture = "main/character_germini.png";
                break;
            }
            case 3:{
                this.character.texture = "main/character_cancer.png";
                break;
            }
            case 4:{
                this.character.texture = "main/character_leo.png";
                break;
            }
            case 5:{
                this.character.texture = "main/character_virgo.png";
                break;
            }
            case 6:{
                this.character.texture = "main/character_libra.png";
                break;
            }
            case 7:{
                this.character.texture = "main/character_scorpion.png";
                break;
            }
            case 8:{
                this.character.texture = "main/character_sagittarius.png";
                break;
            }
            case 9:{
                this.character.texture = "main/character_capricon.png";
                break;
            }
            case 10:{
                this.character.texture = "main/character_aquarius.png";
                break;
            }
            default:{
                this.character.texture = "main/character_pisces.png";
                break;
            }
        }

        Laya.Tween.to(this.character,{alpha:1},3000,Laya.Ease.linearInOut);
        Laya.timer.once(5000,this,this.onHold_4);
    }

    onHold_4(): void
    {
        Laya.Tween.to(this.character,{alpha:0},6000,Laya.Ease.linearInOut);
        Laya.Tween.to(this.magicLight, {alpha:0}, 6000, Laya.Ease.linearInOut);
        Laya.Tween.to(this.whiteBg, {alpha:1}, 6000, Laya.Ease.linearInOut);
        
        Laya.timer.once(6500,this,this.onShow);
    }

    onShow(): void
    {
        Laya.Tween.to(this.whiteBg, {alpha:0}, 3000, Laya.Ease.linearInOut);

        this.magic.visible = true;
        this.finalCrystal.visible = true; 
        this.finalCrystal.texture = this.stone.texture;

        this.finalCrystalBlurTxt.text = this.finalCrystalTxt.text;

        Laya.Tween.to(this.finalCrystal, {alpha:1}, 3000, Laya.Ease.linearInOut);
        
        Laya.timer.loop(1600, this, this.onFinalCrystalFloat);
        Laya.timer.once(16000, this, this.onStart);

        Laya.Tween.to(this.whiteBg, {alpha:1}, 3000, Laya.Ease.linearInOut,null,10000);

    }

    onFinalCrystalFloat(): void
    {
        if(this.crystalUpPos)
        {
            Laya.Tween.to(this.finalCrystal,{y:this.finalCrystal.y+5},1500,Laya.Ease.linearInOut);
            this.crystalUpPos = false;
        }
        else
        {
            Laya.Tween.to(this.finalCrystal,{y:this.finalCrystal.y-5},1500,Laya.Ease.linearInOut);
            this.crystalUpPos = true;
        }
    }

    onAudio(): void
    {
        this.playSound('press_but', 0.5);

        if(this.audioStatus == true)
        {
            this.audioStatus = false;
            this.audioBtn.skin = "main/btn_audio_off.png";
            this.playTime = this.soundChannel.position;
            this.soundChannel.stop();
        }
        else if(this.audioStatus == false)
        {
            this.audioStatus = true;
            this.audioBtn.skin = "main/btn_audio_on.png";
            var soundUrl = "res/sound/"+this.currentMusic+".mp3";
            this.soundChannel = Laya.SoundManager.playMusic(soundUrl,0,null, this.playTime);
        }

        Laya.SoundManager.soundMuted = !this.audioStatus;
    }
    
    playMusic(soundName: string) : void
    {
        this.soundChannel = Laya.SoundManager.playMusic("res/sound/"+soundName+".mp3", 0);
        Laya.SoundManager.useAudioMusic = false;
    }

    playSound(soundName:string, soundVolume:number):void
    {
        Laya.SoundManager.setSoundVolume(soundVolume);
        Laya.SoundManager.playSound("res/sound/"+soundName+".mp3", 1);
    }
}