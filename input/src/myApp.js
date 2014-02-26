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
        this.helloLabel = cc.LabelTTF.create("Hello World", "Arial", 38);
        // position the label on the center of the screen
        this.helloLabel.setPosition(size.width / 2, 0);
        // add the label as a child to this layer
        this.addChild(this.helloLabel, 5);

        var lazyLayer = cc.Layer.create();
        this.addChild(lazyLayer);

        // add "HelloWorld" splash screen"
        this.sprite = cc.Sprite.create("res/HelloWorld.png");
        this.sprite.setPosition(size.width / 2, size.height / 2);
        this.sprite.setScale(0.5);
        this.sprite.setRotation(180);

        lazyLayer.addChild(this.sprite, 0);

        var rotateToA = cc.RotateTo.create(2, 0);
        var scaleToA = cc.ScaleTo.create(2, 1, 1);

        this.sprite.runAction(cc.Sequence.create(rotateToA, scaleToA));
        this.helloLabel.runAction(cc.Spawn.create(cc.MoveBy.create(2.5, cc.p(0, size.height - 40)),cc.TintTo.create(2.5,255,125,0)));


// ==========================

var TEXT_INPUT_FONT_NAME = "Thonburi";
var TEXT_INPUT_FONT_SIZE = 36;

var sceneIdx = -1;

var textInputGetRect = function (node) {
    var pos = node.getPosition();
    var cs = node.getContentSize();
    var rc = cc.rect(pos.x, pos.y, cs.width, cs.height);
    rc.x -= rc.width / 2;
    rc.y -= rc.height / 2;
    return rc;
};

/**
 @brief    TextInputTest for retain prev, reset, next, main menu buttons.
 */
var TextInputTest = cc.Layer.extend({
    notificationLayer:null,
    ctor:function() {
        this._super();
        this.init();
    },

    restartCallback:function (sender) {
        var scene = new TextInputTestScene();
        scene.addChild(restartTextInputTest());
        cc.Director.getInstance().replaceScene(scene);
    },
    nextCallback:function (sender) {
        var scene = new TextInputTestScene();
        scene.addChild(nextTextInputTest());
        cc.Director.getInstance().replaceScene(scene);
    },
    backCallback:function (sender) {
        var scene = new TextInputTestScene();
        scene.addChild(previousTextInputTest());
        cc.Director.getInstance().replaceScene(scene);
    },

    title:function () {
        return "text input test";
    },

    addKeyboardNotificationLayer:function (layer) {
        this.notificationLayer = layer;
        this.addChild(layer);
    },

    onEnter:function () {
        this._super();

        var winSize = cc.Director.getInstance().getWinSize();

        var label = cc.LabelTTF.create(this.title(), "Arial", 24);
        this.addChild(label);
        label.setPosition(winSize.width / 2, winSize.height - 50);

        var subTitle = this.subtitle();
        if (subTitle && subTitle !== "") {
            var l = cc.LabelTTF.create(subTitle, "Thonburi", 16);
            this.addChild(l, 1);
            l.setPosition(winSize.width / 2, winSize.height - 80);
        }

        var item1 = cc.MenuItemImage.create(s_pathB1, s_pathB2, this.backCallback, this);
        var item2 = cc.MenuItemImage.create(s_pathR1, s_pathR2, this.restartCallback, this);
        var item3 = cc.MenuItemImage.create(s_pathF1, s_pathF2, this.nextCallback, this);

        var menu = cc.Menu.create(item1, item2, item3);
        menu.setPosition(0,0);
        item1.setPosition(winSize.width / 2 - 100, 30);
        item2.setPosition(winSize.width / 2, 30);
        item3.setPosition(winSize.width / 2 + 100, 30);

        this.addChild(menu, 1);
    }
});
//////////////////////////////////////////////////////////////////////////
// KeyboardNotificationLayer for test IME keyboard notification.
//////////////////////////////////////////////////////////////////////////
var KeyboardNotificationLayer = TextInputTest.extend({
    _trackNode:null,
    _beginPos:null,

    ctor:function () {
        this._super();

        if( 'touches' in sys.capabilities )
            this.setTouchEnabled(true);
        else if ('mouse' in sys.capabilities )
            this.setMouseEnabled(true);
    },

    subtitle:function () {
        return "";
    },

    onClickTrackNode:function (clicked) {
    },

    keyboardWillShow:function (info) {
        cc.log("TextInputTest:keyboardWillShowAt(origin:" + info.end.x + "," + info.end.y
            + ", size:" + info.end.width + "," + info.end.height + ")");

        if (!this._trackNode)
            return;

        var rectTracked = textInputGetRect(this._trackNode);
        cc.log("TextInputTest:trackingNodeAt(origin:" + info.end.x + "," + info.end.y
            + ", size:" + info.end.width + "," + info.end.height + ")");

        // if the keyboard area doesn't intersect with the tracking node area, nothing need to do.
        if (!cc.rectIntersectsRect(rectTracked, info.end))
            return;

        // assume keyboard at the bottom of screen, calculate the vertical adjustment.
        var adjustVert = cc.rectGetMaxY(info.end) - cc.rectGetMinY(rectTracked);
        cc.log("TextInputTest:needAdjustVerticalPosition(" + adjustVert + ")");

        // move all the children node of KeyboardNotificationLayer
        var children = this.getChildren();
        for (var i = 0; i < children.length; ++i) {
            var node = children[i];
            var pos = node.getPosition();
            pos.y += adjustVert;
            node.setPosition(pos);
        }
    },

    onTouchesEnded:function (touches, event) {
        if (!this._trackNode)
            return;

        // grab first touch
        if(touches.length == 0)
            return;

        var touch = touches[0];
        var point = touch.getLocation();

        // decide the trackNode is clicked.
        cc.log("KeyboardNotificationLayer:clickedAt(" + point.x + "," + point.y + ")");

        var rect = textInputGetRect(this._trackNode);
        cc.log("KeyboardNotificationLayer:TrackNode at(origin:" + rect.x + "," + rect.y
            + ", size:" + rect.width + "," + rect.height + ")");

        this.onClickTrackNode(cc.rectContainsPoint(rect, point));
        cc.log("----------------------------------");
    },
    onMouseUp:function (event) {
        if (!this._trackNode)
            return;

        var point = event.getLocation();

        // decide the trackNode is clicked.
        cc.log("KeyboardNotificationLayer:clickedAt(" + point.x + "," + point.y + ")");

        var rect = textInputGetRect(this._trackNode);
        cc.log("KeyboardNotificationLayer:TrackNode at(origin:" + rect.x + "," + rect.y
            + ", size:" + rect.width + "," + rect.height + ")");

        this.onClickTrackNode(cc.rectContainsPoint(rect, point));
        cc.log("----------------------------------");
    }
});

