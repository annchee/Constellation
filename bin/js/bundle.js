(function () {
    'use strict';

    class Loading extends Laya.Script {
        constructor() {
            super();
            this.progressBar = null;
        }
        onStart() {
            this.progressBarWidth = this.progressBar.width;
            this.progressBar.width = 0;
            var resourceArray = [
                { url: "res/atlas/main.atlas", type: Laya.Loader.ATLAS },
                { url: "res/atlas/crystal_turn.atlas", type: Laya.Loader.ATLAS },
                { url: "res/sound/background.mp3", type: Laya.Loader.SOUND },
                { url: "res/sound/crystalTurn.mp3", type: Laya.Loader.SOUND },
                { url: "res/sound/countdown_123.mp3", type: Laya.Loader.SOUND },
                { url: "res/sound/countdown_start.mp3", type: Laya.Loader.SOUND },
                { url: "res/sound/press_but.mp3", type: Laya.Loader.SOUND },
                { url: "res/sound/result.mp3", type: Laya.Loader.SOUND }
            ];
            Laya.loader.load(resourceArray, Laya.Handler.create(this, this.onLoaded), Laya.Handler.create(this, this.onProgress, null, false));
        }
        onLoaded() {
            this.progressBar.width = this.progressBarWidth;
        }
        onProgress(value) {
            var percentProgressBar = this.progressBarWidth * value;
            this.progressBar.width = percentProgressBar;
            if (value == 1) {
                Laya.Scene.open('main.scene', true, 0, Laya.Handler.create(this, () => {
                    Laya.Scene.destroy("loading.scene");
                }));
                return;
            }
        }
    }

    class GameManager extends Laya.Script {
        constructor() {
            super();
            this.nActionNum = 5;
            this.crystalArray1 = new Array();
            this.crystalArray2 = new Array();
            this.recordArray = new Array();
            this.recordTimeHourArray = new Array();
            this.recordTimeMinArray = new Array();
            this.upPos = true;
            this.crystalUpPos = true;
            this.audioStatus = true;
            this.playTime = 0;
            this.currentMusic = 'background';
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
        onStart() {
            Laya.timer.clear(this, this.onFinalCrystalFloat);
            Laya.Tween.to(this.whiteBg, { alpha: 0 }, 1000, Laya.Ease.linearInOut);
            this.magic.visible = false;
            this.finalCrystal.visible = false;
            this.finalCrystal.alpha = 0;
            this.upPos = true;
            this.crystalUpPos = true;
            this.preGame();
        }
        preGame() {
            this.nActionNum = 5;
            this.crystalArray1 = new Array();
            this.crystalArray2 = new Array();
            for (var i = 1; i <= 10; i++) {
                this.horoscope1 = this.owner.getChildByName("crystal1_" + i);
                this.horoscope1.visible = true;
                this.crystalArray1[i] = this.horoscope1;
            }
            for (var i = 1; i <= 2; i++) {
                this.horoscope2 = this.owner.getChildByName("crystal2_" + i);
                this.horoscope2.visible = true;
                this.crystalArray2[i] = this.horoscope2;
            }
            this.audioBtn.on(Laya.Event.MOUSE_UP, this, this.onAudio);
            Laya.timer.loop(1600, this, this.onCrystalFloat);
            Laya.timer.loop(1000, this, this.onCountDown);
        }
        onCountDown() {
            var dm = new Date().getUTCMinutes();
            var ds = new Date().getUTCSeconds();
            var seconds = parseInt(ds.toString());
            if (dm == 0) {
                var secondDigitMin = 0;
            }
            else if (dm >= 1 && dm <= 9) {
                var secondDigitMin = parseInt(dm.toString()[0]);
            }
            else {
                var secondDigitMin = parseInt(dm.toString()[1]);
            }
            var temp_min = secondDigitMin * 60 + seconds;
            var diff = 600 - temp_min;
            var diffMin = Math.floor(diff / 60);
            var diffSec = Math.floor(diff % 60);
            this.digitMinute.value = diffMin < 10 ? "0" + diffMin : "" + diffMin;
            this.digitSecond.value = diffSec < 10 ? "0" + diffSec : "" + diffSec;
            if (diffMin == 0 && diffSec == 6) {
                this.betTxt.text = "-";
                this.betTxt.fontSize = 30;
                Laya.timer.loop(1000, this, this.onAction);
            }
            else if (diffMin == 0 && (diffSec > 6 && diffSec <= 59)) {
                this.betTxt.text = "Close Bet";
                this.betTxt.fontSize = 25;
            }
            else if (diffMin == 9) {
                this.betTxt.text = "Wait";
                this.betTxt.fontSize = 30;
            }
            else if (diffMin != 0 && diffMin != 10) {
                this.betTxt.text = "Bet";
                this.betTxt.fontSize = 30;
            }
        }
        onCrystalFloat() {
            if (this.upPos) {
                for (var i = 1; i <= 10; i++) {
                    Laya.Tween.to(this.crystalArray1[i], { y: this.crystalArray1[i].y + 5 }, 1500, Laya.Ease.linearInOut);
                }
                for (var i = 1; i <= 2; i++) {
                    Laya.Tween.to(this.crystalArray2[i], { y: this.crystalArray2[i].y - 5 }, 1500, Laya.Ease.linearInOut);
                }
                this.upPos = false;
            }
            else {
                for (var i = 1; i <= 10; i++) {
                    Laya.Tween.to(this.crystalArray1[i], { y: this.crystalArray1[i].y - 5 }, 1500, Laya.Ease.linearInOut);
                }
                for (var i = 1; i <= 2; i++) {
                    Laya.Tween.to(this.crystalArray2[i], { y: this.crystalArray2[i].y + 5 }, 1500, Laya.Ease.linearInOut);
                }
                this.upPos = true;
            }
        }
        onAction() {
            this.actionNum.visible = true;
            this.actionNum.scale(30, 30);
            this.actionNum.alpha = .2;
            Laya.Tween.to(this.actionNum, { scaleX: 1, scaleY: 1, alpha: 1 }, 500, Laya.Ease.linearInOut);
            if (this.nActionNum <= 0) {
                if (this.nActionNum == 0) {
                    this.playSound('countdown_start', 1.0);
                    this.actionNum.text = "START";
                }
                else {
                    Laya.timer.clear(this, this.onAction);
                    this.actionNum.visible = false;
                    this.onGame();
                }
            }
            else {
                this.playSound('countdown_123', 0.5);
                this.actionNum.text = "" + this.nActionNum;
            }
            this.nActionNum--;
        }
        onGame() {
            Laya.timer.clear(this, this.onCrystalFloat);
            this.playSound('crystalTurn', 0.5);
            for (var i = 1; i <= 10; i++) {
                this.horoscope1 = this.owner.getChildByName("crystal1_" + i);
                this.horoscope1.visible = false;
                this.crystalArray1[i] = this.horoscope1;
            }
            for (var i = 1; i <= 2; i++) {
                this.horoscope2 = this.owner.getChildByName("crystal2_" + i);
                this.horoscope2.visible = false;
                this.crystalArray2[i] = this.horoscope2;
            }
            this.crystalTurnAnim.visible = true;
            this.crystalTurnAnim.play(0, false);
            this.crystalTurnAnim.on(Laya.Event.COMPLETE, this, this.onHold_1);
        }
        onHold_1() {
            this.crystalTurnAnim.visible = false;
            this.crystalTurnAnim.stop();
            this.whiteBg.alpha = 1;
            Laya.Tween.to(this.magicStone, { alpha: 1 }, 1500, Laya.Ease.linearInOut);
            Laya.timer.once(2000, this, this.onRandomStone);
        }
        onRandomStone() {
            Laya.Tween.to(this.whiteBg, { alpha: 0 }, 2000, Laya.Ease.linearInOut);
            this.resultPanel.visible = true;
            this.stone.visible = true;
            this.stone.y = 123;
            Laya.Tween.to(this.stone, { alpha: 1 }, 1500, Laya.Ease.linearInOut);
            this.playSound('result', 0.5);
            this.randomStone = Math.floor(Math.random() * 12);
            switch (this.randomStone) {
                case 0: {
                    this.stone.texture = "main/aries.png";
                    this.finalCrystalTxt.text = "ARIES";
                    break;
                }
                case 1: {
                    this.stone.texture = "main/taurus.png";
                    this.finalCrystalTxt.text = "TAURUS";
                    break;
                }
                case 2: {
                    this.stone.texture = "main/germini.png";
                    this.finalCrystalTxt.text = "GERMINI";
                    break;
                }
                case 3: {
                    this.stone.texture = "main/cancer.png";
                    this.finalCrystalTxt.text = "CANCER";
                    break;
                }
                case 4: {
                    this.stone.texture = "main/leo.png";
                    this.finalCrystalTxt.text = "LEO";
                    break;
                }
                case 5: {
                    this.stone.texture = "main/virgo.png";
                    this.finalCrystalTxt.text = "VIRGO";
                    break;
                }
                case 6: {
                    this.stone.texture = "main/libra.png";
                    this.finalCrystalTxt.text = "LIBRA";
                    break;
                }
                case 7: {
                    this.stone.texture = "main/scorpio.png";
                    this.finalCrystalTxt.text = "SCORPIO";
                    break;
                }
                case 8: {
                    this.stone.texture = "main/sagittarius.png";
                    this.finalCrystalTxt.text = "SAGITARIUS";
                    break;
                }
                case 9: {
                    this.stone.texture = "main/capricorn.png";
                    this.finalCrystalTxt.text = "CAPRICORN";
                    break;
                }
                case 10: {
                    this.stone.texture = "main/aquarius.png";
                    this.finalCrystalTxt.text = "AQUARIUS";
                    break;
                }
                default: {
                    this.stone.texture = "main/pisces.png";
                    this.finalCrystalTxt.text = "PISCES";
                    break;
                }
            }
            this.recordArray.unshift(this.randomStone);
            this.currentResultHour = new Date().getHours();
            this.currentResultMinute = new Date().getUTCMinutes();
            var tempHour = this.currentResultHour < 10 ? "0" + this.currentResultHour : "" + this.currentResultHour;
            var tempMin = this.currentResultMinute < 10 ? "0" + this.currentResultMinute : "" + this.currentResultMinute;
            this.recordTimeHourArray.unshift(tempHour);
            this.recordTimeMinArray.unshift(tempMin);
            var resultBox = this.owner.getChildByName("record_crystal");
            if (this.recordArray.length <= 6) {
                for (var i = 0; i < this.recordArray.length; i++) {
                    var result = resultBox.getChildByName("record_" + i);
                    result.loadImage("main/record_" + this.recordArray[i] + ".png");
                    var recordTime = result.getChildByName("time_" + i);
                    recordTime.text = "" + this.recordTimeHourArray[i] + " : " + this.recordTimeMinArray[i];
                }
            }
            else {
                this.recordArray.splice(this.recordArray.length - 1, 1);
                this.recordTimeHourArray.splice(this.recordTimeHourArray.length - 1, 1);
                this.recordTimeMinArray.splice(this.recordTimeMinArray.length - 1, 1);
                for (var i = 0; i < this.recordArray.length; i++) {
                    var result = resultBox.getChildByName("record_" + i);
                    result.loadImage("main/record_" + this.recordArray[i] + ".png");
                    var recordTime = result.getChildByName("time_" + i);
                    recordTime.text = "" + this.recordTimeHourArray[i] + " : " + this.recordTimeMinArray[i];
                }
            }
            Laya.timer.once(3000, this, this.onHold_2);
        }
        onHold_2() {
            Laya.Tween.to(this.stone, { y: 623 }, 5000, Laya.Ease.linearInOut);
            Laya.Tween.to(this.whiteBg, { alpha: 1 }, 6000, Laya.Ease.linearInOut);
            Laya.timer.once(6000, this, this.onHold_3);
        }
        onHold_3() {
            Laya.Tween.to(this.whiteBg, { alpha: 0 }, 3000, Laya.Ease.linearInOut);
            Laya.Tween.to(this.magicStone, { alpha: 0 }, 2000, Laya.Ease.linearInOut);
            Laya.Tween.to(this.magicLight, { alpha: 1 }, 2000, Laya.Ease.linearInOut);
            this.stone.alpha = 0;
            this.stone.visible = false;
            this.resultPanel.visible = false;
            this.character.visible = true;
            switch (this.randomStone) {
                case 0: {
                    this.character.texture = "main/character_aries.png";
                    break;
                }
                case 1: {
                    this.character.texture = "main/character_taurus.png";
                    break;
                }
                case 2: {
                    this.character.texture = "main/character_germini.png";
                    break;
                }
                case 3: {
                    this.character.texture = "main/character_cancer.png";
                    break;
                }
                case 4: {
                    this.character.texture = "main/character_leo.png";
                    break;
                }
                case 5: {
                    this.character.texture = "main/character_virgo.png";
                    break;
                }
                case 6: {
                    this.character.texture = "main/character_libra.png";
                    break;
                }
                case 7: {
                    this.character.texture = "main/character_scorpion.png";
                    break;
                }
                case 8: {
                    this.character.texture = "main/character_sagittarius.png";
                    break;
                }
                case 9: {
                    this.character.texture = "main/character_capricon.png";
                    break;
                }
                case 10: {
                    this.character.texture = "main/character_aquarius.png";
                    break;
                }
                default: {
                    this.character.texture = "main/character_pisces.png";
                    break;
                }
            }
            Laya.Tween.to(this.character, { alpha: 1 }, 3000, Laya.Ease.linearInOut);
            Laya.timer.once(5000, this, this.onHold_4);
        }
        onHold_4() {
            Laya.Tween.to(this.character, { alpha: 0 }, 6000, Laya.Ease.linearInOut);
            Laya.Tween.to(this.magicLight, { alpha: 0 }, 6000, Laya.Ease.linearInOut);
            Laya.Tween.to(this.whiteBg, { alpha: 1 }, 6000, Laya.Ease.linearInOut);
            Laya.timer.once(6500, this, this.onShow);
        }
        onShow() {
            Laya.Tween.to(this.whiteBg, { alpha: 0 }, 3000, Laya.Ease.linearInOut);
            this.magic.visible = true;
            this.finalCrystal.visible = true;
            this.finalCrystal.texture = this.stone.texture;
            this.finalCrystalBlurTxt.text = this.finalCrystalTxt.text;
            Laya.Tween.to(this.finalCrystal, { alpha: 1 }, 3000, Laya.Ease.linearInOut);
            Laya.timer.loop(1600, this, this.onFinalCrystalFloat);
            Laya.timer.once(16000, this, this.onStart);
            Laya.Tween.to(this.whiteBg, { alpha: 1 }, 3000, Laya.Ease.linearInOut, null, 10000);
        }
        onFinalCrystalFloat() {
            if (this.crystalUpPos) {
                Laya.Tween.to(this.finalCrystal, { y: this.finalCrystal.y + 5 }, 1500, Laya.Ease.linearInOut);
                this.crystalUpPos = false;
            }
            else {
                Laya.Tween.to(this.finalCrystal, { y: this.finalCrystal.y - 5 }, 1500, Laya.Ease.linearInOut);
                this.crystalUpPos = true;
            }
        }
        onAudio() {
            this.playSound('press_but', 0.5);
            if (this.audioStatus == true) {
                this.audioStatus = false;
                this.audioBtn.skin = "main/btn_audio_off.png";
                this.playTime = this.soundChannel.position;
                this.soundChannel.stop();
            }
            else if (this.audioStatus == false) {
                this.audioStatus = true;
                this.audioBtn.skin = "main/btn_audio_on.png";
                var soundUrl = "res/sound/" + this.currentMusic + ".mp3";
                this.soundChannel = Laya.SoundManager.playMusic(soundUrl, 0, null, this.playTime);
            }
            Laya.SoundManager.soundMuted = !this.audioStatus;
        }
        playMusic(soundName) {
            this.soundChannel = Laya.SoundManager.playMusic("res/sound/" + soundName + ".mp3", 0);
            Laya.SoundManager.useAudioMusic = false;
        }
        playSound(soundName, soundVolume) {
            Laya.SoundManager.setSoundVolume(soundVolume);
            Laya.SoundManager.playSound("res/sound/" + soundName + ".mp3", 1);
        }
    }

    class GameConfig {
        constructor() { }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("Loading.ts", Loading);
            reg("GameManager.ts", GameManager);
        }
    }
    GameConfig.width = 1066;
    GameConfig.height = 600;
    GameConfig.scaleMode = "showall";
    GameConfig.screenMode = "horizontal";
    GameConfig.alignV = "middle";
    GameConfig.alignH = "center";
    GameConfig.startScene = "loading.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError(true);
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
