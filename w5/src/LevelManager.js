    function fRandomBy(under, over){
        switch(arguments.length){
          case 1: return parseInt(Math.random()*under+1 );
          case 2: return parseInt(Math.random()*(over-under+1) + under );
          default: return 0;
        }
    }

var LevelManager = cc.Class.extend({
    _currentLevel:null,
    _gameLayer:null,
    ctor:function(gameLayer){
        if(!gameLayer){
            throw "gameLayer must be non-nil";
        }
        this._currentLevel = Level1;
        this._gameLayer = gameLayer;
        this.setLevel(this._currentLevel);
    },

    setLevel:function(level){
        var locCurrentLevelEnemies = this._currentLevel.enemies;
        for(var i = 0; i< level.enemies.length; i++)
            locCurrentLevelEnemies[i].ShowTime = this._minuteToSecond(locCurrentLevelEnemies[i].ShowTime);
        var locCurrentLevelGifts = this._currentLevel.gifts;
        for(var i = 0; i< level.gifts.length; i++)
            locCurrentLevelGifts[i].ShowTime = this._minuteToSecond(locCurrentLevelGifts[i].ShowTime);
    },
    _minuteToSecond:function(minuteStr){
        if(!minuteStr)
            return 0;
        if(typeof(minuteStr) !=  "number"){
            var mins = minuteStr.split(':');
            if(mins.length == 1){
                return parseInt(mins[0],10);
            }else {
                return parseInt(mins[0],10 )* 60 + parseInt(mins[1],10);
            }
        }
        return minuteStr;
    },

    loadLevelResource:function(deltaTime){
        // cc.log(this._currentLevel);
        if(MW.ACTIVE_ENEMIES>= this._currentLevel.enemyMax){
            return;
        }
        //load enemy
        var locCurrentLevel = this._currentLevel;
        for(var i = 0; i< locCurrentLevel.enemies.length; i++){
            var selEnemy = locCurrentLevel.enemies[i];
            if(selEnemy){
                if(selEnemy.ShowType === "Once"){
                    if(selEnemy.ShowTime == deltaTime){
                        for(var tIndex = 0; tIndex < selEnemy.Types.length;tIndex++ ){
                            this.addEnemyToGameLayer(selEnemy.Types[tIndex]);
                        }
                    }
                }else if(selEnemy.ShowType === "Repeate"){
                    if(deltaTime % selEnemy.ShowTime === 0){
                        for(var rIndex = 0; rIndex < selEnemy.Types.length;rIndex++ ){
                            this.addEnemyToGameLayer(selEnemy.Types[rIndex]);
                        }
                    }
                }
            }
        }
        // cc.log('MW.ACTIVE_GIFTS:' + MW.ACTIVE_GIFTS + ', this._currentLevel.giftMax:' + this._currentLevel.giftMax);
        if(MW.ACTIVE_GIFTS < this._currentLevel.giftMax){
            // cc.log(MW.GIFT_Countdown);
            var newGiftType = fRandomBy( 0, 100) ;
            var newGiftType ;
            var selGift = locCurrentLevel.gifts[0];
            if (newGiftType > 95){
                newGiftType = 2 ;
            }else if( newGiftType > 50 && newGiftType <=95 ){
                newGiftType = 0 ;
            }else if( newGiftType > 25 && newGiftType <=50 ){
                newGiftType = 1 ;
            }else if( newGiftType >= 0 && newGiftType <= 25 ){
                newGiftType = 3 ;
            }else {
                newGiftType = 3 ;
            }
            // cc.log(selGift);
            if ( MW.GIFT_Countdown >= 5 &&  MW.GIFT_ActiveType  == null) {
            // if ( MW.GIFT_Countdown >= 1) {
                this.addGiftToGameLayer(selGift.Types[newGiftType]);
                MW.GIFT_Countdown = 0;
            } else {
                MW.GIFT_Countdown++;
            }
            
            // for(var i = 0; i< locCurrentLevel.gifts.length; i++){
            //     // cc.log(locCurrentLevel.gifts[i]);
            //     var selGift = locCurrentLevel.gifts[i];
            //     // cc.log(selGift.Types);
            //     for(var rIndex = 0; rIndex < selGift.Types.length;rIndex++ ){
            //         this.addGiftToGameLayer(selGift.Types[rIndex]);
            //     }
            // }
        }
    },

    addEnemyToGameLayer:function(enemyType){
		var addEnemy = Enemy.getOrCreateEnemy(EnemyType[enemyType]);


        // Math.max(80, 180 * Math.random())
        var fromX = fRandomBy( 0, 3) ,
            fromY = winSize.height + Math.max(120, Math.min(50,13 * fRandomBy( 1, 9)));

        

        // if(  fromY - MW.Track_Position[fromX] < 90 ) {
        //     cc.log('return');
        //     cc.log('this track is :'+ fromX + '. old MW.Track_Position[fromX]:' + MW.Track_Position[fromX] + ', fromY: ' + fromY);
        //     return;
        // } else {
        //     MW.Track_Position[fromX] = fromY;
        // }
        // cc.log('check return');
        var enemypos = cc.p( 110 + fromX * 35 , fromY );

        
        var enemycs =  addEnemy.getContentSize();
        addEnemy.setPosition( enemypos );

        var offset, tmpAction;
        var a0=0;
        var a1=0;
        // cc.log(fromX);
        var maxSpeed = MW.Track[fromX];
        // MW.SCORE
        // cc.log(MW.Track );
        // cc.log('this track is :'+ fromX + '. old addEnemy.moveType:' + addEnemy.moveType + ', maxSpeed: ' + maxSpeed);
        // if( addEnemy.moveType >= maxSpeed ){
        //     addEnemy.moveType = maxSpeed;
        // }else{
        //     MW.Track[fromX] = addEnemy.moveType;
        // }
        // cc.log('new addEnemy.moveType:' + addEnemy.moveType);
        // MW.tempSpeed = 0;
        
        // cc.log(MW.tempSpeed);
        switch (addEnemy.moveType) {
            case MW.ENEMY_MOVE_TYPE.ATTACK:
                // offset = this._gameLayer._ship.getPosition();
                offset = cc.p(0, -winSize.height - 200);
                tmpAction = cc.MoveBy.create(9 + MW.tempSpeed, offset);
                break;
            case MW.ENEMY_MOVE_TYPE.VERTICAL:
                offset = cc.p(0, -winSize.height - 200);
                tmpAction = cc.MoveBy.create(7.8  + MW.tempSpeed, offset);
                break;
            case MW.ENEMY_MOVE_TYPE.VERTICAL2:
                offset = cc.p(0, -winSize.height - 200);
                tmpAction = cc.MoveBy.create(7  + MW.tempSpeed, offset);
                break;
            case MW.ENEMY_MOVE_TYPE.VERTICAL3:
                offset = cc.p(0, -winSize.height - 200);
                tmpAction = cc.MoveBy.create(6  + MW.tempSpeed, offset);
                break;
            case MW.ENEMY_MOVE_TYPE.HORIZONTAL:
                offset = cc.p(0, -100 - 200 * Math.random());
                a0 = cc.MoveBy.create(0.5, offset);
                a1 = cc.MoveBy.create(1, cc.p(-50 - 100 * Math.random(), 0));
                var onComplete = cc.CallFunc.create(function (pSender) {
                    var a2 = cc.DelayTime.create(1);
                    var a3 = cc.MoveBy.create(1, cc.p(100 + 100 * Math.random(), 0));
                    pSender.runAction(cc.RepeatForever.create(
                        cc.Sequence.create(a2, a3, a2.clone(), a3.reverse())
                    ));
                }.bind(addEnemy) );
                tmpAction = cc.Sequence.create(a0, a1, onComplete);
                break;
            case MW.ENEMY_MOVE_TYPE.OVERLAP:
                var newX = (enemypos.x <= winSize.width / 2) ? 320 : -320;
                a0 = cc.MoveBy.create(4, cc.p(newX, -240));
                a1 = cc.MoveBy.create(4,cc.p(-newX,-320));
                tmpAction = cc.Sequence.create(a0,a1);
                break;
        }

        // cc.log('i need check MW.GIFT_ActiveType:' + MW.GIFT_ActiveType );
        if(MW.GIFT_ActiveType === 2 ){
            offset = cc.p(0, - winSize.height - 300);
            tmpAction = cc.MoveBy.create(6, offset);
        }

        addEnemy.runAction(tmpAction);
    },
    addGiftToGameLayer:function(giftType){
        
        var addGift = Gift.getOrCreateGift(GiftType[giftType]);

        // 这里要改成只在某些赛道里出现
        // Math.max(80, 180 * Math.random())
        var fromX = fRandomBy( 0, 3) * 35 ;
        var giftpos = cc.p( 110 + fromX , winSize.height + Math.max(10, 130 * Math.random()));
        var giftcs =  addGift.getContentSize();
        addGift.setPosition( giftpos );
        // cc.log(addGift.getPosition());

        var offset, tmpAction;
        var a0=0;
        var a1=0;
        switch (addGift.moveType) {
            case MW.GIFT_MOVE_TYPE.ATTACK:
                // offset = this._gameLayer._ship.getPosition();
                offset = cc.p(0, -winSize.height - giftcs.height);
                tmpAction = cc.MoveBy.create(4, offset);
                break;
            case MW.GIFT_MOVE_TYPE.VERTICAL:
                offset = cc.p(0, -winSize.height - giftcs.height);
                tmpAction = cc.MoveBy.create(3, offset);
                break;
            case MW.GIFT_MOVE_TYPE.OVERLAP:
                var newX = (giftpos.x <= winSize.width / 2) ? 320 : -320;
                a0 = cc.MoveBy.create(4, cc.p(newX, -240));
                a1 = cc.MoveBy.create(4,cc.p(-newX,-320));
                tmpAction = cc.Sequence.create(a0,a1);
                break;
        }

        addGift.runAction(tmpAction);
    }

});
