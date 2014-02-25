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

/**
 * resource type
 * @constant
 * @type Object
 */
cc.RESOURCE_TYPE = {
    "IMAGE": ["png", "jpg", "bmp","jpeg","gif"],
    "SOUND": ["mp3", "ogg", "wav", "mp4", "m4a"],
    "XML": ["plist", "xml", "fnt", "tmx", "tsx"],
    "BINARY": ["ccbi"],
    "FONT": "FONT",
    "TEXT":["txt", "vsh", "fsh","json", "ExportJson"],
    "UNKNOW": []
};

/**
 * A class to pre-load resources before engine start game main loop.
 * @class
 * @extends cc.Scene
 */
cc.Loader = cc.Class.extend(/** @lends cc.Loader# */{
    _curNumber: 0,
    _totalNumber: 0,
    _loadedNumber: 0,
    _resouces: null,
    _animationInterval: 1 / 60,
    _interval: null,
    _isAsync: false,

    /**
     * Constructor
     */
    ctor: function () {
        this._resouces = [];
    },

    /**
     * init with resources
     * @param {Array} resources
     * @param {Function|String} selector
     * @param {Object} target
     */
    initWithResources: function (resources, selector, target) {
        if(!resources){
            console.log("resources should not null");
            return;
        }

        if (selector) {
            this._selector = selector;
            this._target = target;
        }

        if ((resources != this._resouces) || (this._curNumber == 0)) {
            this._curNumber = 0;
            this._loadedNumber = 0;
            if (resources[0] instanceof Array) {
                for (var i = 0; i < resources.length; i++) {
                    var each = resources[i];
                    this._resouces = this._resouces.concat(each);
                }
            } else
                this._resouces = resources;
            this._totalNumber = this._resouces.length;
        }

        //load resources
        this._schedulePreload();
    },

    setAsync: function (isAsync) {
        this._isAsync = isAsync;
    },

    /**
     * Callback when a resource file load failed.
     * @example
     * //example
     * cc.Loader.getInstance().onResLoaded();
     */
    onResLoadingErr: function (name) {
        this._loadedNumber++;
        cc.log("cocos2d:Failed loading resource: " + name);
    },

    /**
     * Callback when a resource file loaded.
     * @example
     * //example
     * cc.Loader.getInstance().onResLoaded();
     */
    onResLoaded: function () {
        this._loadedNumber++;
    },

    /**
     * Get loading percentage
     * @return {Number}
     * @example
     * //example
     * cc.log(cc.Loader.getInstance().getPercentage() + "%");
     */
    getPercentage: function () {
        var percent = 0;
        if (this._totalNumber == 0) {
            percent = 100;
        } else {
            percent = (0 | (this._loadedNumber / this._totalNumber * 100));
        }
        return percent;
    },

    /**
     * release resources from a list
     * @param resources
     */
    releaseResources: function (resources) {
        if (resources && resources.length > 0) {
            var sharedTextureCache = cc.TextureCache.getInstance();
            var sharedEngine = cc.AudioEngine ? cc.AudioEngine.getInstance() : null;
            var sharedParser = cc.SAXParser.getInstance();
            var sharedFileUtils = cc.FileUtils.getInstance();

            var resInfo;
            for (var i = 0; i < resources.length; i++) {
                resInfo = resources[i];
                var type = this._getResType(resInfo);
                switch (type) {
                    case "IMAGE":
                        sharedTextureCache.removeTextureForKey(resInfo.src);
                        break;
                    case "SOUND":
                        if(!sharedEngine) throw "Can not find AudioEngine! Install it, please.";
                        sharedEngine.unloadEffect(resInfo.src);
                        break;
                    case "XML":
                        sharedParser.unloadPlist(resInfo.src);
                        break;
                    case "BINARY":
                        sharedFileUtils.unloadBinaryFileData(resInfo.src);
                        break;
                    case "TEXT":
                        sharedFileUtils.unloadTextFileData(resInfo.src);
                        break;
                    case "FONT":
                        this._unregisterFaceFont(resInfo);
                        break;
                    default:
                        throw "cocos2d:unknown filename extension: " + type;
                        break;
                }
            }
        }
    },

    _preload: function () {
        this._updatePercent();
        if (this._isAsync) {
            var frameRate = cc.Director.getInstance()._frameRate;
            if (frameRate != null && frameRate < 20) {
                cc.log("cocos2d: frame rate less than 20 fps, skip frame.");
                return;
            }
        }

        if (this._curNumber < this._totalNumber) {
            this._loadOneResource();
            this._curNumber++;
        }
    },

    _loadOneResource: function () {
        var sharedTextureCache = cc.TextureCache.getInstance();
        var sharedEngine = cc.AudioEngine ? cc.AudioEngine.getInstance() : null;
        var sharedParser = cc.SAXParser.getInstance();
        var sharedFileUtils = cc.FileUtils.getInstance();

        var resInfo = this._resouces[this._curNumber];
        var type = this._getResType(resInfo);
        switch (type) {
            case "IMAGE":
                sharedTextureCache.addImage(resInfo.src);
                break;
            case "SOUND":
                if(!sharedEngine) throw "Can not find AudioEngine! Install it, please.";
                sharedEngine.preloadSound(resInfo.src);
                break;
            case "XML":
                sharedParser.preloadPlist(resInfo.src);
                break;
            case "BINARY":
                sharedFileUtils.preloadBinaryFileData(resInfo.src);
                break;
            case "TEXT" :
                sharedFileUtils.preloadTextFileData(resInfo.src);
                break;
            case "FONT":
                this._registerFaceFont(resInfo);
                break;
            default:
                throw "cocos2d:unknown filename extension: " + type;
                break;
        }
    },

    _schedulePreload: function () {
        var _self = this;
        this._interval = setInterval(function () {
            _self._preload();
        }, this._animationInterval * 1000);
    },

    _unschedulePreload: function () {
        clearInterval(this._interval);
    },

    _getResType: function (resInfo) {
        var isFont = resInfo.fontName;
        if (isFont != null) {
            return cc.RESOURCE_TYPE["FONT"];
        } else {
            var src = resInfo.src;
            var ext = src.substring(src.lastIndexOf(".") + 1, src.length);

            var index = ext.indexOf("?");
            if(index > 0) ext = ext.substring(0, index);

            for (var resType in cc.RESOURCE_TYPE) {
                if (cc.RESOURCE_TYPE[resType].indexOf(ext) != -1) {
                    return resType;
                }
            }
            return ext;
        }
    },

    _updatePercent: function () {
        var percent = this.getPercentage();

        if (percent >= 100) {
            this._unschedulePreload();
            this._complete();
        }
    },

    _complete: function () {
        if (this._target && (typeof(this._selector) == "string")) {
            this._target[this._selector](this);
        } else if (this._target && (typeof(this._selector) == "function")) {
            this._selector.call(this._target, this);
        } else {
            this._selector(this);
        }

        this._curNumber = 0;
        this._loadedNumber = 0;
        this._totalNumber = 0;
    },

    _registerFaceFont: function (fontRes) {
        var srcArr = fontRes.src;
        var fileUtils = cc.FileUtils.getInstance();
        if (srcArr && srcArr.length > 0) {
            var fontStyle = document.createElement("style");
            fontStyle.type = "text/css";
            document.body.appendChild(fontStyle);

            var fontStr = "@font-face { font-family:" + fontRes.fontName + "; src:";
            for (var i = 0; i < srcArr.length; i++) {
                fontStr += "url('" + fileUtils.fullPathForFilename(encodeURI(srcArr[i].src)) + "') format('" + srcArr[i].type + "')";
                fontStr += (i == (srcArr.length - 1)) ? ";" : ",";
            }
            fontStyle.textContent += fontStr + "};";

            //preload
            //<div style="font-family: PressStart;">.</div>
            var preloadDiv = document.createElement("div");
            preloadDiv.style.fontFamily = fontRes.fontName;
            preloadDiv.innerHTML = ".";
            preloadDiv.style.position = "absolute";
            preloadDiv.style.left = "-100px";
            preloadDiv.style.top = "-100px";
            document.body.appendChild(preloadDiv);
        }
        cc.Loader.getInstance().onResLoaded();
    },

    _unregisterFaceFont: function (fontRes) {
        //todo remove style
    }
});