//////////////////////////////////////////////////////////////////////////
// TextFieldTTFDefaultTest for test TextFieldTTF default behavior.
//////////////////////////////////////////////////////////////////////////
var TextFieldTTFDefaultTest = KeyboardNotificationLayer.extend({
    subtitle:function () {
        return "TextFieldTTF with default behavior test";
    },
    onClickTrackNode:function (clicked) {
        var textField = this._trackNode;
        if (clicked) {
            // TextFieldTTFTest be clicked
            cc.log("TextFieldTTFDefaultTest:CCTextFieldTTF attachWithIME");
            textField.attachWithIME();
        } else {
            // TextFieldTTFTest not be clicked
            cc.log("TextFieldTTFDefaultTest:CCTextFieldTTF detachWithIME");
            textField.detachWithIME();
        }
    },

    onEnter:function () {
        this._super();

        // add CCTextFieldTTF
        var winSize = cc.Director.getInstance().getWinSize();

        var textField = cc.TextFieldTTF.create("<click here for input>",
            TEXT_INPUT_FONT_NAME,
            TEXT_INPUT_FONT_SIZE);
        this.addChild(textField);
        textField.setPosition(winSize.width / 2, winSize.height / 2);

        this._trackNode = textField;
    }
});


new TextFieldTTFDefaultTest;
// =======================


        this.setTouchEnabled(true);
        return true;
    },
    // a selector callback
    menuCloseCallback:function (sender) {
        cc.Director.getInstance().end();
    },
    onTouchesBegan:function (touches, event) {
        this.isMouseDown = true;
    },
    onTouchesMoved:function (touches, event) {
        if (this.isMouseDown) {
            if (touches) {
                //this.circle.setPosition(touches[0].getLocation().x, touches[0].getLocation().y);
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

