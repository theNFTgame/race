/**
 *  Cocos2d-html5 show case : Moon Warriors
 *
 * @Licensed:
 * This showcase is licensed under GPL.
 *
 *  @Authors:
 *  Programmer: Shengxiang Chen (陈升想), Dingping Lv (吕定平), Ricardo Quesada
 *  Effects animation: Hao Wu (吴昊)
 *  Quality Assurance: Sean Lin (林顺)
 *
 *  @Links:
 *  http://www.cocos2d-x.org
 *  http://bbs.html5china.com
 *
 */

//game state
MW.GAME_STATE = {
    HOME:0,
    PLAY:1,
    OVER:2
};

//keys
MW.KEYS = [];

//level
MW.LEVEL = {
    STAGE1:1,
    STAGE2:2,
    STAGE3:3
};

//life
MW.LIFE = 1;
MW.PLAYER_NAME = 'noname';
MW.needRacordName = false;
MW.recordPosted = false;
//score
MW.SCORE = 0;

//sound
MW.SOUND = true;

//enemy move type
MW.ENEMY_MOVE_TYPE = {
    ATTACK:0,
    VERTICAL:1,
    VERTICAL2:2,
    VERTICAL3:3,
    HORIZONTAL:4,
    OVERLAP:5
};


MW.GIFT_MOVE_TYPE = {
    ATTACK:0,
    VERTICAL:1,
    HORIZONTAL:2,
    OVERLAP:3
};


//delta x
MW.DELTA_X = -100;

//offset x
MW.OFFSET_X = -24;

//rot
MW.ROT = -5.625;

//bullet type
MW.BULLET_TYPE = {
    PLAYER:1,
    ENEMY:2
};

//weapon type
MW.WEAPON_TYPE = {
    ONE:1 
};

//unit tag
MW.UNIT_TAG = {
    ENMEY_BULLET:900,
    PLAYER_BULLET:901,
    ENEMY:1000,
    PLAYER:1000,
    GIFTS:1000
};

//attack mode
MW.ENEMY_ATTACK_MODE = {
    NORMAL:1,
    TSUIHIKIDAN:2
};
MW.CAR_STATE_TYPE = {
    NORMAL:0,
    B1:1,
    B2:2,
    B3:3,
    B4:4
};
MW.CAR_STATE = 0;
MW.GIFT_ATTACK_MODE = {
    NORMAL:1,
    TSUIHIKIDAN:2
};
MW.GIFT_Countdown = 0;
MW.GIFT_ActiveType = null;

//life up sorce
MW.LIFEUP_SORCE = [50000, 100000, 150000, 200000, 250000, 300000];

//container
MW.CONTAINER = {
    ENEMIES:[],
    ENEMY_BULLETS:[],
    PLAYER_BULLETS:[],
    EXPLOSIONS:[],
    SPARKS:[],
    HITS:[],
    BACKSKYS:[],
    BACKTILEMAPS:[],
    GIFTS:[]
};

//bullet speed
MW.BULLET_SPEED = {
    ENEMY:-200,
    SHIP:900
};
// the counter of active enemies
MW.ACTIVE_ENEMIES = 0;
MW.ACTIVE_GIFT = 0;

MW.TOP10 = [
    {"index":0,"name":"no1",    "value01":"2333333","value02":"0","value03":"0"},
    {"index":1,"name":"Yorhom", "value01":"933333","value02":"0","value03":"0"},
    {"index":2,"name":"yofine", "value01":"23333","value02":"0","value03":"0"},
    {"index":3,"name":"fan",    "value01":"23339","value02":"0","value03":"0"},
    {"index":4,"name":"no1",    "value01":"23338","value02":"0","value03":"0"},
    {"index":5,"name":"Yorhom", "value01":"23337","value02":"0","value03":"0"},
    {"index":6,"name":"yofine", "value01":"23336","value02":"0","value03":"0"},
    {"index":7,"name":"fan",    "value01":"23335","value02":"0","value03":"0"},
    {"index":8,"name":"no1",    "value01":"23334","value02":"0","value03":"0"},
    {"index":9,"name":"Yorhom", "value01":"1000","value02":"0","value03":"0"}
];


MW.Track = [0,0,0,0];
MW.Track_Position = [480,480,480,480];

MW.GiftRecord = [
                    {type:0, age:0},
                    {type:1, age:0},
                    {type:2, age:0},
                    {type:3, age:0}
                ];