/**
 * Preload resources in the background
 * @param {Array} resources
 * @param {Function|String} selector
 * @param {Object} target
 * @return {cc.Loader}
 * @example
 * //example
 * var g_mainmenu = [
 *    {src:"res/hello.png"},
 *    {src:"res/hello.plist"},
 *
 *    {src:"res/logo.png"},
 *    {src:"res/btn.png"},
 *
 *    {src:"res/boom.mp3"},
 * ]
 *
 * var g_level = [
 *    {src:"res/level01.png"},
 *    {src:"res/level02.png"},
 *    {src:"res/level03.png"}
 * ]
 *
 * //load a list of resources
 * cc.Loader.preload(g_mainmenu, this.startGame, this);
 *
 * //load multi lists of resources
 * cc.Loader.preload([g_mainmenu,g_level], this.startGame, this);
 */
cc.Loader.preload = function (resources, selector, target) {
    if (!this._instance) {
        this._instance = new cc.Loader();
    }
    this._instance.initWithResources(resources, selector, target);
    return this._instance;
};

/**
 * Preload resources async
 * @param {Array} resources
 * @param {Function|String} selector
 * @param {Object} target
 * @return {cc.Loader}
 */
cc.Loader.preloadAsync = function (resources, selector, target) {
    if (!this._instance) {
        this._instance = new cc.Loader();
    }
    this._instance.setAsync(true);
    this._instance.initWithResources(resources, selector, target);
    return this._instance;
};

