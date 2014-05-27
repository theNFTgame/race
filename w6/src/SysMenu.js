cc.dumpConfig();
function getCookie(c_name){
  if (document.cookie.length>0){
    c_start=document.cookie.indexOf(c_name + "=");
    if (c_start!=-1){
      c_start=c_start + c_name.length+1 ;
      c_end=document.cookie.indexOf(";",c_start);
      if (c_end==-1) c_end=document.cookie.length;
      return decodeURI(document.cookie.substring(c_start,c_end));
      }
    }
  return "";
}
// function handleOrientationEvent(event) {
        
//     var x = event.beta ? event.beta : event.y * 90;
//     var y = event.gamma ? event.gamma : event.x * 90;
//     //window.console && console.info('Raw position: x, y: ', x, y);
//     // MW.DeviceOrientation
//     if (!MW.DeviceOrientation){
//         MW.DeviceOrientation = {};
//     }
//     if (!MW.DeviceOrientation.initialX && !MW.DeviceOrientation.initialY) {
//         MW.DeviceOrientation.initialX = x;
//         MW.DeviceOrientation.initialY = y;
//         // cc.log('start DeviceOrientation!');
//     } else {
//         var positionX = MW.DeviceOrientation.initialX - x;
//         var positionY = MW.DeviceOrientation.initialY - y;

//         MW.DeviceOrientation.PostX = positionX;
//         MW.DeviceOrientation.PostY = positionY;
//         // cc.log(MW.DeviceOrientation.initialY);
//         // cc.log(event);
//     }
// }
// window.addEventListener("MozOrientation", handleOrientationEvent, true);
// window.addEventListener("deviceorientation", handleOrientationEvent, true);

