var GameControlMenu = cc.Layer.extend({

    init:function () {
        var bRet = false;
        if (this._super()) {
            cc.MenuItemFont.setFontSize(18);
            cc.MenuItemFont.setFontName("Arial");
            var systemMenu = cc.MenuItemFont.create("Game Rank", this.onSysMenu);
            var menu = cc.Menu.create(systemMenu);
            menu.setPosition(0, 0);
            systemMenu.setAnchorPoint(0, 0);
            systemMenu.setPosition(winSize.width-95, 5);
            // this.addChild(menu, 1, 2);
            bRet = true;
        }

        return bRet;
    },
    onSysMenu:function (pSender) {
        var scene = cc.Scene.create();
        // scene.addChild(SysMenu.create());
        scene.addChild(RankList.create());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2,scene));
    }
});

GameControlMenu.create = function () {
    var sg = new GameControlMenu();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};