/**
 * Release the resources from a list
 * @param {Array} resources
 */
cc.Loader.purgeCachedData = function (resources) {
    if (this._instance) {
        this._instance.releaseResources(resources);
    }
};

/**
 * Returns a shared instance of the loader
 * @function
 * @return {cc.Loader}
 */
cc.Loader.getInstance = function () {
    if (!this._instance) {
        this._instance = new cc.Loader();
    }
    return this._instance;
};

cc.Loader._instance = null;


/**
 * Used to display the loading screen
 * @class
 * @extends cc.Scene
 */
cc.LoaderScene = cc.Scene.extend(/** @lends cc.LoaderScene# */{
    _logo: null,
    _logoTexture: null,
    _texture2d: null,
    _bgLayer: null,
    _label: null,
    _winSize:null,

    /**
     * Constructor
     */
    ctor: function () {
        cc.Scene.prototype.ctor.call(this);
        this._winSize = cc.Director.getInstance().getWinSize();
    },
    init:function(){
        cc.Scene.prototype.init.call(this);

        //logo
        var logoWidth = 320;
        var logoHeight = 88;
        var centerPos = cc.p(this._winSize.width / 2, this._winSize.height / 2);

        this._logoTexture = new Image();
        var _this = this;
        this._logoTexture.addEventListener("load", function () {
            _this._initStage(centerPos);
            this.removeEventListener('load', arguments.callee, false);
        });
        
        this._logoTexture.src = "data:image/png;base64,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";  
  
        this._logoTexture.width = logoWidth;
        this._logoTexture.height = logoHeight;

        // // bg
        this._bgLayer = cc.LayerColor.create(cc.c4(32, 32, 32, 0));
        this._bgLayer.setPosition(0, 0);
        this.addChild(this._bgLayer, 0);

        //loading percent
        this._label = cc.LabelTTF.create("Loading... 0%", "Arial", 14);
        this._label.setColor(cc.c3(32, 32, 32));
        this._label.setPosition(cc.pAdd(centerPos, cc.p(0, -logoHeight / 2 - 10)));
        this._bgLayer.addChild(this._label, 10);
    },

    _initStage: function (centerPos) {
        this._texture2d = new cc.Texture2D();
        // this._texture2d.initWithElement(this._logoTexture);
        this._texture2d.handleLoadedTexture();
        this._logo = cc.Sprite.createWithTexture(this._texture2d);
        this._logo.setScale(cc.CONTENT_SCALE_FACTOR());
        this._logo.setPosition(centerPos);
        this._bgLayer.addChild(this._logo, 10);
    },

    onEnter: function () {
        cc.Node.prototype.onEnter.call(this);
        this.schedule(this._startLoading, 0.3);
    },

    onExit: function () {
        cc.Node.prototype.onExit.call(this);
        var tmpStr = "Loading... 0%";
        this._label.setString(tmpStr);
    },

    /**
     * init with resources
     * @param {Array} resources
     * @param {Function|String} selector
     * @param {Object} target
     */
    initWithResources: function (resources, selector, target) {
        this.resources = resources;
        this.selector = selector;
        this.target = target;
    },

    _startLoading: function () {
        this.unschedule(this._startLoading);
        cc.Loader.preload(this.resources, this.selector, this.target);
        this.schedule(this._updatePercent);
    },

    _updatePercent: function () {
        var percent = cc.Loader.getInstance().getPercentage();
        var tmpStr = "Loading... " + percent + "%";
        this._label.setString(tmpStr);

        if (percent >= 100)
            this.unschedule(this._updatePercent);
    }
});

/**
 * Preload multi scene resources.
 * @param {Array} resources
 * @param {Function|String} selector
 * @param {Object} target
 * @return {cc.LoaderScene}
 * @example
 * //example
 * var g_mainmenu = [
 *    {src:"res/hello.png"},
 *    {src:"res/hello.plist"},
 *
 *    {src:"res/logo.png"},
 *    {src:"res/btn.png"},
 *
 *    {src:"res/boom.mp3"},
 * ]
 *
 * var g_level = [
 *    {src:"res/level01.png"},
 *    {src:"res/level02.png"},
 *    {src:"res/level03.png"}
 * ]
 *
 * //load a list of resources
 * cc.LoaderScene.preload(g_mainmenu, this.startGame, this);
 *
 * //load multi lists of resources
 * cc.LoaderScene.preload([g_mainmenu,g_level], this.startGame, this);
 */
cc.LoaderScene.preload = function (resources, selector, target) {
    if (!this._instance) {
        this._instance = new cc.LoaderScene();
        this._instance.init();
    }

    this._instance.initWithResources(resources, selector, target);

    var director = cc.Director.getInstance();
    if (director.getRunningScene()) {
        director.replaceScene(this._instance);
    } else {
        director.runWithScene(this._instance);
    }

    return this._instance;
};
