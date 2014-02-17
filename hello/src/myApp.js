/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var MW = MW || {};
MW.DeviceOrientation = {};
MW.DeviceOrientation.initialX = null;
MW.DeviceOrientation.initialY = null;

    function handleOrientationEvent(event) {
        
        var x = event.beta ? event.beta : event.y * 90;
        var y = event.gamma ? event.gamma : event.x * 90;
        //window.console && console.info('Raw position: x, y: ', x, y);
        // MW.DeviceOrientation
        if (!MW.DeviceOrientation.initialX && !MW.DeviceOrientation.initialY) {
            MW.DeviceOrientation.initialX = x;
            MW.DeviceOrientation.initialY = y;
            cc.log('start DeviceOrientation!');
        } else {
            var positionX = MW.DeviceOrientation.initialX - x;
            var positionY = MW.DeviceOrientation.initialY - y;

            MW.DeviceOrientation.PostX = positionX;
            MW.DeviceOrientation.PostY = positionY;
            cc.log(MW.DeviceOrientation.initialY);
            cc.log(event);
        }
    }
    window.addEventListener("MozOrientation", handleOrientationEvent, true);
    window.addEventListener("deviceorientation", handleOrientationEvent, true);

var Helloworld = cc.Layer.extend({
    isMouseDown:false,
    helloImg:null,
    helloLabel:null,
    circle:null,
    sprite:null,

    init:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        var size = cc.Director.getInstance().getWinSize();

        // add a "close" icon to exit the progress. it's an autorelease object
        var closeItem = cc.MenuItemImage.create(
            "res/CloseNormal.png",
            "res/CloseSelected.png",
            function () {
                history.go(-1);
            },this);
        closeItem.setAnchorPoint(0.5, 0.5);

        var menu = cc.Menu.create(closeItem);
        menu.setPosition(0,0);
        this.addChild(menu, 1);
        closeItem.setPosition(size.width - 20, 20);

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        this.helloLabel = cc.LabelTTF.create("Racing Game", "Arial", 22);
        // position the label on the center of the screen
        this.helloLabel.setPosition(size.width / 2, 0);
        // add the label as a child to this layer
        this.addChild(this.helloLabel, 5);

        var lazyLayer = cc.Layer.create();
        this.addChild(lazyLayer);

        // add "HelloWorld" splash screen"
        this.sprite = cc.Sprite.create("res/background2.jpg");
        this.sprite.setPosition(size.width / 2, size.height / 2);
        this.sprite.setScale(0.5);
        this.sprite.setRotation(180);



        lazyLayer.addChild(this.sprite, 0);




        var rotateToA = cc.RotateTo.create(2, 0);
        var scaleToA = cc.ScaleTo.create(1, 0.5, 0.5);

        this.sprite.runAction(cc.Sequence.create(rotateToA, scaleToA));
        this.helloLabel.runAction(cc.Spawn.create(cc.MoveBy.create(2.5, cc.p(0, size.height - 40)),cc.TintTo.create(2.5,255,125,0)));

        



        this.addChild(this.sprite1);

        // 测试 车子跟随设备位置移动
        var size = cc.Director.getInstance().getWinSize();
        this.sprite1 = cc.Sprite.create("res/democar.png"); //这里图片名称最好写在resource.js里面  
        this.sprite1.setPosition(cc.p(size.width / 2,size.height / 4));
        this.sprite1.setScale(0.5);
        
        this.schedule(function(){
            var temyX =  (size.width / 2) - MW.DeviceOrientation.PostY + 10,
                tempY =  (size.height / 3) + MW.DeviceOrientation.PostX * 2 ;

            this.sprite1.setPosition( temyX , tempY );
        });


        this.setTouchEnabled(true);
        return true;
    },
    // a selector callback
    menuCloseCallback:function (sender) {
        cc.Director.getInstance().end();
    },
    onTouchesBegan:function (touches, event) {
        this.isMouseDown = true;
        cc.log('onTouchesBegan');
    },
    onTouchesMoved:function (touches, event) {
        if (this.isMouseDown) {
            if (touches) {
                // cc.log('x:' + touches[0].getLocation().x + ',y:' + touches[0].getLocation().y);
                // this.sprite1.setPosition( (cc.Director.getInstance().getWinSize().width / 2) - MW.DeviceOrientation.PostY , (cc.Director.getInstance().getWinSize().height / 4) + MW.DeviceOrientation.PostX / 2 );
                // cc.log(MW.DeviceOrientation);
            }
        }
    },
    onTouchesEnded:function (touches, event) {
        this.isMouseDown = false;
    },
    onTouchesCancelled:function (touches, event) {
        console.log("onTouchesCancelled");
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new Helloworld();
        layer.init();
        this.addChild(layer);
    }
});

