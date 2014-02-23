var Gift = cc.Sprite.extend({
    eID:0,
    giftType:1,
    active:true,
    speed:200,
    bulletSpeed:MW.BULLET_SPEED.Gift,
    HP:1,
    bulletPowerValue:1,
    moveType:null,
    scoreValue:200,
    zOrder:1000,
    delayTime:1 + 1.2 * Math.random(),
    _hurtColorLife:0,
    ctor:function (arg) {
        this._super();

        this.HP = arg.HP;
        this.moveType = arg.moveType;
        this.giftType = arg.type;
        this.speed = arg.speed;

        // this.initWithSpriteFrameName(arg.textureName);
        // cc.log(arg);
        this.initWithFile(res.Cars, cc.rect(0, 0, 100, 200));
        this.setScale(0.5);
        this.schedule(this.shoot, this.delayTime);
    },
    _timeTick:0,
    update:function (dt) {
        var p = this.getPosition();
        if ((p.x < 0 || p.x > 320) && (p.y < 0 || p.y > 480)) {
            this.active = false;
        }
        this._timeTick += dt;
        if (this._timeTick > 0.1) {
            this._timeTick = 0;
            if (this._hurtColorLife > 0) {
                this._hurtColorLife--;
            }
        }

        if ( this.HP <= 0 ){
            this.active = false;
            this.destroy();
        }

        var p = this.getPosition();
        if (p.x < 0 || p.x > g_sharedGameLayer.screenRect.width || p.y < 0 || p.y > g_sharedGameLayer.screenRect.height + 180) {
            this.active = false;
            this.goaway();
        }

    },
    goaway:function () {
        this.setVisible(false);
        this.active = false;
        this.stopAllActions();
        this.unschedule(this.shoot);
        MW.ACTIVE_GIFTS--;
        // MW.SCORE += this.scoreValue;
    },
    destroy:function () {
        // MW.SCORE += this.scoreValue;
        var a = Explosion.getOrCreateExplosion();
        a.setPosition(this.getPosition());
        SparkEffect.getOrCreateSparkEffect(this.getPosition());
        if (MW.SOUND) {
            cc.AudioEngine.getInstance().playEffect(res.explodeEffect_mp3);
        }
        this.setVisible(false);
        this.active = false;
        this.stopAllActions();
        this.unschedule(this.shoot);
        MW.ACTIVE_GIFTS--;
    },
    shoot:function () {
        // var p = this.getPosition();
        // var b = Bullet.getOrCreateBullet(this.bulletSpeed, "W2.png", this.attackMode, 3000, MW.UNIT_TAG.ENMEY_BULLET);
        // b.setPosition(p.x, p.y - this.getContentSize().height * 0.2);
    },
    hurt:function () {
        this._hurtColorLife = 2;
        this.HP--;
    },
    collideRect:function (p) {
        var a = this.getContentSize();
        return cc.rect(p.x - a.width / 2, p.y - a.height / 4, a.width, a.height / 2+20);
    }
});

Gift.getOrCreateGift = function (arg) {
    cc.log(arg);
    var selChild = null;
    for (var j = 0; j < MW.CONTAINER.GIFTS.length; j++) {
        selChild = MW.CONTAINER.GIFTS[j];

        if (selChild.active == false && selChild.giftType == arg.type) {
            selChild.HP = arg.HP;
            selChild.active = true;
            selChild.moveType = arg.moveType;
            selChild._hurtColorLife = 0;

            selChild.schedule(selChild.shoot, selChild.delayTime);
            selChild.setVisible(true);
            MW.ACTIVE_GIFTS++;
            return selChild;
        }
    }
    selChild = Gift.create(arg);
    MW.ACTIVE_GIFTS++;
    return selChild;
};

Gift.create = function (arg) {
    var gift = new Gift(arg);
    // cc.log(GiftType)
    g_sharedGameLayer.addGift(gift, gift.zOrder, MW.UNIT_TAG.GIFT);
    MW.CONTAINER.GIFTS.push(gift);
    return gift;
};

Gift.preSet = function () {
    var gift = null;
    for (var i = 0; i < 3; i++) {
        for (var i = 0; i < GiftType.length; i++) {
            gift = Gift.create(GiftType[i]);
            gift.setVisible(false);
            gift.active = false;
            gift.stopAllActions();
            gift.unscheduleAllCallbacks();
        }
    }
};