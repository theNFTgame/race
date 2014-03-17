var Ship = cc.Sprite.extend({
    speed:220,
    bulletSpeed:MW.BULLET_SPEED.SHIP,
    HP:1,
    bulletTypeValue:1,
    bulletPowerValue:1,
    throwBombing:false,
    canBeAttack:true,
    isThrowingBomb:false,
    zOrder:3000,
    maxBulletPowerValue:4,
    appearPosition:cc.p(160, 60),
    _hurtColorLife:0,
    active:true,
    bornSprite:null,
    ctor:function () {
        this._super();

        //init life
        this.initWithSpriteFrameName("car_00.png");
        // this.initWithFile(res.Cars, cc.rect(0, 0, 100, 200));
        this.setTag(this.zOrder);
        this.setPosition(this.appearPosition);
        this.setScale(0.5);

        // // set frame
        // cc.log(cc.SpriteFrameCache.getInstance());
        // var frame0 = cc.SpriteFrameCache.getInstance().getSpriteFrameName("car_00.png");
        // var frame1 = cc.SpriteFrameCache.getInstance().getSpriteFrameName("car_01.png");

        // var animFrames = [];
        // animFrames.push(frame0);
        // animFrames.push(frame1);

        // // ship animate
        // var animation = cc.Animation.create(animFrames, 0.1);
        // var animate = cc.Animate.create(animation);
        // this.runAction(cc.RepeatForever.create(animate));
        // this.schedule(this.shoot, 1 / 6);

        this.initBornSprite();
        this.born();
    },
    update:function (dt) {
        // Keys are only enabled on the browser
        if (sys.platform == 'browser') {
            var pos = this.getPosition();
            // cc.log('1, x:'+ pos.x + ', y:' + pos.y );
            if ((MW.KEYS[cc.KEY.w] || MW.KEYS[cc.KEY.up]) && pos.y <= winSize.height) {
                pos.y += dt * this.speed;
            }
            if ((MW.KEYS[cc.KEY.s] || MW.KEYS[cc.KEY.down]) && pos.y >= 0) {
                pos.y -= dt * this.speed;
            }
            // if ((MW.KEYS[cc.KEY.a] || MW.KEYS[cc.KEY.left]) && pos.x >= 110) {
            if ((MW.KEYS[cc.KEY.a] || MW.KEYS[cc.KEY.left]) && pos.x >= 0) {
                pos.x -= dt * this.speed;
            }
            if ((MW.KEYS[cc.KEY.d] || MW.KEYS[cc.KEY.right]) && pos.x <= winSize.width) {
            // if ((MW.KEYS[cc.KEY.d] || MW.KEYS[cc.KEY.right]) && pos.x <= 210) {
                pos.x += dt * this.speed;
            }

            
            // pos.x = Math.min( pos.x , 210);
            pos.x = 110;
            this.setPosition(pos);
            // cc.log('2, x:'+ pos.x + ', y:' + pos.y );
            // cc.log(this.getPosition());
        }

        if (this.HP <= 0) {
            this.active = false;
            this.destroy();
        }
        this._timeTick += dt;
        if (this._timeTick > 0.1) {
            this._timeTick = 0;
            if (this._hurtColorLife > 0) {
                this._hurtColorLife--;
            }
        }
        MW.SCORE = MW.SCORE + 3 ;
    },
    shoot:function (dt) {
        //this.shootEffect();
        // var offset = 13;
        // var p = this.getPosition();
        // var cs = this.getContentSize();
        // var a = Bullet.getOrCreateBullet(this.bulletSpeed, "W1.png", MW.ENEMY_ATTACK_MODE.NORMAL, 3000, MW.UNIT_TAG.PLAYER_BULLET);
        // a.setPosition(p.x + offset, p.y + 3 + cs.height * 0.3);

        // var b = Bullet.getOrCreateBullet(this.bulletSpeed, "W1.png", MW.ENEMY_ATTACK_MODE.NORMAL, 3000, MW.UNIT_TAG.PLAYER_BULLET);
        // b.setPosition(p.x - offset, p.y + 3 + cs.height * 0.3);
    },
    hpMax:function (dt, type){
        this.HP = dt;
        var thisGift = GiftType[type];
        var NewCarImage = thisGift.carPng;
        cc.log(NewCarImage);
        this.initWithSpriteFrameName(NewCarImage);
        if( type == 1) {
            var blinks = cc.Blink.create(6, 20);
            this.runAction(cc.Sequence.create(cc.DelayTime.create(0.5), blinks));
        }
        // if( dt > 2 ){
        //     this.canBeAttack = true;
        // }else{

        //     this.canBeAttack = false;
        // }
    },
    backNormal:function(num){
        cc.log(num);
        
        this.initWithSpriteFrameName("car_00.png");
        this.HP = 1;
        this.canBeAttack = true;
    },
    destroy:function () {
        MW.LIFE--;

        var explosion = Explosion.getOrCreateExplosion();
        explosion.setPosition(this.getPosition());

        
        if (MW.SOUND) {
            cc.AudioEngine.getInstance().playEffect(res.shipDestroyEffect_mp3);
        }
    },
    hurt:function () {
        if (this.canBeAttack) {
            this._hurtColorLife = 2;
            this.HP--;
        }
        if (this.HP == 1){
            this.initWithSpriteFrameName("car_00.png");
        }
        cc.log('hp:'+ this.HP + ',GiftType:' + MW.GIFT_ActiveType);
    },
    collideRect:function (p) {
        var a = this.getContentSize();
        return cc.rect(p.x - a.width / 2, p.y - a.height / 2, a.width, a.height / 2);
    },
    initBornSprite:function () {
        // this.bornSprite = cc.Sprite.createWithSpriteFrameName("ship03.png");
        // this.bornSprite.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
        // this.bornSprite.setPosition(this.getContentSize().width / 2, 12);
        // this.bornSprite.setVisible(false);
        // this.addChild(this.bornSprite, 3000, 99999);
    },
    born:function () {
        //revive effect
        this.canBeAttack = false;
        // this.bornSprite.setScale(8);
        // this.bornSprite.runAction(cc.ScaleTo.create(0.5, 1, 1));
        // this.bornSprite.setVisible(false);
        var blinks = cc.Blink.create(0.01, 1);
        var makeBeAttack = cc.CallFunc.create(function (t) {
            t.canBeAttack = true;
            t.setVisible(true);
            // t.bornSprite.setVisible(false);
        }.bind(this));
        this.runAction(cc.Sequence.create(cc.DelayTime.create(0.5), blinks, makeBeAttack));

        this.HP = 1;
        this._hurtColorLife = 0;
        this.active = true;
    }
});
