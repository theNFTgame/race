var shareLayer = document.getElementById('gameMask');

var shareLayerCloseer = document.getElementsByClassName('js-shareclose')[0];//js-shareclose
shareLayerCloseer.addEventListener("click", function (event) {
    cc.log('close share layer!');
    shareLayer.style.display = "none";
}, false);


var rankLayerList = document.getElementById('toplist');
var textRankList = '';

function generatRankList(data){
    var htmlCode = '<table>';
// index: 0
// name: "axing2"
// value01: 123456789
    for (var i = 0; i < data.length ; i++) {
        cc.log(data[i]);
        htmlCode = htmlCode + '<tr><td class="number">' + (data[i].index + 1) + '</td>';
        htmlCode = htmlCode + '<td class="name">' + data[i].name + '</td>';
        htmlCode = htmlCode + '<td class="value">' + data[i].value01 + '</td>';

    }
    htmlCode = htmlCode + '</tr></table>'

    return htmlCode;
}

function jsonpCallback(data){
    // cc.log('jsonpCallback');
    // cc.log(data);
    MW.TOP10_t = data;
    // if(!MW.TOP10_t.game_name){
    //     cc.log(rankLayerList);
    //     rankLayerList.innerHTML = MW.TOP10_t ;
    // }else{
    //      cc.log(MW.TOP10_t);
    // }
    // cc.log(MW.TOP10_t);
    // cc.log(MW.TOP10);
    // var 
    cc.log(MW.TOP10);
    MW.TOP10 = data;
    // MW.TOP10 = listSortBy(MW.TOP10_t, 'value01', 'desc');
    cc.log(MW.TOP10);
    var newlist = generatRankList(MW.TOP10);
    rankLayerList.innerHTML = newlist;
    cc.log(newlist);
    // cc.log(a[0]);
    // var b = listSortBy(MW.GiftRecord , 'age',  'desc');
    // // cc.log(b);
}
function jsonpPostback(data){
    MW.TOP10_t = data;
    // cc.log(data);
    // cc.log(MW.TOP10_t.global_ranking);
    // cc.log(MW.TOP10_t.img-code);
    // MW.TOP10 = listSortBy(MW.TOP10_t.global_ranking, 'value01', 'desc');
    // cc.log(MW.TOP10[9]);
    MW.TOP10 = MW.TOP10_t.global_ranking;

    
    if(!MW.TOP10_t.game_name){
    //     cc.log(rankLayerList);
    //     rankLayerList.innerHTML = MW.TOP10_t ;
    }else{
    //      cc.log(MW.TOP10_t);
        var newlist = generatRankList(MW.TOP10);
        rankLayerList.innerHTML = newlist;
    }
}

var script = document.createElement('script');
script.src = 'http://wegift.reconnectplatform.com/racegame/operator?action=get_global_ranking&game_name=RaceGame&limit=10&jsoncallback=jsonpCallback';
document.getElementsByTagName('head')[0].appendChild(script);




var rankLayer = document.getElementById('gameRank');

var rankLayerCloseer = document.getElementsByClassName('js-rankclose')[0];//js-shareclose
rankLayerCloseer.addEventListener("click", function (event) {
    cc.log('close rank layer!');
    rankLayer.style.display = "none";
}, false);


// // htmlRankList = MW.TOP10_t[0].value01;

