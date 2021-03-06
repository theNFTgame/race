function jsonpCallback(data){
    
    console.dir(data);
    
    MW.TOP10_t = data;
    cc.log(MW.TOP10_t);
    cc.log(MW.TOP10);
    var a = listSortBy(MW.TOP10_t, 'value01', 'desc');
    cc.log(a[0]);
    var b = listSortBy(MW.GiftRecord , 'age',  'desc');
    cc.log(b);
}

var script = document.createElement('script');
script.src = 'http://wegift.reconnectplatform.com/racegame/operator?action=get_global_ranking&game_name=RaceGame&limit=10&jsoncallback=jsonpCallback';
document.getElementsByTagName('head')[0].appendChild(script);

function listSortBy(arr, field, order){
    var refer = [],
        result=[],
        order = order=='asc'?'asc':'desc',
        index;
    for(i=0; i<arr.length; i++){
        refer[i] = arr[i][field]+':'+i;
    }
    refer.sort();
    if(order=='desc') refer.reverse();
    for(i=0;i<refer.length;i++){
        index = refer[i].split(':')[1];
        result[i] = arr[index];
    }
    return result;
}


var GameOver = cc.Layer.extend({
    _ship:null,
    _lbScore:0,

    init:function () {
        var bRet = false;
        if (this._super()) {
            cc.SpriteFrameCache.getInstance().addSpriteFrames(res.textureBTN_plist);

            var sp = cc.Sprite.create(res.bg_gameover_jpg);
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
            if (MW.TOP10[9].value01 >= MW.SCORE ){
                // show btn ...
                var playAgainNormal = cc.Sprite.createWithSpriteFrameName('btn_replay.png');
                var playAgainSelected = cc.Sprite.createWithSpriteFrameName('btn_replay.png');
                var playAgainDisabled = cc.Sprite.createWithSpriteFrameName('btn_replay.png');
                playAgainNormal.setScale(0.5);
                playAgainSelected.setScale(0.5);
                playAgainDisabled.setScale(0.5);
                

                

                var playAgain = cc.MenuItemSprite.create(playAgainNormal, playAgainSelected, playAgainDisabled, function(){
                    flareEffect(flare,this,this.onPlayAgain);
                }.bind(this) );
                var menu = cc.Menu.create(playAgain);
                this.addChild(menu, 1, 2);
                menu.setPosition(winSize.width / 2 - 60 , 220);

                // btn share
                var b0 = cc.Sprite.createWithSpriteFrameName('btn_share.png');
                b0.setScale(0.5);
                var menu0 = cc.MenuItemLabel.create(b0,function(){
                    window.location.href = "share.html";
                });
                var overMenu0 = cc.Menu.create(menu0);
                overMenu0.setPosition(winSize.width / 2 + 40 ,220);
                this.addChild(overMenu0);


                // var b1 = cc.LabelTTF.create("open google","Arial",14);
                var b1 = cc.Sprite.createWithSpriteFrameName('btn_ranklist.png');
                b1.setScale(0.5);
                var menu1 = cc.MenuItemLabel.create(b1,function(){
                    window.location.href = "rank.html";
                });
                var overMenu = cc.Menu.create(menu1);
                overMenu.setPosition(winSize.width / 2 + 140,220);
                this.addChild(overMenu);

                // 了解道具拿到最多的类型
                var b = listSortBy(MW.GiftRecord , 'age',  'desc');
                // cc.log(b);
                var mostGiftType = b[0].type;
                // cc.log('mostGiftType:' + mostGiftType);

                var thisGift = GiftType[mostGiftType];
                var NewTitleImage = thisGift.btnPng;
                this.titleScore = cc.Sprite.createWithSpriteFrameName(NewTitleImage);
                // this.titleScore = cc.Sprite.createWithSpriteFrameName('car_smooth_txt.png');
                this.titleScore.setPosition(winSize.width /2 , winSize.height - 190);
                this.titleScore.setScale(0.5);
                this.addChild(this.titleScore, 1020);



            }else{
                
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

                var newGameNormal = cc.Sprite.createWithSpriteFrameName('btn_start.png');
                var newGameSelected = cc.Sprite.createWithSpriteFrameName('btn_start.png');
                var newGameDisabled = cc.Sprite.createWithSpriteFrameName('btn_start.png');
                newGameNormal.setScale(0.5);
                newGameSelected.setScale(0.5);
                newGameDisabled.setScale(0.5);

                var newGame = cc.MenuItemSprite.create(newGameNormal, newGameSelected, newGameDisabled, function () {
                    // this.onButtonEffect();
                    flareEffect(flare, this, this.onRankList);
                }.bind(this));
                var menu  =  cc.Menu.create(newGame);
                menu.alignItemsVerticallyWithPadding(10);
                this.addChild(menu, 1, 2);
                menu.setPosition(winSize.width / 2 + 50, winSize.height / 2 - 100);


            }
            


            



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


            if(MW.SOUND){
                cc.AudioEngine.getInstance().playMusic(res.mainMainMusic_mp3);
            }

            bRet = true;
        }
        return bRet;
    },
    onPlayAgain:function (pSender) {
        var scene = cc.Scene.create();
        scene.addChild(GameLayer.create());
        scene.addChild(GameControlMenu.create());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2,scene));
    },
    onSubmitScore:function (pSender) {
        var scene = cc.Scene.create();
        scene.addChild(GameLayer.create());
        scene.addChild(GameControlMenu.create());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2,scene));
    },
    editBoxTextChanged: function (editBox, text) {
        cc.log("editBox " + this._getEditBoxName(editBox) + ", TextChanged, text: " + text);
    },

    editBoxReturn: function (editBox) {
        cc.log("editBox " + this._getEditBoxName(editBox) + " was returned !");
    },
    _getEditBoxName :function(editBox){
        if (this._box4 == editBox) {
            return "box4";
        }
        return "Unknown EditBox";
    },
    onRankList:function (pSender) {
        //load resources
        // cc.LoaderScene.preload(g_maingame, function () {
            var scene = cc.Scene.create();
            scene.addChild(RankList.create());
            cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
        // }, this);
    },
});

GameOver.create = function () {
    var sg = new GameOver();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};

GameOver.scene = function () {
    var scene = cc.Scene.create();
    var layer = GameOver.create();
    scene.addChild(layer);
    return scene;
};
