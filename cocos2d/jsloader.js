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
(function () {
    var engine = [
        // Core
        'core/platform/CCClass.js',
        'core/cocoa/CCGeometry.js',
        'core/platform/Sys.js',
        'core/platform/CCConfig.js',
        'core/platform/miniFramework.js',
        'core/platform/CCCommon.js',
        'core/platform/CCMacro.js',
        'core/platform/CCFileUtils.js',
        'core/platform/CCTypes.js',
        'core/platform/CCEGLView.js',
        'core/platform/CCScreen.js',
        'core/platform/CCVisibleRect.js',
        'core/cocoa/CCNS.js',
        'core/cocoa/CCAffineTransform.js',
        'core/support/CCPointExtension.js',
        'core/support/CCVertex.js',
        'core/support/TransformUtils.js',
        'core/base_nodes/CCNode.js',
        'core/base_nodes/CCAtlasNode.js',
        'core/textures/CCTexture2D.js',
        'core/textures/CCTextureCache.js',
        'core/textures/CCTextureAtlas.js',
        'core/scenes_nodes/CCScene.js',
        'core/layers_nodes/CCLayer.js',
        'core/sprite_nodes/CCSprite.js',
        'core/sprite_nodes/CCAnimation.js',
        'core/sprite_nodes/CCAnimationCache.js',
        'core/sprite_nodes/CCSpriteFrame.js',
        'core/sprite_nodes/CCSpriteFrameCache.js',
        'core/sprite_nodes/CCSpriteBatchNode.js',
        'core/CCConfiguration.js',
        'core/CCDirector.js',
        'core/CCCamera.js',
        'core/CCScheduler.js',
        'core/CCLoader.js',
        'core/CCDrawingPrimitives.js',
        'core/platform/CCApplication.js',
        'core/platform/CCSAXParser.js',
        'core/platform/AppControl.js',
        'core/labelTTF/CCLabelTTF.js',
        'core/CCActionManager.js',
        'kazmath/utility.js',
        'kazmath/vec2.js',
        'kazmath/vec3.js',
        'kazmath/vec4.js',
        'kazmath/ray2.js',
        'kazmath/mat3.js',
        'kazmath/mat4.js',
        'kazmath/plane.js',
        'kazmath/quaternion.js',
        'kazmath/aabb.js',
        'kazmath/GL/mat4stack.js',
        'kazmath/GL/matrix.js',
        'shaders/CCShaders.js',
        'shaders/CCShaderCache.js',
        'shaders/CCGLProgram.js',
        'shaders/CCGLStateCache.js',
        'render_texture/CCRenderTexture.js',
        'motion_streak/CCMotionStreak.js',
        'clipping_nodes/CCClippingNode.js',
        'effects/CCGrid.js',
        'effects/CCGrabber.js',
        'shape_nodes/CCDrawNode.js',
        'actions/CCAction.js',
        'actions/CCActionInterval.js',
        'actions/CCActionInstant.js',
        'actions/CCActionCamera.js',
        'actions/CCActionEase.js',
        'actions/CCActionCatmullRom.js',
        'actions/CCActionTween.js',
        'actions3d/CCActionGrid.js',
        'actions3d/CCActionGrid3D.js',
        'actions3d/CCActionTiledGrid.js',
        'actions3d/CCActionPageTurn3D.js',
        'progress_timer/CCProgressTimer.js',
        'progress_timer/CCActionProgressTimer.js',
        'transitions_nodes/CCTransition.js',
        'transitions_nodes/CCTransitionProgress.js',
        'transitions_nodes/CCTransitionPageTurn.js',
        'label_nodes/CCLabelAtlas.js',
        'label_nodes/CCLabelBMFont.js',
        'compress/ZipUtils.js',
        'compress/base64.js',
        'compress/gzip.js',
        'compress/zlib.min.js',
        'particle_nodes/CCFormatHelper.js',
        'particle_nodes/CCPNGReader.js',
        'particle_nodes/CCTIFFReader.js',
        'particle_nodes/CCParticleSystem.js',
        'particle_nodes/CCParticleExamples.js',
        'particle_nodes/CCParticleBatchNode.js',
        'touch_dispatcher/CCTouchDelegateProtocol.js',
        'touch_dispatcher/CCTouchHandler.js',
        'touch_dispatcher/CCTouchDispatcher.js',
        'touch_dispatcher/CCMouseDispatcher.js',
        'keyboard_dispatcher/CCKeyboardDelegate.js',
        'keyboard_dispatcher/CCKeyboardDispatcher.js',
        'accelerometer/CCAccelerometer.js',
        'text_input_node/CCIMEDispatcher.js',
        'text_input_node/CCTextFieldTTF.js',
        'menu_nodes/CCMenuItem.js',
        'menu_nodes/CCMenu.js',
        'tileMap_nodes/CCTGAlib.js',
        'tileMap_nodes/CCTMXTiledMap.js',
        'tileMap_nodes/CCTMXXMLParser.js',
        'tileMap_nodes/CCTMXObjectGroup.js',
        'tileMap_nodes/CCTMXLayer.js',
        'parallax_nodes/CCParallaxNode.js',
        'audio/SimpleAudioEngine.js',

        // useless
        'CCUserDefault.js',
        'CCImage.js'

    ];

    var d = document;
    var c = d["ccConfig"];

    if (c.loadExtension != null && c.loadExtension == true) {
        engine = engine.concat([
            '../extensions/GUI/CCControlExtension/CCControl.js',
            '../extensions/GUI/CCControlExtension/CCControlButton.js',
            '../extensions/GUI/CCControlExtension/CCControlUtils.js',
            '../extensions/GUI/CCControlExtension/CCInvocation.js',
            '../extensions/GUI/CCControlExtension/CCScale9Sprite.js',
            '../extensions/GUI/CCControlExtension/CCMenuPassive.js',
            '../extensions/GUI/CCControlExtension/CCControlSaturationBrightnessPicker.js',
            '../extensions/GUI/CCControlExtension/CCControlHuePicker.js',
            '../extensions/GUI/CCControlExtension/CCControlColourPicker.js',
            '../extensions/GUI/CCControlExtension/CCControlSlider.js',
            '../extensions/GUI/CCControlExtension/CCControlSwitch.js',
            '../extensions/GUI/CCControlExtension/CCControlStepper.js',
            '../extensions/GUI/CCControlExtension/CCControlPotentiometer.js',
            '../extensions/GUI/CCScrollView/CCScrollView.js',
            '../extensions/GUI/CCScrollView/CCSorting.js',
            '../extensions/GUI/CCScrollView/CCTableView.js',
            '../extensions/CCBReader/CCNodeLoader.js',
            '../extensions/CCBReader/CCBReaderUtil.js',
            '../extensions/CCBReader/CCControlLoader.js',
            '../extensions/CCBReader/CCSpriteLoader.js',
            '../extensions/CCBReader/CCNodeLoaderLibrary.js',
            '../extensions/CCBReader/CCBReader.js',
            '../extensions/CCBReader/CCBValue.js',
            '../extensions/CCBReader/CCBKeyframe.js',
            '../extensions/CCBReader/CCBSequence.js',
            '../extensions/CCBReader/CCBRelativePositioning.js',
            '../extensions/CCBReader/CCBAnimationManager.js',
            '../extensions/CCEditBox/CCdomNode.js',
            '../extensions/CCEditBox/CCEditBox.js',

            '../extensions/CocoStudio/Components/CCComponent.js',
            '../extensions/CocoStudio/Components/CCComponentContainer.js',
            '../extensions/CocoStudio/CocoStudio.js',
            // CocoStudio Armature
            '../extensions/CocoStudio/Armature/utils/CCArmatureDefine.js',
            '../extensions/CocoStudio/Armature/utils/CCDataReaderHelper.js',
            '../extensions/CocoStudio/Armature/utils/CCSpriteFrameCacheHelper.js',
            '../extensions/CocoStudio/Armature/utils/CCTransformHelp.js',
            '../extensions/CocoStudio/Armature/utils/CCTweenFunction.js',
            '../extensions/CocoStudio/Armature/utils/CCUtilMath.js',
            '../extensions/CocoStudio/Armature/utils/CCArmatureDataManager.js',
            '../extensions/CocoStudio/Armature/datas/CCDatas.js',
            '../extensions/CocoStudio/Armature/display/CCDecorativeDisplay.js',
            '../extensions/CocoStudio/Armature/display/CCDisplayFactory.js',
            '../extensions/CocoStudio/Armature/display/CCDisplayManager.js',
            '../extensions/CocoStudio/Armature/display/CCSkin.js',
            '../extensions/CocoStudio/Armature/animation/CCProcessBase.js',
            '../extensions/CocoStudio/Armature/animation/CCArmatureAnimation.js',
            '../extensions/CocoStudio/Armature/animation/CCTween.js',
            '../extensions/CocoStudio/Armature/physics/CCColliderDetector.js',
            '../extensions/CocoStudio/Armature/CCArmature.js',
            '../extensions/CocoStudio/Armature/CCBone.js',
            // CocoStudio Action
            '../extensions/CocoStudio/Action/CCActionFrame.js',
            '../extensions/CocoStudio/Action/CCActionManager.js',
            '../extensions/CocoStudio/Action/CCActionNode.js',
            '../extensions/CocoStudio/Action/CCActionObject.js',
            // CocoStudio Components
            '../extensions/CocoStudio/Components/CCComAttribute.js',
            '../extensions/CocoStudio/Components/CCComAudio.js',
            '../extensions/CocoStudio/Components/CCComController.js',
            '../extensions/CocoStudio/Components/CCComRender.js',
            // CocoStudio Trigger
            '../extensions/CocoStudio/Trigger/ObjectFactory.js',
            '../extensions/CocoStudio/Trigger/TriggerBase.js',
            '../extensions/CocoStudio/Trigger/TriggerMng.js',
            '../extensions/CocoStudio/Trigger/TriggerObj.js',
            // CocoStudio GUI
            '../extensions/CocoStudio/GUI/BaseClasses/UIWidget.js',
            '../extensions/CocoStudio/GUI/Layouts/UILayout.js',
            '../extensions/CocoStudio/GUI/Layouts/UILayoutParameter.js',
            '../extensions/CocoStudio/GUI/Layouts/UILayoutDefine.js',
            '../extensions/CocoStudio/GUI/System/CocosGUI.js',
            '../extensions/CocoStudio/GUI/System/UIHelper.js',
            '../extensions/CocoStudio/GUI/System/UILayer.js',
            '../extensions/CocoStudio/GUI/UIWidgets/UIButton.js',
            '../extensions/CocoStudio/GUI/UIWidgets/UICheckBox.js',
            '../extensions/CocoStudio/GUI/UIWidgets/UIImageView.js',
            '../extensions/CocoStudio/GUI/UIWidgets/UILabel.js',
            '../extensions/CocoStudio/GUI/UIWidgets/UILabelAtlas.js',
            '../extensions/CocoStudio/GUI/UIWidgets/UILabelBMFont.js',
            '../extensions/CocoStudio/GUI/UIWidgets/UILoadingBar.js',
            '../extensions/CocoStudio/GUI/UIWidgets/UISlider.js',
            '../extensions/CocoStudio/GUI/UIWidgets/UISwitch.js',
            '../extensions/CocoStudio/GUI/UIWidgets/UITextField.js',
            '../extensions/CocoStudio/GUI/UIWidgets/Compatible/CompatibleClasses.js',
            '../extensions/CocoStudio/GUI/UIWidgets/ScrollWidget/UIScrollView.js',
            '../extensions/CocoStudio/GUI/UIWidgets/ScrollWidget/UIListView.js',
            '../extensions/CocoStudio/GUI/UIWidgets/ScrollWidget/UIPageView.js',
            '../extensions/CocoStudio/Reader/GUIReader.js',
            '../extensions/CocoStudio/Reader/SceneReader.js'

        ]);
    }

    if (c.loadPluginx != null && c.loadPluginx == true) {
        engine = engine.concat([
            //protocols
            '../extensions/PluginX/protocols/Config.js',
            '../extensions/PluginX/protocols/PluginUtils.js',
            '../extensions/PluginX/protocols/PluginProtocol.js',
            '../extensions/PluginX/protocols/ProtocolSocial.js',
            //'../extensions/PluginX/protocols/ProtocolAds.js',
            //'../extensions/PluginX/protocols/ProtocolAnalytics.js',
            //'../extensions/PluginX/protocols/ProtocolIAP.js',
            '../extensions/PluginX/protocols/PluginFactory.js',
            '../extensions/PluginX/protocols/PluginManager.js',

            //plugins
            '../extensions/PluginX/plugins/SocialWeibo.js',
            '../extensions/PluginX/plugins/SocialQQWeibo.js',
            '../extensions/PluginX/plugins/SocialQzone.js',
            '../extensions/PluginX/plugins/SocialTwitter.js',
            '../extensions/PluginX/plugins/SocialFacebook.js'
            //'../extensions/PluginX/plugins/AdsGoogle.js'
        ]);
    }

    if (!c.engineDir) {
        engine = [];
    }
    else {
        if(c.box2d || c.chipmunk){
            engine.push('physics_nodes/CCPhysicsSprite.js');
            engine.push('physics_nodes/CCPhysicsDebugNode.js');
            if (c.box2d === true)
                engine.push('../external/box2d/box2d.js');
            if (c.chipmunk === true)
                engine.push('../external/chipmunk/chipmunk.js');
        }
        engine.forEach(function (e, i) {
            engine[i] = c.engineDir + e;
        });
    }
    if (typeof c.box2d === "string") {
        engine.push(c.box2d);
    }
    if (typeof c.chipmunk === "string") {
        engine.push(c.chipmunk);
    }

    var loadJsImg = document.getElementById("cocos2d_loadJsImg");
    if(!loadJsImg){
        loadJsImg = document.createElement('img');
        loadJsImg.src = "data:image/gif;base64,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";

        var canvasNode = document.getElementById(c.tag);
        // canvasNode.style.backgroundColor = "black";
        canvasNode.parentNode.appendChild(loadJsImg);
        
        var canvasStyle = getComputedStyle?getComputedStyle(canvasNode):canvasNode.currentStyle;
        loadJsImg.style.left = canvasNode.offsetLeft + (parseFloat(canvasStyle.width) - loadJsImg.width)/2 + "px";
        loadJsImg.style.top = canvasNode.offsetTop + (parseFloat(canvasStyle.height) - loadJsImg.height)/2 + "px";
        loadJsImg.style.position = "absolute";
    }
    
    var updateLoading = function(p){
        if(p>=1) {
            loadJsImg.parentNode.removeChild(loadJsImg);
        }
    };

    var loaded = 0;
    var que = engine.concat(c.appFiles);
    que.push('main.js');

    if (navigator.userAgent.indexOf("Trident/5") > -1) {
        //ie9
        var i = -1;
        var loadNext = function () {
            i++;
            if (i < que.length) {
                var f = d.createElement('script');
                f.src = que[i];
                f.addEventListener('load',function(){
                    loadNext();
                    updateLoading(loaded / que.length);
                    this.removeEventListener('load', arguments.callee, false);
                },false);
                d.body.appendChild(f);
            }
            updateLoading(i / (que.length - 1));
        };
        loadNext();
    }
    else {
        que.forEach(function (f, i) {
            var s = d.createElement('script');
            s.async = false;
            s.src = f;
            s.addEventListener('load',function(){
                loaded++;
                updateLoading(loaded / que.length);
                this.removeEventListener('load', arguments.callee, false);
            },false);
            d.body.appendChild(s);
        });
    }
})();
