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
        //this._logoTexture.src = "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAlAAD/4QMpaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjAtYzA2MCA2MS4xMzQ3NzcsIDIwMTAvMDIvMTItMTc6MzI6MDAgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjM4MDBEMDY2QTU1MjExRTFBQTAzQjEzMUNFNzMxRkQwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjM4MDBEMDY1QTU1MjExRTFBQTAzQjEzMUNFNzMxRkQwIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzUgV2luZG93cyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkU2RTk0OEM4OERCNDExRTE5NEUyRkE3M0M3QkE1NTlEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkU2RTk0OEM5OERCNDExRTE5NEUyRkE3M0M3QkE1NTlEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQADQkJCQoJDQoKDRMMCwwTFhENDREW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";
        this._logoTexture.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyAAAADdCAYAAABDlBYyAAAgAElEQVR4Xu1dBZhV5dr9GGaGacJrXbsLFFGxBRNRAUUxUbE7sOMa1+vV30TsRmwRAzFQDOxO7MBurwxTTPOvtYcNZw4ndp9z5qz3eeYZZfbZsfZ39v7W977vWt0WX2qleUYhBISAEBACQkAICAEhIASEgBCIAIFuIiARoKxDCAEhIASEgBAQAkJACAgBIWAhIAKigSAEhIAQEAJCQAgIASEgBIRAZAiIgEQGtQ4kBISAEBACQkAICAEhIASEgAiIxoAQEAJCQAgIASEgBISAEBACkSEgAhIZ1DqQEBACQkAICAEhIASEgBAQAiIgGgNCQAgIASEgBISAEBACQkAIRIaACEhkUOtAQkAICAEhIASEgBAQAkJACIiAaAwIASEgBISAEBACQkAICAEhEBkCIiCRQa0DCQEhIASEgBAQAkJACAgBISACojEgBISAEBACQkAICAEhIASEQGQIiIBEBrUOJASEgBAQAkJACAgBISAEhIAIiMaAEBACQkAICAEhIASEgBAQApEhIAISGdQ6kBAQAkJACAgBISAEhIAQEAIiIBoDQkAICAEhIASEgBAQAkJACESGgAhIZFDrQEJACAgBISAEhIAQEAJCQAiIgGgMCAEhIASEgBAQAkJACAgBIRAZAiIgkUGtAwkBISAEhIAQEAJCQAgIASEgAqIxIASEgBAQAkJACAgBISAEhEBkCIiARAa1DiQEhIAQEAJCQAgIASEgBISACIjGgBAQAkJACAgBISAEhIAQEAKRISACEhnUOpAQEAJCQAgIASEgBISAEBACIiAaA0JACAgBISAEhIAQEAJCQAhEhoAISGRQ60BCQAgIASEgBISAEBACQkAIiIBoDAgBISAEhIAQEAJCQAgIASEQGQIiIJFBrQMJASEgBISAEBACQkAICAEhIAKiMSAEhIAQEAJCQAgIASEgBIRAZAiIgEQGtQ4kBISAEBACQkAICAEhIASEgAiIxoAQEAJCQAgIASEgBISAEBACkSEgAhIZ1DqQEBACQkAICAEhIASEgBAQAiIgGgNCQAgIASEgBISAEBACQkAIRIaACEhkUOtAQkAICAEhIASEgBAQAkJACIiAaAwIASEgBISAEBACQkAICAEhEBkCIiCRQa0DCQEhIASEgBAQAkJA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QAgIASEgBISAEMhnBERA8vnu69qFgBAQAkJACAgBISAEhEDECIiARAy4DicEhIAQEAJCQAgIASEgBPIZARGQfL77unYhIASEgBAQAkJACAgBIRAxAiIgEQOuwwkBISAEhIAQEAJCQAgIgXxGQAQkn+++rl0ICAEhIASEgBAQAkJACESMgAhIxIDrcEJACAgBISAEhIAQEAJCIJ8REAHJ57uvaxcCQkAICAEhIASEgBAQAhEjIAISMeA6nBAQAkJACAgBISAEhIAQyGcEREDy+e7r2oWAEBACQkAICAEhIASEQMQIiIBEDLgOJwSEgBAQAkJACAgBISAE8hkBEZB8vvu6diEgBISAEBACQkAICAEhEDECIiARA67DCQEhIASEgBAQAkJACAiBfEZABCSf776uXQgIASEgBISAEBACQkAIRIyACEjEgOtwQkAICAEhIASEgBAQAkIgnxEQAcnnu69rFwJCQAgIASEgBISAEBACESMgAhIx4DqcEBACQkAICAEhIASEgBDIZwREQPL57uvahYAQEAJCQAgIASEgBIRAxAiIgEQMuA4nBISAEBACQkAICAEhIATyGQERkHy++7p2ISAEhIAQEAJCQAgIASEQMQIiIBEDrsMJASEgBISAEBACQkAICIF8RkAEJJ/vvq5dCAgBISAEhIAQEAJCQAhEjIAISMSA63BCQAgIASEgBISAEBACQiCfERAByee7r2sXAkJACAgBISAEhIAQEAIRIyACEjHgOpwQEAJCQAgIASEgBISAEMhnBERA8vnu69qFgBAQAkJACAgBISAEhEDECIiARAy4DicEhIAQEAJCQAgIASEgBPIZARGQfL77unYhIASEgBAQAkJACAgBIRAxAiIgEQOuwwkBISAEhIAQEAJCQAgIgXxGQAQkn+++rl0ICAEhIASEgBAQAkJACESMgAhIxIDrcEJACAgBISAEhIAQEAJCIJ8REAHJ57uvaxcCQkAICAEhIASEgBAQAhEjIAISMeA6nBAQAkJACAgBISAEhIAQyGcEREDy+e7r2oWAEBACQkAICAEhIASEQMQIiIBEDLgOJwSEgBAQAkJACAgBISAE8hkBEZB8vvu6diEgBISAEBACQkAICAEhEDECIiARA67DCQEhIASEgBAQAkJACAiBfEZABCSf776uXQgIASEgBISAEBACQkAIRIyACEjEgOtwQkAICAEhIASEgBAQAkIgnxEQAcnnu69rFwJCQAgIASEgBISAEBACESMgAhIx4DqcEBACQkAICAEhIASEgBDIZwREQPL57uvahYAQEAJCQAgIASEgBIRAxAiIgEQMuA4nBISAEBACQkAICAEhIATyGYH/Bxxvzb0GUcfzAAAAAElFTkSuQmCC";  
  
        this._logoTexture.width = logoWidth;
        this._logoTexture.height = logoHeight;

        // bg
        this._bgLayer = cc.LayerColor.create(cc.c4(32, 32, 32, 255));
        this._bgLayer.setPosition(0, 0);
        this.addChild(this._bgLayer, 0);

        //loading percent
        this._label = cc.LabelTTF.create("Loading... 0%", "Arial", 14);
        this._label.setColor(cc.c3(180, 180, 180));
        this._label.setPosition(cc.pAdd(centerPos, cc.p(0, -logoHeight / 2 - 10)));
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