// rankLayerList.innerHTML = "<table><tr>";

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

            var shareWord = 'http://service.weibo.com/share/share.php?title=';
            shareWord = shareWord + '%e6%88%91%e5%9c%a8%40%e5%be%b7%e5%9b%bd%e9%a9%ac%e7%89%8c%e8%bd%ae%e8%83%8e+%23%e8%b5%9b%e8%bd%a6%e6%b8%b8%e6%88%8f%23%e4%b8%ad%e9%a9%b0%e9%aa%8b%e4%ba%86';
            shareWord = shareWord + MW.SCORE ;
            shareWord = shareWord + '%e7%b1%b3%ef%bc%8c%e5%b9%b6%e6%88%90%e5%8a%9f%e7%95%99%e5%90%8d%e8%8b%b1%e9%9b%84%e6%a6%9c%e3%80%82%e6%83%b3%e7%9f%a5%e9%81%93%e4%bd%a0%e7%9a%84%e9%a9%be%e9%a9%b6%e9%a3%8e%e6%a0%bc%e5%90%97%ef%bc%9f%e6%83%b3%e8%b6%85%e8%bf%87%e6%88%91%ef%bc%8c%e4%b8%8e%e6%88%91%e4%b8%80%e8%be%83%e9%ab%98%e4%b8%8b%e5%90%97%ef%bc%9f%e8%af%b7%e7%82%b9%e5%87%bb%e6%b8%b8%e6%88%8f%e9%93%be%e6%8e%a5%ef%bc%8c%e6%88%96%e6%89%ab%e6%8f%8f%e4%ba%8c%e7%bb%b4%e7%a0%81%ef%bc%8c%e5%bc%80%e5%90%af%e7%b4%a7%e5%bc%a0%e3%80%81%e5%88%ba%e6%bf%80%e7%9a%84%e6%8c%91%e6%88%98%e5%90%a7%ef%bc%81';
            shareWord = shareWord + '&source=bookmark&appkey=&ralateUid=&pic=http%3a%2f%2fwegift.reconnectplatform.com%2fracegame%2foperator%3faction%3dget_score_by_img_code%26img-code%3d';
            shareWord = shareWord + '15634-405b3886';
            shareWord = shareWord + '&url=http%3a%2f%2fthenftgame.github.io%2frace%2fw3%2f';
      

                console.log(shareWord);
                // $('.getmore').attr('href', shareWord);
            var shareLink = document.getElementsByClassName('js-sharelink')[0];
            shareLink.setAttribute('href', shareWord);



            if (MW.TOP10[9].value01 >= MW.SCORE ){


                var lbScore = cc.LabelTTF.create(""+MW.SCORE + " M","Arial Bold",36);
                lbScore.setPosition(160,380);
                lbScore.setColor(cc.c3b(0,0,0));
                this.addChild(lbScore,10);


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
                menu.setPosition(winSize.width / 2 - 80 , 220);

                // btn share
                var b0 = cc.Sprite.createWithSpriteFrameName('btn_share.png');
                b0.setScale(0.5);
                var menu0 = cc.MenuItemLabel.create(b0,function(){
                    // window.location.href = "share.html";
                    cc.log('call share layer!');
                    shareLayer.style.display = "block";
                });
                var overMenu0 = cc.Menu.create(menu0);
                overMenu0.setPosition(winSize.width / 2 + 20 ,220);
                this.addChild(overMenu0);

                // btn rank
                var b1 = cc.Sprite.createWithSpriteFrameName('btn_ranklist.png');
                b1.setScale(0.5);
                var menu1 = cc.MenuItemLabel.create(b1,function(){
                    // window.location.href = "share.html";
                    cc.log('call rank layer!');
                    rankLayer.style.display = "block";
                });
                var overMenu1 = cc.Menu.create(menu1);
                overMenu1.setPosition(winSize.width / 2 + 120 ,220);
                this.addChild(overMenu1);

                // menu3 
                // var goRankListNormal = cc.Sprite.createWithSpriteFrameName('btn_ranklist.png');
                // var goRankListSelected = cc.Sprite.createWithSpriteFrameName('btn_ranklist.png');
                // var goRankListDisabled = cc.Sprite.createWithSpriteFrameName('btn_ranklist.png');
                // goRankListNormal.setScale(0.5);
                // goRankListSelected.setScale(0.5);
                // goRankListDisabled.setScale(0.5);

                // var goRankList = cc.MenuItemSprite.create(goRankListNormal, goRankListSelected, goRankListDisabled, function () {
                //     // this.onButtonEffect();
                //     flareEffect(flare, this, this.onRankList);
                // }.bind(this));
                // var goRankmenu = cc.Menu.create(goRankList);
                // goRankmenu.alignItemsVerticallyWithPadding(10);
                // this.addChild(goRankmenu, 1, 2);
                // goRankmenu.setPosition(winSize.width / 2 + 120,220);


                // var b1 = cc.LabelTTF.create("open google","Arial",14);
                // var b1 = cc.Sprite.createWithSpriteFrameName('btn_ranklist.png');
                // b1.setScale(0.5);
                // var menu1 = cc.MenuItemLabel.create(b1,function(){
                //     window.location.href = "rank.html";
                // });
                // var overMenu = cc.Menu.create(menu1);
                // overMenu.setPosition(winSize.width / 2 + 140,220);
                // this.addChild(overMenu);
                var gamePost = document.createElement('script');
                gamePost.src = 'http://wegift.reconnectplatform.com/racegame/operator?action=submit_game_score&game_name=RaceGame&player=noname&score='+ MW.SCORE +'&type=a&refresh=1&jsoncallback=jsonpPostback';
                document.getElementsByTagName('head')[0].appendChild(gamePost);

            }else{
                
                // show submint
                var box4 = cc.EditBox.create(cc.size(200, 40), cc.Scale9Sprite.createWithSpriteFrameName('btn_replay.png'));

                box4.setPlaceholderFontColor(cc.c3b(255, 0, 0));
                box4.setPlaceHolder("名字:");
                // box4.initWithBackgroundColor(cc.size(200, 40), cc.c3b(200, 20, 20));
                box4.setPosition( winSize.width / 2 , winSize.height / 2 - 100 );
                box4.setDelegate(this);
                box4.setFontColor(cc.c3b(200, 200, 200));
                box4.setMaxLength(20);
                this.addChild(box4);
                cc.log(box4);

                //res.RankTitle_png

                var RankTitle = cc.Sprite.create(res.RankTitle_png );
                RankTitle.setScale(0.5);
                RankTitle.setPosition(winSize.width / 2 , winSize.height / 2 + 100);
                this.addChild(RankTitle, 1000);

                var goRankListNormal = cc.Sprite.createWithSpriteFrameName('btn_start.png');
                var goRankListSelected = cc.Sprite.createWithSpriteFrameName('btn_start.png');
                var goRankListDisabled = cc.Sprite.createWithSpriteFrameName('btn_start.png');
                goRankListNormal.setScale(0.5);
                goRankListSelected.setScale(0.5);
                goRankListDisabled.setScale(0.5);

                var goRankList = cc.MenuItemSprite.create(goRankListNormal, goRankListSelected, goRankListDisabled, function () {
                    // this.onButtonEffect();
                    flareEffect(flare, this, this.onRankList);
                }.bind(this));
                var goRankmenu = cc.Menu.create(goRankList);
                goRankmenu.alignItemsVerticallyWithPadding(10);
                this.addChild(goRankmenu, 1, 2);
                goRankmenu.setPosition(winSize.width / 2 + 50, winSize.height / 2 - 100);


            }
            


            




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
        MW.playerName = text;
    },

    editBoxReturn: function (editBox) {
        cc.log("editBox " + this._getEditBoxName(editBox) + " was returned !");

        var gamePost = document.createElement('script');
                gamePost.src = 'http://wegift.reconnectplatform.com/racegame/operator?action=submit_game_score&game_name=RaceGame&player='+ MW.playerName +'&score='+ MW.SCORE +'&type=a&refresh=1&jsoncallback=jsonpPostback';
                document.getElementsByTagName('head')[0].appendChild(gamePost);

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
            // var scene = cc.Scene.create();
            // scene.addChild(RankList.create());
            // cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
        // }, this);
        cc.log('call rank layer!');
        rankLayer.style.display = "block";
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