var SysMenu = cc.Layer.extend({
    _ship:null,

    init:function () {
        var bRet = false;
        if (this._super()) {
            cc.SpriteFrameCache.getInstance().addSpriteFrames(res.textureTransparentPack_plist);

            cc.SpriteFrameCache.getInstance().addSpriteFrames(res.textureBTN_plist);

            winSize = cc.Director.getInstance().getWinSize();
            var sp = cc.Sprite.create(res.sysmenu_jpg);
            sp.setScale(0.5);
            sp.setAnchorPoint(0,0);
            this.addChild(sp, 0, 1);

            // var logo = cc.Sprite.create(res.logo_png);
            // logo.setAnchorPoint(0, 0);
            // logo.setPosition(0, 250);
            // this.addChild(logo, 10, 1);

            // var newGameNormal = cc.Sprite.createWithSpriteFrameName('btn_start.png');
            // var newGameSelected = cc.Sprite.createWithSpriteFrameName('btn_start.png');
            // var newGameDisabled = cc.Sprite.createWithSpriteFrameName('btn_start.png');
            var newGameNormal = cc.Sprite.create(res.btn_start_jpg);
            var newGameSelected = cc.Sprite.create(res.btn_start_jpg);
            var newGameDisabled = cc.Sprite.create(res.btn_start_jpg);

            newGameNormal.setScale(0.5);
            newGameSelected.setScale(0.5);
            newGameDisabled.setScale(0.5);

            var playerName = getCookie('nickname');
            // playerName ='欢迎回来';
            if( playerName !== undefined ){
                var yourName = cc.LabelTTF.create( playerName +  ", 欢迎回来","Arial Bold",13);
                yourName.setPosition(240,344);
                yourName.setColor(cc.c3b(250,250,250));
                this.addChild(yourName,10);
            }
            var playerTop = getCookie('playerTop');
            // playerTop = 11;
            if( playerTop !== undefined ){
                var yourTop = cc.LabelTTF.create(   "最佳战绩，第" + playerTop + "名","Arial Bold",13);
                yourTop.setPosition(240,323);
                yourTop.setColor(cc.c3b(250,250,250));
                this.addChild(yourTop,11);
            }
            // var newGameNormal = cc.Sprite.create(res.menu_png, cc.rect(0, 0, 126, 33));
            // var newGameSelected = cc.Sprite.create(res.menu_png, cc.rect(0, 33, 126, 33));
            // var newGameDisabled = cc.Sprite.create(res.menu_png, cc.rect(0, 33 * 2, 126, 33));

            // var gameSettingsNormal = cc.Sprite.create(res.menu_png, cc.rect(126, 0, 126, 33));
            // var gameSettingsSelected = cc.Sprite.create(res.menu_png, cc.rect(126, 33, 126, 33));
            // var gameSettingsDisabled = cc.Sprite.create(res.menu_png, cc.rect(126, 33 * 2, 126, 33));

            // var aboutNormal = cc.Sprite.create(res.menu_png, cc.rect(252, 0, 126, 33));
            // var aboutSelected = cc.Sprite.create(res.menu_png, cc.rect(252, 33, 126, 33));
            // var aboutDisabled = cc.Sprite.create(res.menu_png, cc.rect(252, 33 * 2, 126, 33));
            var flare = cc.Sprite.create(res.flare_jpg);
            this.addChild(flare);
            flare.setVisible(false);
            var newGame = cc.MenuItemSprite.create(newGameNormal, newGameSelected, newGameDisabled, function () {
                this.onButtonEffect();
                //this.onNewGame();
                // flareEffect(flare, this, this.onNewGame);
                // add new about
                flareEffect(flare, this, this.onAbout);
            }.bind(this));
            // var gameSettings = cc.MenuItemSprite.create(gameSettingsNormal, gameSettingsSelected, gameSettingsDisabled, this.onSettings, this);
            // var about = cc.MenuItemSprite.create(aboutNormal, aboutSelected, aboutDisabled, this.onAbout, this);

            var menu = cc.Menu.create(newGame);
            menu.alignItemsVerticallyWithPadding(10);
            this.addChild(menu, 1, 2);
            menu.setPosition(winSize.width , 196 );
            this.schedule(this.update, 0.1);

            // this._ship = cc.Sprite.createWithSpriteFrameName("car_00.png");
            // // this._ship = cc.Sprite.create(res.Cars, cc.rect(0, 0, 100, 200));
            // this._ship.setScale(0.5);
            // this.addChild(this._ship, 0, 4);
            // var pos = cc.p(80 + (winSize.width - 160) * Math.random(), 0);
            // this._ship.setPosition( pos );
            // this._ship.runAction(cc.MoveTo.create(2, cc.p(80 + (winSize.width - 160) * Math.random(), pos.y + winSize.height + 100)));

            // if (MW.SOUND) {
            //     cc.AudioEngine.getInstance().setMusicVolume(0.7);
            //     cc.AudioEngine.getInstance().playMusic(res.mainMainMusic_mp3, true);
            // }

            bRet = true;
        }
        return bRet;
    },
    onNewGame:function (pSender) {
        //load resources
        // cc.LoaderScene.preload(g_maingame, function () {
            var scene = cc.Scene.create();
            scene.addChild(GameLayer.create());
            scene.addChild(GameControlMenu.create());
            cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
        // }, this);
    },
    onSettings:function (pSender) {
        this.onButtonEffect();
        var scene = cc.Scene.create();
        scene.addChild(SettingsLayer.create());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
    },
    onAbout:function (pSender) {
        this.onButtonEffect();
        var scene = cc.Scene.create();
        scene.addChild(AboutLayer.create());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(0.2, scene));
    },
    update:function () {
        // if (this._ship.getPosition().y > 480) {
        //     var pos = cc.p(80 + (winSize.width - 160) * Math.random(), 10);
        //     this._ship.setPosition( pos );
        //     this._ship.runAction( cc.MoveTo.create(
        //         parseInt(5 * Math.random(), 10),
        //         cc.p(80 + (winSize.width - 160) * Math.random(), pos.y + 480)));
        // }
    },
    onButtonEffect:function(){
        if (MW.SOUND) {
            var s = cc.AudioEngine.getInstance().playEffect(res.buttonEffet_mp3);
        }
    }
});

SysMenu.create = function () {
    var sg = new SysMenu();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};

SysMenu.scene = function () {
    var scene = cc.Scene.create();
    var layer = SysMenu.create();
    scene.addChild(layer);
    return scene;
};
