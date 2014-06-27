


var RankList = cc.Layer.extend({
    _ship:null,
    _lbScore:0,

    init:function () {
        var bRet = false;
        if (this._super()) {
            cc.SpriteFrameCache.getInstance().addSpriteFrames(res.textureBTN_plist);

            var sp = cc.Sprite.create(res.bg_ranklist_jpg);
            sp.setScale(0.5);
            sp.setAnchorPoint(0,0);
            this.addChild(sp, 0, 1);

            // var logo = cc.Sprite.create(res.gameOver_png);
            // logo.setAnchorPoint(0,0);
            // logo.setPosition(0,300);
            // this.addChild(logo,10,1);

            var flare = cc.Sprite.create(res.flare_jpg);
            this.addChild(flare);
            flare.setVisible(false);

            cc.log(MW.TOP10[9].value01);

                
            // show submint
            var box4 = cc.EditBox.create(cc.size(200, 40), cc.Scale9Sprite.createWithSpriteFrameName('btn_replay.png'));
            cc.log(box4);
            box4.setPlaceholderFontColor(cc.c3b(255, 0, 0));
            box4.setPlaceHolder("名字:");
            box4.setPosition(winSize.width / 2 , 220);
            box4.setDelegate(this);
            box4.setFontColor(cc.c3b(20, 20, 20));
            box4.setMaxLength(20);
            this.addChild(box4);


            


            



            var lbScore = cc.LabelTTF.create(""+MW.SCORE + " M","Arial Bold",36);
            lbScore.setPosition(160,380);
            lbScore.setColor(cc.c3b(0,0,0));
            this.addChild(lbScore,10);

            // var b1 = cc.LabelTTF.create("Download Cocos2d-html5","Arial",14);
            // var b2 = cc.LabelTTF.create("Download This Sample","Arial",14);
            // var menu1 = cc.MenuItemLabel.create(b1,function(){
            //     window.location.href = "http://www.cocos2d-x.org/projects/cocos2d-x/wiki/Cocos2d-html5";
            // });
            // var menu2 = cc.MenuItemLabel.create(b2,function(){
            //     window.location.href = "https://github.com/ShengxiangChen/MoonWarriors";
            // });
            // var cocos2dMenu = cc.Menu.create(menu1,menu2);
            // cocos2dMenu.alignItemsVerticallyWithPadding(10);
            // cocos2dMenu.setPosition(160,80);
            // this.addChild(cocos2dMenu);
            var newGameNormal = cc.Sprite.createWithSpriteFrameName('btn_start.png');
            var newGameSelected = cc.Sprite.createWithSpriteFrameName('btn_start.png');
            var newGameDisabled = cc.Sprite.createWithSpriteFrameName('btn_start.png');
            newGameNormal.setScale(0.5);
            newGameSelected.setScale(0.5);
            newGameDisabled.setScale(0.5);

            var newGame = cc.MenuItemSprite.create(newGameNormal, newGameSelected, newGameDisabled, function () {
                // this.onButtonEffect();
                flareEffect(flare, this, this.onGoBack);
            }.bind(this));
            var menu = cc.Menu.create(newGame);
            menu.alignItemsVerticallyWithPadding(10);
            this.addChild(menu, 1, 2);
            menu.setPosition(winSize.width - 20, winSize.height  - 10);


            bRet = true;
        }
        return bRet;
    },
    onGoBack:function (pSender) {
        // var scene = cc.Scene.create();
        // scene.addChild(GameLayer.create());
        // scene.addChild(GameControlMenu.create());
        // cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2,scene));
        // this.runAction(cc.Sequence.create(
        //     cc.DelayTime.create(0.2),
        //     cc.CallFunc.create(this.onGameOver, this)));
        var scene = cc.Scene.create();
                scene.addChild(GameOver.create());
                scene.addChild(GameControlMenu.create());
                cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2,scene));
            }
});

RankList.create = function () {
    var sg = new RankList();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};

RankList.scene = function () {
    var scene = cc.Scene.create();
    var layer = RankList.create();
    scene.addChild(layer);
    return scene;
};
