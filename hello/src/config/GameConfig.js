

MW.DeviceOrientation = {};
MW.DeviceOrientation.initialX = null;
MW.DeviceOrientation.initialY = null;

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

//score
MW.SCORE = 0;

//sound
MW.SOUND = true;

//enemy move type
MW.ENEMY_MOVE_TYPE = {
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
    PLAYER:1000
};

//attack mode
MW.ENEMY_ATTACK_MODE = {
    NORMAL:1,
    TSUIHIKIDAN:2
};

//life up sorce
MW.LIFEUP_SORCE = [50000, 100000, 150000, 200000, 250000, 300000];

//container
MW.CONTAINER = {
    ENEMIES:[],
    EXPLOSIONS:[],
    SPARKS:[],
    BACKSKYS:[],
    BACKTILEMAPS:[]
};

//bullet speed

// the counter of active enemies
MW.ACTIVE_ENEMIES = 0;