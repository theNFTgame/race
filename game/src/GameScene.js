var GameScene = cc.Scene.extend({
     gameLayer:null,
     onEnter:function () {
        this._super();//调用父类的同名方法，这里是调用cc.Scene的onEnter
        //一般在这里自己写进入场景后的操作
       //添加Layer
      this.gameLayer = cc.Layer.create();
      this.addChild(this.gameLayer);
      //添加背景
      var bg = cc.Sprite.create(s_BackGround);
      this.gameLayer.addChild(bg,0);

      bg.setAnchorPoint(cc.p(0,0));
      bg.setPosition(cc.p(0,0)); 
     }
});