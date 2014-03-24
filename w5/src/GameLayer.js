//
// MoonWarriors
//
// Handles the Game Logic
//

STATE_PLAYING = 0;
STATE_GAMEOVER = 1;
MAX_CONTAINT_WIDTH = 20;
MAX_CONTAINT_HEIGHT = 40;

var g_sharedGameLayer;

var GameLayer = cc.Layer.extend({
    _time:null,
    _ship:null,
    _backSky:null,
    _backSkyHeight:0,
    _backSkyRe:null,
    _levelManager:null,
    _tmpScore:0,
    _isBackSkyReload:false,
    _isBackTileReload:false,
    lbScore:null,
    screenRect:null,
    explosionAnimation:[],
    _beginPos:cc.p(0, 0),
    _state:STATE_PLAYING,
    _explosions:null,
    _texOpaqueBatch:null,
    _texTransparentBatch:null,

    init:function () {
        var bRet = false;
        if (this._super()) {

            cc.SpriteFrameCache.getInstance().addSpriteFrames(res.textureOpaquePack_plist);
            cc.SpriteFrameCache.getInstance().addSpriteFrames(res.b01_plist);
            cc.SpriteFrameCache.getInstance().addSpriteFrames(res.textureBTN_plist);

            // reset global values
            MW.CONTAINER.ENEMIES = [];
            MW.CONTAINER.GIFTS = [];
            MW.CONTAINER.ENEMY_BULLETS = [];
            MW.CONTAINER.PLAYER_BULLETS = [];
            MW.CONTAINER.EXPLOSIONS = [];
            MW.CONTAINER.SPARKS = [];
            MW.CONTAINER.HITS = [];
            MW.CONTAINER.BACKSKYS = [];
            MW.CONTAINER.BACKTILEMAPS = [];
            MW.ACTIVE_ENEMIES = 0;
            MW.ACTIVE_GIFTS = 0;
            MW.GIFT_Countdown = 0;
            MW.GIFT_ActiveType = null;
            MW.GiftRecord = [
                    {type:0, age:0},
                    {type:1, age:0},
                    {type:2, age:0},
                    {type:3, age:0}
                ];

            MW.SCORE = 0;
            MW.LIFE = 1;
            this._state = STATE_PLAYING;
            MW.tempSpeed = -1;

            MW.Track = [3,3,3,3];
            MW.Track_Position = [winSize.height,winSize.height,winSize.height,winSize.height];


            // OpaqueBatch
            var texOpaque = cc.TextureCache.getInstance().addImage(res.textureOpaquePack_png);
            this._texOpaqueBatch = cc.SpriteBatchNode.createWithTexture(texOpaque);
            this._texOpaqueBatch.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
            this.addChild(this._texOpaqueBatch);

            // TransparentBatch
            var texTransparent = cc.TextureCache.getInstance().addImage(res.textureTransparentPack_png);
            this._texTransparentBatch = cc.SpriteBatchNode.createWithTexture(texTransparent);
            this.addChild(this._texTransparentBatch);

            // // CarsBath
            // var carTransparent = cc.TextureCache.getInstance().addImage(res.textureCars_png);
            // this._texCarBatch = cc.SpriteBatchNode.createWithTexture(carTransparent);
            // this.addChild(this._texTransparentBatch);


            winSize = cc.Director.getInstance().getWinSize();
            this._levelManager = new LevelManager(this);

            this.screenRect = cc.rect(0, 0, winSize.width, winSize.height + 10);

            // 记分牌
            // score
            this.lbScoreBoard = cc.Sprite.create(res.ScoreBoard_png );
            this.lbScoreBoard.setScale(0.5);
            this.lbScoreBoard.setAnchorPoint(0,0);
            this.addChild(this.lbScoreBoard, 1000);


            this.lbScoreIcon_a = cc.Sprite.createWithSpriteFrameName(GiftType[0].sbPng);
            this.lbScoreIcon_a.setPosition(winSize.width - 50, winSize.height - 200);
            this.lbScoreIcon_a.setScale(0.5);
            this.lbScoreIcon_a.setAnchorPoint(1, 0);
            this.addChild(this.lbScoreIcon_a, 1110);

            this.lbScoreIcon_b = cc.Sprite.createWithSpriteFrameName(GiftType[1].sbPng);
            this.lbScoreIcon_b.setPosition(winSize.width - 10 , winSize.height - 200);
            this.lbScoreIcon_b.setScale(0.5);
            this.lbScoreIcon_b.setAnchorPoint(1, 0);
            this.addChild(this.lbScoreIcon_b, 1110);

            this.lbScoreIcon_c = cc.Sprite.createWithSpriteFrameName(GiftType[2].sbPng);
            this.lbScoreIcon_c.setPosition(winSize.width - 50 , winSize.height - 240);
            this.lbScoreIcon_c.setScale(0.5);
            this.lbScoreIcon_c.setAnchorPoint(1, 0);
            this.addChild(this.lbScoreIcon_c, 1110);

            this.lbScoreIcon_d = cc.Sprite.createWithSpriteFrameName(GiftType[3].sbPng);
            this.lbScoreIcon_d.setPosition(winSize.width - 10 , winSize.height - 240);
            this.lbScoreIcon_d.setScale(0.5);
            this.lbScoreIcon_d.setAnchorPoint(1, 0);
            this.addChild(this.lbScoreIcon_d, 1110);

            // cc.log(this.lbScoreIcon_3);

            // this.lbScore = cc.LabelBMFont.create(" 0 ", res.arial_14_fnt);

            this.lbScore = cc.LabelTTF.create(""+MW.SCORE + " M","Arial Bold",12);
            this.lbScore.setColor(cc.c3b(0,0,0));
            this.lbScore.setAnchorPoint(1, 0);
            // this.lbScore.setAlignment(cc.TEXT_ALIGNMENT_RIGHT);
            this.addChild(this.lbScore, 1110);
            this.lbScore.setPosition(winSize.width - 20, winSize.height - 140);


            // gift title
            // this.titleScore = cc.Sprite.createWithSpriteFrameName('car_smooth_txt.png');
            // this.titleScore.setPosition(winSize.width /2 + 100 , winSize.height - 90);
            // this.titleScore.setScale(0.5);
            // this.addChild(this.titleScore, 1020);
            // this.titleScore.setVisible(false);

            // // ship life
            // var life = cc.Sprite.createWithSpriteFrameName("ship01.png");
            // life.setScale(0.6);
            // life.setPosition(30, 460);
            // this._texTransparentBatch.addChild(life, 1, 5);

            // // ship Life count
            // this._lbLife = cc.LabelTTF.create("0", "Arial", 20);
            // this._lbLife.setPosition(60, 463);
            // this._lbLife.setColor(cc.c3b(255, 0, 0));
            // this.addChild(this._lbLife, 1000);

            // ship
            this._ship = new Ship();
            this._texTransparentBatch.addChild(this._ship, this._ship.zOrder, MW.UNIT_TAG.PLAYER);

            // explosion batch node
            cc.SpriteFrameCache.getInstance().addSpriteFrames(res.explosion_plist);
            var explosionTexture = cc.TextureCache.getInstance().addImage(res.explosion_png);
            this._explosions = cc.SpriteBatchNode.createWithTexture(explosionTexture);
            this._explosions.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
            this.addChild(this._explosions);
            Explosion.sharedExplosion();

            // accept touch now!

            if (sys.capabilities.hasOwnProperty('keyboard'))
                this.setKeyboardEnabled(true);

            if (sys.capabilities.hasOwnProperty('mouse'))
            /*if ('mouse' in sys.capabilities)*/
                this.setMouseEnabled(true);

            if (sys.capabilities.hasOwnProperty('touches'))
            // //if ('touches' in sys.capabilities)
                this.setTouchEnabled(true);

            if (sys.capabilities.hasOwnProperty('accelerometer')){
                this.setAccelerometerEnabled(true);
                this.setAccelerometerInterval(1/60);
                this.prevX = 0;
                this.prevY = 0;
            }
            /*if ('accelerometer' in sys.capabilities)*/
                
            


            // cc.log(sys.capabilities);
            // schedule
            this.scheduleUpdate();
            this.schedule(this.scoreCounter, 1);

            if (MW.SOUND) {
                cc.AudioEngine.getInstance().playMusic(res.bgMusic_mp3, true);
            }

            bRet = true;

            g_sharedGameLayer = this;

            //pre set
            // Bullet.preSet();
            Enemy.preSet();
            HitEffect.preSet();
            SparkEffect.preSet();
            Explosion.preSet();
            BackSky.preSet();
            Gift.preSet();
            // BackTileMap.preSet();

            this.initBackground();
        }
        return bRet;
    },

    scoreCounter:function () {
        if (this._state == STATE_PLAYING) {
            this._time++;
            this._levelManager.loadLevelResource(this._time);
        }
    },

    onTouchesMoved:function (touches, event) {
        // cc.log(touches[0]);
        this.processEvent(touches[0]);
    },

    onMouseDragged:function (event) {
        this.processEvent(event);
    },

    onAccelerometer:function(accelEvent) {
        
        var w = winSize.width;
        var h = winSize.height;

        var x = w * accelEvent.x + w/2;
        var y = h * accelEvent.y + h/2;

        // Low pass filter
        x = x*0.2 + this.prevX*0.8;
        y = y*0.2 + this.prevY*0.8;

        this.prevX = x;
        this.prevY = y;
        
        if (this._state == STATE_PLAYING) {

            // cc.log('Accel x: '+ accelEvent.x + ' y:' + accelEvent.y + ' z:' + accelEvent.z + ' time:' + accelEvent.timestamp + ', winSize:' + winSize.width + ',\n this.prevX:' + this.prevX + ', this.prevX:' + this.prevX + '\n x:' + x + ',y:' + y);

            x = Math.max( 110 , Math.min( x, 210) );

            y = Math.max( 30 , Math.min( y , winSize.height - 90) );
            
            // this._ship.setPosition(cc.p(x,y));
            // cc.log(this._ship.setPosition());
            // cc.log('setPosition by onAccelerometer!');

        }
    },

    processEvent:function (event) {
        if (this._state == STATE_PLAYING) {
            var delta = event.getDelta();
            var curPos = this._ship.getPosition();
            curPos = cc.pAdd(curPos, delta);
            curPos = cc.pClamp(curPos, cc.POINT_ZERO, cc.p(winSize.width, winSize.height));
            curPos.x = Math.max( 110 , Math.min( curPos.x , 210) );
            curPos.y = Math.max( 10 , Math.min( curPos.y , winSize.height - 90) );
            this._ship.setPosition(curPos);
        }
    },

    onKeyDown:function (e) {
        MW.KEYS[e] = true;
    },

    onKeyUp:function (e) {
        MW.KEYS[e] = false;
    },

    update:function (dt) {
        if (this._state == STATE_PLAYING) {
            this.checkIsCollide();
            this.removeInactiveUnit(dt);
            this.checkIsReborn();
            this.checkGiftStatus();
            this.updateUI();
            this._movingBackground(dt);
        }
    },
    checkGiftStatus:function () {
        // cc.log(this);
        // cc.log(MW.CONTAINER.GIFTS);
        // cc.log(MW.ACTIVE_GIFTS);
    },
    checkIsCollide:function () {
        var selChild, bulletChild, giftChild;
        // check collide

        // 检测碰撞
        var i, locShip =this._ship;

        for (i = 0; i < MW.CONTAINER.ENEMIES.length; i++) {
            selChild = MW.CONTAINER.ENEMIES[i];
            if (!selChild.active)
                continue;

            // check enemies collide:
            var p = selChild.getPosition();
            for ( j = i+1; j < MW.CONTAINER.ENEMIES.length; j++){
                var subSelChild = MW.CONTAINER.ENEMIES[j];
                var p2  = subSelChild.getPosition();

                if ( Math.abs(p.x - p2.x) < 10 &&  Math.abs(p.y - p2.y) < 10 &&  p.y > 500) {
                    cc.log('i:'+ i + ',j:' + j +',p.x:' + p.x + ',p.y:' + p.y + ',p2.x' + p2.x + ',p2.y:' + p2.y);

                    subSelChild.goaway();
                }
            }

            // for type 
            if (MW.GIFT_ActiveType === 1){
                // selChild.hurt();
            }
            // for (var j = 0; j < MW.CONTAINER.PLAYER_BULLETS.length; j++) {
            //     bulletChild = MW.CONTAINER.PLAYER_BULLETS[j];
            //     if (bulletChild.active && this.collide(selChild, bulletChild)) {
            //         bulletChild.hurt();
            //         selChild.hurt();
            //     }
            // }
            if (this.collide(selChild, locShip)) {
                if (locShip.active) {
                    
                    if (MW.GIFT_ActiveType !== 1 && MW.GIFT_ActiveType !== 2 ){
                        selChild.hurt();
                    }
                    // cc.log('check MW.GIFT_ActiveType:' + MW.GIFT_ActiveType);
                    if( MW.GIFT_ActiveType !== null && MW.GIFT_ActiveType !== 0){
                        // MW.GIFT_ActiveType = null;
                    }else{
                        // cc.log('car hp: ' + MW.HP );
                        this.active = false;
                        locShip.hurt();
                    }
                }
            }
        }
        for (i = 0; i < MW.CONTAINER.GIFTS.length; i++) {
            selChild = MW.CONTAINER.GIFTS[i];

            if(!MW.GIFT_ActiveType){}else{
                selChild.goaway();
            }
            if (!selChild.active)
                continue;

            if (this.collide(selChild, locShip)) {
                if (locShip.active) {
                    // hurt only type 3
                    if( selChild.giftType == 3 ){
                        selChild.hurt();
                    }else{
                        selChild.goaway();
                    }
                    
                    // locShip.hurt();
                    MW.GIFT_ActiveType = selChild.giftType;
                    // cc.log('GIFT_ActiveType:'+ MW.GIFT_ActiveType);
                    // set up gift status
                    var thisGift = GiftType[selChild.giftType];
                    var NewTitleImage = thisGift.txtPng;
                    // var NewBoardIcon = thisGift.sbOnPng;
                    var NewBoardIcon = thisGift.textureName;
                    // cc.log('gift title :' + NewTitleImage);
                    this.titleScore = cc.Sprite.createWithSpriteFrameName(NewTitleImage);
                    // this.titleScore = cc.Sprite.createWithSpriteFrameName('car_smooth_txt.png');
                    this.titleScore.setPosition(winSize.width /2 , winSize.height - 90);
                    this.titleScore.setScale(0.5);
                    this.addChild(this.titleScore, 1020);
                    // this.titleScore.setVisible(false);

                    MW.GiftRecord[selChild.giftType].age++;


                    switch (MW.GIFT_ActiveType) {
                        case 0:
                            // MW.LIFE = 2;
                            this.lbScoreIcon_a.setVisible(false);
                            locShip.hpMax(2,MW.GIFT_ActiveType);
                            this.lbScoreIcon_a_on = cc.Sprite.createWithSpriteFrameName(NewBoardIcon);
                            this.lbScoreIcon_a_on.setPosition(winSize.width - 50, winSize.height - 200);
                            this.lbScoreIcon_a_on.setScale(0.35);
                            this.lbScoreIcon_a_on.setAnchorPoint(1, 0);
                            this.addChild(this.lbScoreIcon_a_on, 1110);
                        break;
                        case 1:
                            // MW.LIFE = 99999;
                            this.lbScoreIcon_b.setVisible(false);
                            locShip.hpMax(99999,MW.GIFT_ActiveType);
                            this.lbScoreIcon_b_on = cc.Sprite.createWithSpriteFrameName(NewBoardIcon);
                            this.lbScoreIcon_b_on.setPosition(winSize.width - 10 , winSize.height - 200);
                            this.lbScoreIcon_b_on.setScale(0.35);
                            this.lbScoreIcon_b_on.setAnchorPoint(1, 0);
                            this.addChild(this.lbScoreIcon_b_on, 1110);


                        break;
                        case 2:
                            this.lbScoreIcon_c.setVisible(false);
                            locShip.hpMax(1,MW.GIFT_ActiveType);
                            this.lbScoreIcon_c_on = cc.Sprite.createWithSpriteFrameName(NewBoardIcon);
                            this.lbScoreIcon_c_on.setPosition(winSize.width - 50 , winSize.height - 240);
                            this.lbScoreIcon_c_on.setScale(0.35);
                            this.lbScoreIcon_c_on.setAnchorPoint(1, 0);
                            this.addChild(this.lbScoreIcon_c_on, 1110);


                        break;
                        case 3:
                            this.lbScoreIcon_d.setVisible(false);
                            locShip.hpMax(99999,MW.GIFT_ActiveType);
                            this.lbScoreIcon_d_on = cc.Sprite.createWithSpriteFrameName(NewBoardIcon);
                            this.lbScoreIcon_d_on.setPosition(winSize.width - 10 , winSize.height - 240);
                            this.lbScoreIcon_d_on.setScale(0.35);
                            this.lbScoreIcon_d_on.setAnchorPoint(1, 0);
                            this.addChild(this.lbScoreIcon_d_on, 1110);
                        break;
                    }
                    this.scheduleOnce(this.removeGiftTitle,3);
                    this.scheduleOnce(this.timeCallback,6);
                    // TODO add gift title 动画



                    // cc.log('get the gift! Type: ' + selChild.giftType );
                    // cc.log('car life: ' + MW.LIFE);
                }
            }
        }

        // for (i = 0; i < MW.CONTAINER.ENEMY_BULLETS.length; i++) {
        //     selChild = MW.CONTAINER.ENEMY_BULLETS[i];
        //     if (selChild.active && this.collide(selChild, locShip)) {
        //         if (locShip.active) {
        //             selChild.hurt();
        //             locShip.hurt();
        //         }
        //     }
        // }
    },
    removeInactiveUnit:function (dt) {
        var selChild, children = this._texOpaqueBatch.getChildren();
        for (var i in children) {
            selChild = children[i];
            if (selChild && selChild.acdtive)
                selChild.update(dt);
        }

        children = this._texTransparentBatch.getChildren();
        for (i in children) {
            selChild = children[i];
            if (selChild && selChild.active)
                selChild.update(dt);
        }
    },
    removeGiftTitle:function(){
        this.titleScore.setVisible(false);
    },
    timeCallback:function(){
        var locShip = this._ship;
        cc.log('timeCallback, clean gift.');
        locShip.backNormal(1);
        this.titleScore.setVisible(false);
        if(!this.lbScoreIcon_a_on){}else{
            this.lbScoreIcon_a.setVisible(true);
            this.lbScoreIcon_a_on.setVisible(false);
        }
        if(!this.lbScoreIcon_b_on){}else{
            this.lbScoreIcon_b_on.setVisible(false);
        }
        if(!this.lbScoreIcon_c_on){}else{
            this.lbScoreIcon_c_on.setVisible(false);
        }
        if(!this.lbScoreIcon_d_on){}else{
            this.lbScoreIcon_d_on.setVisible(false);
        }
        this.lbScoreIcon_a.setVisible(true);
        this.lbScoreIcon_b.setVisible(true);
        this.lbScoreIcon_c.setVisible(true);
        this.lbScoreIcon_d.setVisible(true);
        switch (MW.GIFT_ActiveType) {
            case 0:
                this.lbScoreIcon_a_on.setVisible(false);
            break;
            case 1:
                this.lbScoreIcon_b_on.setVisible(false);
            break;
            case 2:
                this.lbScoreIcon_c_on.setVisible(false);
            break;
            case 3:
                this.lbScoreIcon_d_on.setVisible(false);
            break;
        }

        MW.GIFT_ActiveType = null;
    },
    checkIsReborn:function () {
        var locShip = this._ship;
        if (MW.LIFE > 0 && !locShip.active) {
            locShip.born();
        } else if (MW.LIFE <= 0 && !locShip.active) {
            this._state = STATE_GAMEOVER;
            // XXX: needed for JS bindings.
            this._ship = null;
            this.runAction(cc.Sequence.create(
                cc.DelayTime.create(0.2),
                cc.CallFunc.create(this.onGameOver, this)));
        }
    },
    updateUI:function () {
        if (this._tmpScore < MW.SCORE) {
            this._tmpScore += 1;
        }
        // this._lbLife.setString(MW.LIFE + '');
        this.lbScore.setString( this._tmpScore + " M");
    },
    collide:function (a, b) {
        var pos1 = a.getPosition();
        var pos2 = b.getPosition();
        if (Math.abs(pos1.x - pos2.x) > MAX_CONTAINT_WIDTH || Math.abs(pos1.y - pos2.y) > MAX_CONTAINT_HEIGHT)
            return false;

        var aRect = a.collideRect(pos1);
        var bRect = b.collideRect(pos2);
        return cc.rectIntersectsRect(aRect, bRect);
    },
    initBackground:function () {
        this._backSky = BackSky.getOrCreate();
        this._backSkyHeight = this._backSky.getContentSize().height;

        this.moveTileMap();
        this.schedule(this.moveTileMap, 5);
    },
    moveTileMap:function () {
        // var backTileMap = BackTileMap.getOrCreate();
        // var ran = Math.random();
        // backTileMap.setPosition(ran * 320, winSize.height);
        // var move = cc.MoveBy.create(ran * 2 + 10, cc.p(0, -winSize.height-240));
        // var fun =cc.CallFunc.create(function(){
        //     backTileMap.destroy();
        // },this);
        // backTileMap.runAction(cc.Sequence.create(move,fun));
    },

    _movingBackground:function(dt){

        // 这里改速度。
        // MW.tempSpeed -1 ~ -5.5
        // cc.log(MW.tempSpeed);
        MW.tempSpeed = Math.max(-6.5 ,(-Math.log(MW.SCORE)/3).toFixed(2));
        var movingDist = 80 * (-MW.tempSpeed ) * dt;       // background's moving rate is 16 pixel per second

        var locSkyHeight = this._backSkyHeight, locBackSky = this._backSky;
        var currPosY = locBackSky.getPositionY() - movingDist;
        var locBackSkyRe = this._backSkyRe;

        if(locSkyHeight + currPosY <= winSize.height){
             if(locBackSkyRe !== null)
                throw "The memory is leaking at moving background";
            locBackSkyRe = this._backSky;
            this._backSkyRe = this._backSky;

            //create a new background
            this._backSky = BackSky.getOrCreate();
            locBackSky = this._backSky;
            locBackSky.setPositionY(currPosY + locSkyHeight - 2);
        } else
            locBackSky.setPositionY(currPosY);

        if(locBackSkyRe){
            //locBackSkyRe
            currPosY = locBackSkyRe.getPositionY() - movingDist;
            if(currPosY + locSkyHeight < 0){
                locBackSkyRe.destroy();
                this._backSkyRe = null;
            } else
                locBackSkyRe.setPositionY(currPosY);
        }
    },

    onGameOver:function () {
        var scene = cc.Scene.create();
        scene.addChild(GameOver.create());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(0.5, scene));
    }
});

GameLayer.create = function () {
    var sg = new GameLayer();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};

GameLayer.scene = function () {
    var scene = cc.Scene.create();
    var layer = GameLayer.create();
    scene.addChild(layer, 1);
    return scene;
};

GameLayer.prototype.addEnemy = function (enemy, z, tag) {
    this._texTransparentBatch.addChild(enemy, z, tag);
};

GameLayer.prototype.addGift = function (gift, z, tag) {
    this._texTransparentBatch.addChild(gift, z, tag);
};

GameLayer.prototype.addExplosions = function (explosion) {
    this._explosions.addChild(explosion);
};

GameLayer.prototype.addBulletHits = function (hit, zOrder) {
    this._texOpaqueBatch.addChild(hit, zOrder);
};

GameLayer.prototype.addSpark = function (spark) {
    this._texOpaqueBatch.addChild(spark);
};

GameLayer.prototype.addBullet = function (bullet, zOrder, mode) {
    this._texOpaqueBatch.addChild(bullet, zOrder, mode);
};
