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
        var logoHeight = 49;
        var centerPos = cc.p(this._winSize.width / 2, this._winSize.height / 2);

        this._logoTexture = new Image();
        var _this = this;
        this._logoTexture.addEventListener("load", function () {
            _this._initStage(centerPos);
            this.removeEventListener('load', arguments.callee, false);
        });
        this._logoTexture.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAAxCAYAAACrmXB6AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4RkRGQUE1MTk1ODIxMUUzQkE2OEREMEZBNTIwMTQ4MCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4RkRGQUE1Mjk1ODIxMUUzQkE2OEREMEZBNTIwMTQ4MCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjhGREZBQTRGOTU4MjExRTNCQTY4REQwRkE1MjAxNDgwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjhGREZBQTUwOTU4MjExRTNCQTY4REQwRkE1MjAxNDgwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+UsSWLgAAN0tJREFUeNrsfQd8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";
        this._logoTexture.width = logoWidth;
        this._logoTexture.height = logoHeight;

        // bg
        this._bgLayer = cc.LayerColor.create(cc.c4(32, 32, 32, 0));
        this._bgLayer.setPosition(0, 0);
        this.addChild(this._bgLayer, 0);

        //loading percent
        this._label = cc.LabelTTF.create("Loading... 0%", "Arial", 16);
        this._label.setColor(cc.c3(10, 10, 10));
        this._label.setPosition(cc.pAdd(centerPos, cc.p(0, -logoHeight / 2 - 20)));
        this._bgLayer.addChild(this._label, 10);
    },

    _initStage: function (centerPos) {
        this._texture2d = new cc.Texture2D();
        this._texture2d.initWithElement(this._logoTexture);
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
