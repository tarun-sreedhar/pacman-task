/*jslint browser: true, undef: true, eqeqeq: true, nomen: true, white: true */
/*global window: false, document: false */

/*
 * fix looped audio
 * add fruits + levels
 * fix what happens when a ghost is eaten (should go back to base)
 * do proper ghost mechanics (blinky/wimpy etc)
 */

var NONE        = 4,
    UP          = 3,
    LEFT        = 2,
    DOWN        = 1,
    RIGHT       = 11,
    WAITING     = 5,
    PAUSE       = 6,
    PLAYING     = 7,
    COUNTDOWN   = 8,
    EATEN_PAUSE = 9,
    DYING       = 10,
    Pacman      = {};

Pacman.userStartPos = null;
Pacman.ghostStartPos = null;
Pacman.totalTrials = 1;
Pacman.FPS = 15;
Pacman.attackVar1 = false;
Pacman.AFPS = 5;
Pacman.startingPositions = [
    [1,20,100  ],
    [2,60,140  ],
    [3,20,100  ],
    [4,130,50  ],
    [5,140,60  ],
    [6,50,130  ],
    [7,30,110  ],
    [8,140,60  ],
    [9,20,100  ],
    [10,120,40  ],
    [11,80,0  ],
    [12,50,130  ],
    [13,130,50  ],
    [14,60,140  ],
    [15,50,130  ],
    [16,140,60  ],
    [17,30,110  ],
    [18,40,120  ],
    [19,130,50  ],
    [20,130,50  ],
    [21,150,70  ],
    [22,50,130  ],
    [23,60,140  ],
    [24,60,140  ],
    [25,50,130  ],
    [26,30,110  ],
    [27,160,80  ],
    [28,120,40  ],
    [29,40,120  ],
    [30,140,60  ],
    [31,20,100  ],
    [32,140,60  ],
    [33,120,40  ],
    [34,150,70  ],
    [35,70,150  ],
    [36,140,60  ],
    [37,120,40  ],
    [38,50,130  ],
    [39,50,130  ],
    [40,70,150  ],
    [41,30,110  ],
    [42,160,80  ],
    [43,60,140  ],
    [44,50,130  ],
    [45,30,110  ],
    [46,120,40  ],
    [47,30,110  ],
    [48,40,120  ],
    [49,120,40  ],
    [50,80,0  ],
    [51,20,100  ],
    [52,60,140  ],
    [53,140,60  ],
    [54,30,110  ],
    [55,70,150  ],
    [56,70,150  ],
    [57,30,110  ],
    [58,50,130  ],
    [59,40,120  ],
    [60,70,150  ],
    [61,60,140  ],
    [62,30,110  ],
    [63,80,0  ],
    [64,70,150  ],
    [65,140,60  ],
    [66,140,60  ],
    [67,120,40  ],
    [68,60,140  ],
    [69,20,100  ],
    [70,20,100  ],
    [71,80,0  ],
    [72,50,130  ],
    [73,140,60  ],
    [74,130,50  ],
    [75,160,80  ],
    [76,50,130  ],
    [77,130,50  ],
    [78,150,70  ],
    [79,40,120  ],
    [80,60,140  ],
    [81,160,80  ],
    [82,120,40  ],
    [83,60,140  ],
    [84,160,80  ],
    [85,70,150  ],
    [86,30,110  ],
    [87,30,110  ],
    [88,120,40  ],
    [89,20,100  ],
    [90,30,110  ],
    [91,60,140  ],
    [92,120,40  ],
    [93,80,0  ],
    [94,120,40  ],
    [95,60,140  ],
    [96,50,130  ],
    [97,130,50  ],
    [98,50,130  ],
    [99,80,0  ],
    [100,140,60  ],
    [101,30,110  ],
    [102,150,70  ],
    [103,60,140  ],
    [104,70,150  ],
    [105,40,120  ],
    [106,70,150  ],
    [107,160,80  ],
    [108,20,100  ],
    [109,160,80  ],
    [110,130,50  ],
    [111,130,50  ],
    [112,60,140  ],
    [113,150,70  ],
    [114,130,50  ],
    [115,140,60  ],
    [116,120,40  ],
    [117,80,0  ],
    [118,70,150  ],
    [119,20,100  ],
    [120,60,140  ],
    [121,130,50  ],
    [122,80,0  ],
    [123,140,60  ],
    [124,150,70  ],
    [125,140,60  ],
    [126,140,60  ],
    [127,120,40  ],
    [128,20,100  ],
    [129,150,70  ],
    [130,130,50  ],
    [131,130,50  ],
    [132,40,120  ],
    [133,20,100  ],
    [134,70,150  ],
    [135,120,40  ],
    [136,150,70  ],
    [137,60,140  ],
    [138,20,100  ],
    [139,70,150  ],
    [140,20,100  ],
    [141,30,110  ],
    [142,30,110  ],
    [143,70,150  ],
    [144,70,150  ],
    [145,70,150  ],
    [146,70,150  ],
    [147,50,130  ],
    [148,160,80  ],
    [149,30,110  ],
    [150,140,60  ],
    [151,80,0  ],
    [152,160,80  ],
    [153,160,80  ],
    [154,140,60  ],
    [155,130,50  ],
    [156,20,100  ],
    [157,30,110  ],
    [158,120,40  ],
    [159,120,40  ],
    [160,30,110  ],
    [161,130,50  ],
    [162,160,80  ],
    [163,150,70  ],
    [164,30,110  ],
    [165,160,80  ],
    [166,30,110  ],
    [167,150,70  ],
    [168,140,60  ],
    [169,130,50  ],
    [170,160,80  ],
    [171,70,150  ],
    [172,60,140  ],
    [173,140,60  ],
    [174,20,100  ],
    [175,20,100  ],
    [176,60,140  ],
    [177,40,120  ],
    [178,160,80  ],
    [179,140,60  ],
    [180,20,100  ],
    [181,60,140  ],
    [182,40,120  ],
    [183,70,150  ],
    [184,140,60  ],
    [185,150,70  ],
    [186,50,130  ],
    [187,140,60  ],
    [188,20,100  ],
    [189,150,70  ],
    [190,150,70  ],
    [191,50,130  ],
    [192,50,130  ],
    [193,50,130  ],
    [194,150,70  ],
    [195,20,100  ],
    [196,130,50  ],
    [197,20,100  ],
    [198,160,80  ],
    [199,20,100  ],
    [200,50,130  ]
];


Pacman.User = function (game, map) {

    var
        direction = null,
        eaten     = null,
        due       = null,
        lives     = null,
        trials = null,
        score     = 5,
        keyMap    = {},
        //ghost = new Pacman.Ghost(game, map, "#FF00FF"),
        position = null;

    keyMap[KEY.ARROW_LEFT]  = LEFT;
    keyMap[KEY.ARROW_UP]    = UP;
    keyMap[KEY.ARROW_RIGHT] = RIGHT;
    keyMap[KEY.ARROW_DOWN]  = DOWN;

    function addScore(nScore) {
        score += nScore;
        if (score >= 10000 && score - nScore < 10000) {
            lives += 1;
        }
    };

    function theScore() {
        return score;
    };

    function loseLife() {
        lives -= 1;
        trials--;
    };

    function getLives() {
        return lives;
    };

    function getTrials() {
        return trials;
    };

    function getDirection() {
        return direction;
    };

    function getDue() {
        return due;
    }

    function initUser() {
        score = 0;
        lives = 3;
        trials = 20;
        newLevel();
    }

    function newLevel() {
        resetPosition();
        eaten = 0;
    };

    function resetPosition() {
        position = {"x": Pacman.startingPositions[Pacman.totalTrials - 1][1], "y": 100};
        direction = NONE;
        due = NONE;
    };

    function reset() {
        initUser();
        resetPosition();
        Pacman.attackVar1 = false;
    };

    function keyDown(e) {
        if (typeof keyMap[e.keyCode] !== "undefined") {
            due = keyMap[e.keyCode];
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        return true;
    };

    function getNewCoord(dir, current) {
        return {
            "x": current.x + (dir === LEFT && -2 || dir === RIGHT && 2 || 0),
            "y": current.y + (dir === DOWN && 2 || dir === UP    && -2 || 0)
        };
    };


    function onWholeSquare(x) {
        return x % 10 === 0;
    };

    function pointToCoord(x) {
        return Math.round(x/10);
    };

    function nextSquare(x, dir) {
        var rem = x % 10;
        if (rem === 0) {
            return x;
        } else if (dir === RIGHT || dir === DOWN) {
            return x + (10 - rem);
        } else {
            return x - rem;
        }
    };

    function next(pos, dir) {
        return {
            "y" : pointToCoord(nextSquare(pos.y, dir)),
            "x" : pointToCoord(nextSquare(pos.x, dir)),
        };
    };

    function onGridSquare(pos) {
        return onWholeSquare(pos.y) && onWholeSquare(pos.x);
    };

    function isOnSamePlane(due, dir) {
        return ((due === LEFT || due === RIGHT) &&
            (dir === LEFT || dir === RIGHT)) ||
            ((due === UP || due === DOWN) &&
                (dir === UP || dir === DOWN));
    };

    function move(ctx) {

        var npos        = null,
            nextWhole   = null,
            oldPosition = position,
            block       = null;

        if (due !== direction) {
            npos = getNewCoord(due, position);

            if (isOnSamePlane(due, direction) ||
                (onGridSquare(position) &&
                    map.isFloorSpace(next(npos, due)))) {
                direction = due;
            } else {
                npos = null;
            }
        }
        if (position.x === 10 || position.x === 170) {
            game.completedLevel();
            trials--;
        }

        if (npos === null) {
            npos = getNewCoord(direction, position);
        }

        if (onGridSquare(position) && map.isWallSpace(next(npos, direction))) {
            direction = NONE;
        }

        if (direction === NONE) {
            return {"new" : position, "old" : position};
        }

        if (npos.y === 100 && npos.x >= 190 && direction === RIGHT) {
            npos = {"y": 100, "x": -10};
        }

        if (npos.y === 100 && npos.x <= -12 && direction === LEFT) {
            npos = {"y": 100, "x": 190};
        }

        position = npos;
        nextWhole = next(position, direction);

        block = map.block(nextWhole);



        if ((isMidSquare(position.y) || isMidSquare(position.x)) &&
            block === Pacman.BISCUIT || block === Pacman.PILL) {

            map.setBlock(nextWhole, Pacman.EMPTY);
           /* if (position.x < ghost.getX()) {

            } */
            addScore((block === Pacman.BISCUIT) ? 10 : 50);
            eaten += 1;

            if (eaten === 5) {
                game.completedLevel();
                trials--;
            }

            if (block === Pacman.PILL) {
                game.eatenPill();
            }
        }
        return {
            "new" : position,
            "old" : oldPosition
        };

    };
    function getPosition() {
        //console.log(position);
        return position;
    };

    function isMidSquare(x) {
        var rem = x % 10;
        return rem > 3 || rem < 7;
    };

    function calcAngle(dir, pos) {
        if (dir == RIGHT && (pos.x % 10 < 5)) {
            return {"start":0.25, "end":1.75, "direction": false};
        } else if (dir === DOWN && (pos.y % 10 < 5)) {
            return {"start":0.75, "end":2.25, "direction": false};
        } else if (dir === UP && (pos.y % 10 < 5)) {
            return {"start":1.25, "end":1.75, "direction": true};
        } else if (dir === LEFT && (pos.x % 10 < 5)) {
            return {"start":0.75, "end":1.25, "direction": true};
        }
        return {"start":0, "end":2, "direction": false};
    };

    function drawDead(ctx, amount) {

        var size = map.blockSize,
            half = size / 2;

        if (amount >= 1) {
            return;
        }

        ctx.fillStyle = "#FFFF00";
        ctx.beginPath();
        ctx.moveTo(((position.x/10) * size) + half,
            ((position.y/10) * size) + half);

        ctx.arc(((position.x/10) * size) + half,
            ((position.y/10) * size) + half,
            half, 0, Math.PI * 2 * amount, true);

        ctx.fill();
    };

    function draw(ctx) {

        var s     = map.blockSize,
            angle = calcAngle(direction, position);

        ctx.fillStyle = "#00FF00";

        ctx.beginPath();

        ctx.moveTo(((position.x/10) * s) + s / 2,
            ((position.y/10) * s) + s / 2);

        ctx.arc(((position.x/10) * s) + s / 2,
            ((position.y/10) * s) + s / 2,
            s / 2, Math.PI * angle.start,
            Math.PI * angle.end, angle.direction);

        ctx.fill();
    };

    initUser();

    return {
        "draw"          : draw,
        "drawDead"      : drawDead,
        "loseLife"      : loseLife,
        "getLives"      : getLives,
        "getTrials"     : getTrials,
        "getPosition"  : getPosition,
        "score"         : score,
        "getDirection"  : getDirection,
        "getDue"        : getDue,
        "addScore"      : addScore,
        "theScore"      : theScore,
        "keyDown"       : keyDown,
        "move"          : move,
        "newLevel"      : newLevel,
        "reset"         : reset,
        "resetPosition" : resetPosition,
        "getNewCoord"   : getNewCoord
    };
};

Pacman.Ghost = function (game, map, colour) {

    var position = null,
        direction = null,
        eatable = null,
        eaten = null,
        due = null,
        attackVar = false,
        chaseVar = false,
        bobVar = false,
        bobCount = null,
        chaseCount = null,
        attackCount = null,
        attackDist = null,
        wallDist = null,
        fps = 18,
        pacman2 = new Pacman.User(game, map);

    function getNewCoord(dir, current) {
        /* return {
             "x": current.x + (dir === LEFT && -2 || dir === RIGHT && 2 || 0),
             "y": current.y + (dir === DOWN && 2 || dir === UP    && -2 || 0)
         } */

        var speed = isVunerable() ? 1 : isHidden() ? 4 : 2,
            xSpeed = (dir === LEFT && -speed || dir === RIGHT && speed || 0),
            ySpeed = (dir === DOWN && speed || dir === UP && -speed || 0);

        return {
            "x": addBounded(current.x, xSpeed),
            "y": addBounded(current.y, ySpeed)
        };
    };

    function getNewAttackCoord(x, y) {
       // let moveAmount = Math.ceil(wallDist / attackDist) * 4;
        if (PACMAN.getUserPos() < PACMAN.getGhostPos()) {
           // if (x - moveAmount < PACMAN.getUserPos()) {
            if (x - 3 < PACMAN.getUserPos()) {
                return {
                    "x" : PACMAN.getUserPos(),
                    "y" : y
                }
            } else {
                return {
                    "x" : x - 3,
                    "y" : y
                }
            }
        } else {
            //if (x + moveAmount > PACMAN.getUserPos()) {
            if (x + 3 < PACMAN.getUserPos()) {
                return {
                    "x" : PACMAN.getUserPos,
                    "y" : y
                }
            } else {
                return {
                    "x" : x + 3,
                    "y" : y
                }
            }
        }
    }

    /* Collision detection(walls) is done when a ghost lands on an
     * exact block, make sure they dont skip over it
     */
    function addBounded(x1, x2) {
        var rem = x1 % 10,
            result = rem + x2;
        if (rem !== 0 && result > 10) {
            return x1 + (10 - rem);
        } else if (rem > 0 && result < 0) {
            return x1 - rem;
        }
        return x1 + x2;
    };

    function isVunerable() {
        return eatable !== null;
    };

    function isDangerous() {
        return eaten === null;
    };

    function isHidden() {
        return eatable === null && eaten !== null;
    };

    function getRandomDirection() {
       /* var moves = (direction === LEFT || direction === RIGHT)
            ? [UP, DOWN] : [LEFT, RIGHT];
        return moves[Math.floor(Math.random() * 2)]; */
        let x = Math.random() * 100;
        if (x >= 50) {
            return 11;
        } else {
            return 2;
        }
    };

    function reset() {
        eaten = null;
        eatable = null;
        position = {"x": Pacman.startingPositions[Pacman.totalTrials - 1][2], "y": 100};
        direction = getRandomDirection();
        due = getRandomDirection();
        chaseCount = 0;
        attackCount = 0;
    };

    function onWholeSquare(x) {
        return x % 10 === 0;
    };

    function oppositeDirection(dir) {
        return dir === LEFT && RIGHT ||
            dir === RIGHT && LEFT;
    };

    function makeEatable() {
        direction = oppositeDirection(direction);
        eatable = game.getTick();
    };

    function eat() {
        eatable = null;
        eaten = game.getTick();
    };

    function pointToCoord(x) {
        return Math.round(x / 10);
    };

    function nextSquare(x, dir) {
        var rem = x % 10;
        if (rem === 0) {
            return x;
        } else if (dir === RIGHT || dir === DOWN) {
            return x + (10 - rem);
        } else {
            return x - rem;
        }
    };

    function onGridSquare(pos) {
        return onWholeSquare(pos.y) && onWholeSquare(pos.x);
    };

    function secondsAgo(tick) {
        return (game.getTick() - tick) / fps;
    };

    function getColour() {
        if (eatable) {
            if (secondsAgo(eatable) > 5) {
                return game.getTick() % 20 > 10 ? "#FFFFFF" : "#0000BB";
            } else {
                return "#0000BB";
            }
        } else if (eaten) {
            return "#222";
        }
        return colour;
    };

    function draw(ctx) {
       /* if (attackVar === true) {

        } */

        var s = map.blockSize,
            top = (position.y / 10) * s,
            left = (position.x / 10) * s;

        if (eatable && secondsAgo(eatable) > 8) {
            eatable = null;
        }

        if (eaten && secondsAgo(eaten) > 3) {
            eaten = null;
        }

        var tl = left + s;
        var base = top + s - 3;
        var inc = s / 10;

        var high = game.getTick() % 10 > 5 ? 3 : -3;
        var low = game.getTick() % 10 > 5 ? -3 : 3;

        ctx.fillStyle = getColour();
        ctx.beginPath();

        ctx.moveTo(left, base);

        ctx.quadraticCurveTo(left, top, left + (s / 2), top);
        ctx.quadraticCurveTo(left + s, top, left + s, base);

        // Wavy things at the bottom
        ctx.quadraticCurveTo(tl - (inc * 1), base + high, tl - (inc * 2), base);
        ctx.quadraticCurveTo(tl - (inc * 3), base + low, tl - (inc * 4), base);
        ctx.quadraticCurveTo(tl - (inc * 5), base + high, tl - (inc * 6), base);
        ctx.quadraticCurveTo(tl - (inc * 7), base + low, tl - (inc * 8), base);
        ctx.quadraticCurveTo(tl - (inc * 9), base + high, tl - (inc * 10), base);

        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = "#FFF";
        ctx.arc(left + 6, top + 6, s / 6, 0, 300, false);
        ctx.arc((left + s) - 6, top + 6, s / 6, 0, 300, false);
        ctx.closePath();
        ctx.fill();

        var f = s / 12;
        var off = {};
        off[RIGHT] = [f, 0];
        off[LEFT] = [-f, 0];
        //off[UP]    = [0, -f];
        //off[DOWN]  = [0, f];

        ctx.beginPath();
        ctx.fillStyle = "#000";
        ctx.arc(left + 6, top + 6,
            s / 15, 0, 300, false);
        ctx.arc((left + s) - 6, top + 6,
            s / 15, 0, 300, false);
        ctx.closePath();
        ctx.fill();

    };

    function pane(pos) {

        if (pos.y === 100 && pos.x >= 190 && direction === RIGHT) {
            return {"y": 100, "x": -10};
        }

        if (pos.y === 100 && pos.x <= -10 && direction === LEFT) {
            return position = {"y": 100, "x": 190};
        }

        return false;
    };

    function distance() {
        //console.log((Math.abs(PACMAN.getUserPos() - PACMAN.getGhostPos())));
        //console.log("User Position" + PACMAN.getUserPos());
        //console.log(PACMAN.getGhostPos());
        //return Math.abs(PACMAN.getUserPos() );
        //console.log(PACMAN.getGhostPos());
        //console.log(PACMAN.getUserPos());
        //console.log(Math.abs(PACMAN.getGhostPos() - PACMAN.getUserPos()));
        return Math.abs(PACMAN.getGhostPos() - PACMAN.getUserPos());
    }


    function chase(ctx) {
        console.log("chased.")
        if (PACMAN.getUserPos() < PACMAN.getGhostPos()) {
            due = LEFT;
            direction = LEFT;
        } else {
            due = RIGHT;
            direction = RIGHT;
        }
        return move(ctx);
    }

    function bob(ctx) {
        if (bobCount >= 10) {
            console.log("Bobbed.")
            due = oppositeDirection(due);
            direction = oppositeDirection(direction);
            bobCount = 0;
            return move(ctx);
        }
    }

    function attack(ctx) {
        console.log(distance() + " Attacked.");
         Pacman.attackVar1 = true;
        attackVar = true;
        let npos;
        if (PACMAN.getUserPos() < PACMAN.getGhostPos()) {
            direction = LEFT;
            due = LEFT;
            var oldPos = position;
            npos = getNewAttackCoord(oldPos.x ,PACMAN.getGhostPosY());
            position = npos;
            return {
                "new": position,
                "old": oldPos
            };
        } else {
            direction = RIGHT;
            due = RIGHT;
            var oldPos = position;
            npos = getNewAttackCoord(oldPos.x, PACMAN.getGhostPosY());
            position = npos;
            return {
                "new" : position,
                "old" : oldPos
            };
        }
        //PACMAN.loseLife();
        //PACMAN.completedLevel();
    }

    function getX() {
        return position.x;
    }


    function move(ctx) {

        var oldPos = position
        onGrid = onGridSquare(position),
            npos = null;
        if (due !== direction) {

            npos = getNewCoord(due, position);

            if (onGrid &&
                map.isFloorSpace({
                    "y": pointToCoord(nextSquare(npos.y, due)),
                    "x": pointToCoord(nextSquare(npos.x, due))
                })) {
                direction = due;
            } else {
                npos = null;
            }
        }

        if (npos === null) {
            npos = getNewCoord(direction, position);
        }

        let tracker = Math.random() * 100;
        //console.log(tracker);

    if (onGrid &&
        map.isWallSpace({
            "y": pointToCoord(nextSquare(npos.y, direction)),
            "x": pointToCoord(nextSquare(npos.x, direction))
        })) {

        due = oppositeDirection(due);
        direction = oppositeDirection(direction);
        return move(ctx);
    }
      if (chaseVar === false && bobVar === false) {
        if (distance() >= 100) {
            if ((tracker <= 10.67379 / 25) || attackCount >= 1) {
                if (attackCount === 0) {
                    attackDist = distance();
                    if (PACMAN.getUserPos() < PACMAN.getGhostPos()) {
                      wallDist = PACMAN.getUserPos();
                    }
                }
                attackVar = true;
                attackCount++;
                return attack(ctx);
            } else if ((tracker > 10.67379 / 25 && tracker <= (29.47 + 10.67379) / 25) || chaseCount >= 1) {
                chaseVar = true;
                chaseCount++;
                chase(ctx);
            } else {
                bobVar = true;
                bobCount++;
                if (bobCount < 10) {
                    console.log(bobCount, "hit bob, but bobCount not 5");
                    return move(ctx);
                } else {
                    bob(ctx);
                }
            }
      } else if (distance() >= 90 && distance() < 100) {
          if ((tracker <= 11.11090 / 25) || attackCount >= 1) {
              attackVar = true;
              if (attackCount === 0) {
                  attackDist = distance();
                  if (PACMAN.getUserPos() < PACMAN.getGhostPos()) {
                      wallDist = PACMAN.getUserPos();
                  }
              }
              attackCount++;
              return attack(ctx);
            } else if ((tracker > 11.11090 / 25 && tracker <= (29.33403 + 11.11090) / 25) || chaseCount >= 1) {
              chaseVar = true;
              chaseCount++;
              chase(ctx);
            } else {
              bobVar = true;
              bobCount++;
              if (bobCount < 10) {
                  console.log(bobCount, "hit bob, but bobCount not 5");
                  return move(ctx);
              } else {
                  bob(ctx);
              }
            }
      } else if (distance() >= 80 && distance() < 90) {
            if ((tracker <= 11.83156 / 25) || attackCount >= 1) {
                attackVar = true;
                if (attackCount === 0) {
                    attackDist = distance();
                    if (PACMAN.getUserPos() < PACMAN.getGhostPos()) {
                        wallDist = PACMAN.getUserPos();
                    }
                }
                attackCount++;
                return attack(ctx);
            } else if ((tracker > 11.83156 / 25 && tracker <= (29.0955 + 11.83156) / 25) || chaseCount >= 1) {
                chaseVar = true;
                chaseCount++;
                chase(ctx);
            } else {
                bobVar = true;
                bobCount++;
                if (bobCount < 20) {
                    console.log(bobCount, "hit bob, but bobCount not 5");
                    return move(ctx);
                } else {
                    bob(ctx);
                }
            }
      } else if (distance() >= 70 && distance() < 80) {
         if ((tracker <= 13.01974 / 25) || attackCount >= 1) {
             attackVar = true;
             if (attackCount === 0) {
                 attackDist = distance();
                 if (PACMAN.getUserPos() < PACMAN.getGhostPos()) {
                     wallDist = PACMAN.getUserPos();
                 }
             }
             attackCount++;
             return attack(ctx);
            } else if ((tracker > 13.01974 / 25 && tracker <= (28.7034858 + 13.01974) / 25) || chaseCount >= 1) {
             chaseVar = true;
             chaseCount++;
             chase(ctx);
            } else {
             bobVar = true;
             bobCount++;
             if (bobCount < 20) {
                 console.log(bobCount, "hit bob, but bobCount not 5");
                 return move(ctx);
             } else {
                 bob(ctx);
             }
            }
      } else if (distance() >= 60 && distance() < 70) {
          if ((tracker <= 14.97871 / 25) || attackCount >= 1) {
              attackVar = true;
              if (attackCount === 0) {
                  attackDist = distance();
                  if (PACMAN.getUserPos() < PACMAN.getGhostPos()) {
                      wallDist = PACMAN.getUserPos();
                  }
              }
              attackCount++;
              return attack(ctx);
            } else if ((tracker > 14.97871 / 25 && tracker <= (28.057 + 14.97871) / 25) || chaseCount >= 1) {
              chaseVar = true;
              chaseCount++;
              chase(ctx);
            } else {
              bobVar = true;
              bobCount++;
              if (bobCount < 20) {
                  console.log(bobCount, "hit bob, but bobCount not 5");
                  return move(ctx);
              } else {
                  bob(ctx);
              }
            }
      } else if (distance() >= 50 && distance() < 60) {
          if ((tracker <= 18.20850 / 25) || attackCount >= 1) {
              attackVar = true;
              if (attackCount === 0) {
                  attackDist = distance();
                  if (PACMAN.getUserPos() < PACMAN.getGhostPos()) {
                      wallDist = PACMAN.getUserPos();
                  }
              }
              attackCount++;
              return attack(ctx);
            } else if ((tracker > 18.20850 / 25 && tracker <= (26.991195 + 18.20850) / 25) || chaseCount >= 1) {
              chaseVar = true;
              chaseCount++;
              chase(ctx);
            } else {
              bobVar = true;
              bobCount++;
              if (bobCount < 20) {
                  console.log(bobCount, "hit bob, but bobCount not 5");
                  return move(ctx);
              } else {
                  bob(ctx);
              }
            }
      } else if (distance() >= 40 && distance() < 50) {
          if ((tracker <= 23.53353 / 25) || attackCount >= 1) {
              attackVar = true;
              if (attackCount === 0) {
                  attackDist = distance();
                  if (PACMAN.getUserPos() < PACMAN.getGhostPos()) {
                      wallDist = PACMAN.getUserPos();
                  }
              }
              attackCount++;
              return attack(ctx);
            } else if ((tracker > 23.53353 / 25 && tracker <= (25.2339351 + 23.53353) / 25) || chaseCount >= 1) {
              chaseVar = true;
              chaseCount++;
              chase(ctx);
            } else {
              bobVar = true;
              bobCount++;
              if (bobCount < 20) {
                  console.log(bobCount, "hit bob, but bobCount not 5");
                  return move(ctx);
              } else {
                  bob(ctx);
              }
            }
      } else if (distance() >= 30 && distance() < 40) {
          if ((tracker <= 32.31302 / 25) || attackCount >= 1) {
              attackVar = true;
              if (attackCount === 0) {
                  attackDist = distance();
                  if (PACMAN.getUserPos() < PACMAN.getGhostPos()) {
                      wallDist = PACMAN.getUserPos();
                  }
              }
              attackCount++;
              return attack(ctx);
            } else if ((tracker > 32.31302 / 25 && tracker <= (22.336 + 32.31302) / 25) || chaseCount >= 1) {
              chaseVar = true;
              chaseCount++;
              chase(ctx);
            } else {
              bobVar = true;
              bobCount++;
              if (bobCount < 20) {
                  console.log(bobCount, "hit bob, but bobCount not 5");
                  return move(ctx);
              } else {
                  bob(ctx);
              }
            }
      } else if (distance() >= 20 && distance() < 30) {
          if ((tracker <= 46.78794 / 25) || attackCount >= 1) {
              attackVar = true;
              if (attackCount === 0) {
                  attackDist = distance();
                  if (PACMAN.getUserPos() < PACMAN.getGhostPos()) {
                      wallDist = PACMAN.getUserPos();
                  }
              }
              attackCount++;
              return attack(ctx);
            } else if ((tracker > 46.78794 / 25 && tracker <= (17.55997 + 46.78794) / 25) || chaseCount >= 1) {
              chaseVar = true;
              chaseCount++;
              chase(ctx);
            } else {
              bobVar = true;
              bobCount++;
              if (bobCount < 20) {
                  console.log(bobCount, "hit bob, but bobCount not 5");
                  return move(ctx);
              } else {
                  bob(ctx);
              }
            }
      } else if (distance() >= 10 && distance() < 20) {
          if ((tracker <= 70.65307 / 25) || attackCount >= 1) {
              attackVar = true;
              if (attackCount === 0) {
                  attackDist = distance();
                  if (PACMAN.getUserPos() < PACMAN.getGhostPos()) {
                      wallDist = PACMAN.getUserPos();
                  }
              }
              attackCount++;
              return attack(ctx);
            } else if ((tracker > 70.65307 / 25 && tracker <= (9.6844869 + 70.65307) / 25) || chaseCount >= 1) {
              chaseVar = true;
              chaseCount++;
              chase(ctx);
            } else {
              bobVar = true;
              bobCount++;
              if (bobCount < 20) {
                  console.log(bobCount, "hit bob, but bobCount not 5");
                  return move(ctx);
              } else {
                  bob(ctx);
              }
            }
      } }

    position = npos;
    var tmp = pane(position);
    if (tmp) {
        position = tmp;
    }
    bobVar = false;
    chaseVar = false;
    attackVar = false;
    return {
        "new": position,
        "old": oldPos
    };
}

    return {
        "eat"         : eat,
        "isVunerable" : isVunerable,
        "isDangerous" : isDangerous,
        "makeEatable" : makeEatable,
        "reset"       : reset,
        "move"        : move,
        "draw"        : draw,
        "getX" : getX,
        "getNewAttackCoord" : getNewAttackCoord
    };
};

Pacman.Map = function (size) {

    var height    = null,
        width     = null,
        blockSize = size,
        pillSize  = 0,
        map       = null;

    function withinBounds(y, x) {
        return y >= 0 && y < height && x >= 0 && x < width;
    }

    function isWall(pos) {
        return withinBounds(pos.y, pos.x) && map[pos.y][pos.x] === Pacman.WALL;
    }

    function isFloorSpace(pos) {
        if (!withinBounds(pos.y, pos.x)) {
            return false;
        }
        var peice = map[pos.y][pos.x];
        return peice === Pacman.EMPTY ||
            peice === Pacman.BISCUIT ||
            peice === Pacman.PILL;
    }

    function drawWall(ctx) {

        var i, j, p, line;

        ctx.strokeStyle = "#0000FF";
        ctx.lineWidth   = 5;
        ctx.lineCap     = "round";

        for (i = 0; i < Pacman.WALLS.length; i += 1) {
            line = Pacman.WALLS[i];
            ctx.beginPath();

            for (j = 0; j < line.length; j += 1) {

                p = line[j];

                if (p.move) {
                    ctx.moveTo(p.move[0] * blockSize, p.move[1] * blockSize);
                } else if (p.line) {
                    ctx.lineTo(p.line[0] * blockSize, p.line[1] * blockSize);
                } else if (p.curve) {
                    ctx.quadraticCurveTo(p.curve[0] * blockSize,
                        p.curve[1] * blockSize,
                        p.curve[2] * blockSize,
                        p.curve[3] * blockSize);
                }
            }
            ctx.stroke();
        }
    }

    function reset() {
        map    = Pacman.MAP.clone();
        height = map.length;
        width  = map[0].length;
    };

    function block(pos) {
        return map[pos.y][pos.x];
    };

    function setBlock(pos, type) {
        map[pos.y][pos.x] = type;
    };

    function drawPills(ctx) {

        if (++pillSize > 30) {
            pillSize = 0;
        }

        for (i = 0; i < height; i += 1) {
            for (j = 0; j < width; j += 1) {
                if (map[i][j] === Pacman.PILL) {
                    ctx.beginPath();

                    ctx.fillStyle = "#000";
                    ctx.fillRect((j * blockSize), (i * blockSize),
                        blockSize, blockSize);

                    ctx.fillStyle = "#FFF";
                    ctx.arc((j * blockSize) + blockSize / 2,
                        (i * blockSize) + blockSize / 2,
                        Math.abs(5 - (pillSize/3)),
                        0,
                        Math.PI * 2, false);
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    };

    function draw(ctx) {

        var i, j, size = blockSize;

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, width * size, height * size);

        drawWall(ctx);

        for (i = 0; i < height; i += 1) {
            for (j = 0; j < width; j += 1) {
                drawBlock(i, j, ctx);
            }
        }
    };

    function drawBlock(y, x, ctx) {

        var layout = map[y][x];

        if (layout === Pacman.PILL) {
            return;
        }

        ctx.beginPath();

        if (layout === Pacman.EMPTY || layout === Pacman.BLOCK ||
            layout === Pacman.BISCUIT) {

            ctx.fillStyle = "#000";
            ctx.fillRect((x * blockSize), (y * blockSize),
                blockSize, blockSize);

            if (layout === Pacman.BISCUIT) {
                ctx.fillStyle = "#FFF";
                ctx.fillRect((x * blockSize) + (blockSize / 2.5),
                    (y * blockSize) + (blockSize / 2.5),
                    blockSize / 6, blockSize / 6);
            }
        }
        ctx.closePath();
    };

    reset();

    return {
        "draw"         : draw,
        "drawBlock"    : drawBlock,
        "drawPills"    : drawPills,
        "block"        : block,
        "setBlock"     : setBlock,
        "reset"        : reset,
        "isWallSpace"  : isWall,
        "isFloorSpace" : isFloorSpace,
        "height"       : height,
        "width"        : width,
        "blockSize"    : blockSize
    };
};

Pacman.Audio = function(game) {

    var files          = [],
        endEvents      = [],
        progressEvents = [],
        playing        = [];

    function load(name, path, cb) {

        var f = files[name] = document.createElement("audio");

        progressEvents[name] = function(event) { progress(event, name, cb); };

        f.addEventListener("canplaythrough", progressEvents[name], true);
        f.setAttribute("preload", "true");
        f.setAttribute("autobuffer", "true");
        f.setAttribute("src", path);
        f.pause();
    };

    function progress(event, name, callback) {
        if (event.loaded === event.total && typeof callback === "function") {
            callback();
            files[name].removeEventListener("canplaythrough",
                progressEvents[name], true);
        }
    };

    function disableSound() {
        for (var i = 0; i < playing.length; i++) {
            files[playing[i]].pause();
            files[playing[i]].currentTime = 0;
        }
        playing = [];
    };

    function ended(name) {

        var i, tmp = [], found = false;

        files[name].removeEventListener("ended", endEvents[name], true);

        for (i = 0; i < playing.length; i++) {
            if (!found && playing[i]) {
                found = true;
            } else {
                tmp.push(playing[i]);
            }
        }
        playing = tmp;
    };

    function play(name) {
        if (!game.soundDisabled()) {
            endEvents[name] = function() { ended(name); };
            playing.push(name);
            files[name].addEventListener("ended", endEvents[name], true);
            files[name].play();
        }
    };

    function pause() {
        for (var i = 0; i < playing.length; i++) {
            files[playing[i]].pause();
        }
    };

    function resume() {
        for (var i = 0; i < playing.length; i++) {
            files[playing[i]].play();
        }
    };

    return {
        "disableSound" : disableSound,
        "load"         : load,
        "play"         : play,
        "pause"        : pause,
        "resume"       : resume
    };
};

var PACMAN = (function () {

    var state        = WAITING,
        audio        = null,
        ghost1       = null,
        ghostSpecs   = ["#FF00FF"],
        eatenCount   = 0,
        level        = 0,
        tick         = 0,
        ghostPos, userPos, ghostPosX, userPosX, ghostPosY
        stateChanged = true,
        timerStart   = null,
        lastTime     = 0,
        ctx          = null,
        timer        = null,
        map          = null,
        user         = null,
        stored       = null;

    function getTick() {
        return tick;
    };

    function drawScore(text, position) {
        ctx.fillStyle = "#FFFFFF";
        ctx.font      = "12px BDCartoonShoutRegular";
        ctx.fillText(text,
            (position["new"]["x"] / 10) * map.blockSize,
            ((position["new"]["y"] + 5) / 10) * map.blockSize);
    }

    function dialog(text) {
        ctx.fillStyle = "#FFFF00";
        ctx.font      = "18px Monaco";
        var width = ctx.measureText(text).width,
            x     = ((map.width * map.blockSize) - width) / 2;
        ctx.fillText(text, x, (map.height * 10) + 8);
    }

    function soundDisabled() {
        return localStorage["soundDisabled"] === "true";
    };

    function startLevel() {
        if (Pacman.totalTrials === 200) {
            Pacman.totalTrials = 1;
        } else {
            Pacman.totalTrials++;
        }
        map.reset();
        map.draw(ctx);
        user.resetPosition();
        ghost1.reset();
        //audio.play("start");
        timerStart = tick;
        setState(COUNTDOWN);
    }

    function startNewGame() {
        setState(WAITING);
        level = 1;
        user.reset();
        map.reset();
        map.draw(ctx);
        startLevel();
    }

    function keyDown(e) {
        if (e.keyCode === KEY.N) {
            startNewGame();
        } else if (e.keyCode === KEY.S) {
            audio.disableSound();
            localStorage["soundDisabled"] = !soundDisabled();
        } else if (e.keyCode === KEY.P && state === PAUSE) {
            audio.resume();
            map.draw(ctx);
            setState(stored);
        } else if (e.keyCode === KEY.P) {
            stored = state;
            setState(PAUSE);
            audio.pause();
            map.draw(ctx);
            dialog("Paused");
        } else if (state !== PAUSE) {
            return user.keyDown(e);
        }
        return true;
    }

    function loseLife() {
        setState(WAITING);
        user.loseLife();
        if (user.getLives() > 0 && user.getTrials() > 0) {
            startLevel();
        }
    }

    function setState(nState) {
        state = nState;
        stateChanged = true;
    };

    function collided(user, ghost) {
        return (Math.sqrt(Math.pow(ghost.x - user.x, 2) +
            Math.pow(ghost.y - user.y, 2))) < 10;
    };

    function drawFooter() {

        var topLeft  = (map.height * map.blockSize),
            textBase = topLeft + 17;

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, topLeft, (map.width * map.blockSize), 30);

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, topLeft, (map.width * map.blockSize), 30);

        ctx.fillStyle = "#FFFF00";

        for (var i = 0, len = user.getLives(); i < len; i++) {
            ctx.fillStyle = "#FFFF00";
            ctx.beginPath();
            ctx.moveTo(150 + (25 * i) + map.blockSize / 2,
                (topLeft+1) + map.blockSize / 2);

            ctx.arc(150 + (25 * i) + map.blockSize / 2,
                (topLeft+1) + map.blockSize / 2,
                map.blockSize / 2, Math.PI * 0.25, Math.PI * 1.75, false);
            ctx.fill();
            ctx.fillStyle = "#FFFF00";
            ctx.font      = "14px Monaco";
            ctx.fillText("Trials: " + user.getTrials(), 255, textBase);

        }

        ctx.fillStyle = !soundDisabled() ? "#00FF00" : "#FF0000";
        ctx.font = "bold 16px sans-serif";
        //ctx.fillText("♪", 10, textBase);

        ctx.fillStyle = "#FFFF00";
        ctx.font      = "14px Monaco";
        ctx.fillText("Score: " + user.theScore(), 20, textBase);
    }

    function redrawBlock(pos) {
        map.drawBlock(Math.floor(100/10), Math.floor(pos.x/10), ctx);
        map.drawBlock(Math.ceil(100/10), Math.ceil(pos.x/10), ctx);
    }

    function mainDraw() {

        var diff, u, i, len, nScore;

        u = user.move(ctx);
        let g = ghost1.move(ctx);
        redrawBlock(g.old);
        redrawBlock(u.old);
        ghost1.draw(ctx);
        user.draw(ctx);

        userPos = u["new"];
        ghostPos = g["new"];
        ghostPosX = g["new"].x;
        userPosX = u["new"].x;
        ghostPosY = g["new"].y;


            if (collided(userPos, ghostPos)) {
                if (ghost1.isVunerable()) {
                    audio.play("eatghost");
                    ghost1.eat();
                    eatenCount += 1;
                    nScore = eatenCount * 50;
                    drawScore(nScore, ghostPos);
                    user.addScore(nScore);
                    setState(EATEN_PAUSE);
                    timerStart = tick;
                } else if (ghost1.isDangerous()) {
                    //audio.play("die");
                    setState(DYING);
                    timerStart = tick;
                }
            }
    };

    function mainLoop() {
        var diff;

        if (state !== PAUSE) {
            ++tick;
        }

        map.drawPills(ctx);

        if (state === PLAYING) {
            mainDraw();
        } else if (state === WAITING && stateChanged) {
            stateChanged = false;
            map.draw(ctx);
            dialog("Press n to start a new game!");
        } else if (state === EATEN_PAUSE &&
            (tick - timerStart) > (Pacman.FPS / 3)) {
            map.draw(ctx);
            setState(PLAYING);
        } else if (state === DYING) {
            if (tick - timerStart > (Pacman.FPS * 2)) {
                loseLife();
            } else {
                redrawBlock(userPos);
                redrawBlock(ghostPos);
                ghostPos = ghost1.draw(ctx);
                user.drawDead(ctx, (tick - timerStart) / (Pacman.FPS * 2));
            }
        } else if (state === COUNTDOWN) {

            diff = 5 + Math.floor((timerStart - tick) / Pacman.FPS);

            if (diff === 0) {
                map.draw(ctx);
                setState(PLAYING);
            } else {
                if (diff !== lastTime) {
                    lastTime = diff;
                    map.draw(ctx);
                    dialog("Starting in: " + diff);
                }
            }
        }

        drawFooter();
    }


    function eatenPill() {
        audio.play("eatpill");
        timerStart = tick;
        eatenCount = 0;
        ghost1.makeEatable(ctx);
    };

    function completedLevel() {
        setState(WAITING);
        level += 1;
        map.reset();
        user.newLevel();
        startLevel();
    };

    function keyPress(e) {
        if (state !== WAITING && state !== PAUSE) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    function getUserPos() {
        //console.log(userPos);
        return userPosX;
    }

    function getGhostPosY() {
        return ghostPosY;
    }

    function getUserDir() {
        return user.direction;
    }

    function getUserDue() {
        return user.getDue();
    }

    function init(wrapper, root) {

        var i, len, ghost,
            blockSize = wrapper.offsetWidth / 19,
            canvas    = document.createElement("canvas");

        canvas.setAttribute("width", (blockSize * 19) + "px");
        canvas.setAttribute("height", (blockSize * 22) + 30 + "px");

        wrapper.appendChild(canvas);

        ctx  = canvas.getContext('2d');

        audio = new Pacman.Audio({"soundDisabled":soundDisabled});
        map   = new Pacman.Map(blockSize);
        user  = new Pacman.User({
            "completedLevel" : completedLevel,
            "eatenPill"      : eatenPill
        }, map);

            ghost1 = new Pacman.Ghost({"getTick":getTick}, map, ghostSpecs[0]);


        map.draw(ctx);
        dialog("Loading ...");

        var extension = Modernizr.audio.ogg ? 'ogg' : 'mp3';

        var audio_files = [
            ["start", root + "audio/opening_song." + extension],
            ["die", root + "audio/die." + extension],
            ["eatghost", root + "audio/eatghost." + extension],
            ["eatpill", root + "audio/eatpill." + extension],
            ["eating", root + "audio/eating.short." + extension],
            ["eating2", root + "audio/eating.short." + extension]
        ];

        load(audio_files, function() { loaded(); });
    };

    function load(arr, callback) {

        if (arr.length === 0) {
            callback();
        } else {
            var x = arr.pop();
            audio.load(x[0], x[1], function() { load(arr, callback); });
        }
    };

    function loaded() {

        dialog("Press N to Start");

        document.addEventListener("keydown", keyDown, true);
        document.addEventListener("keypress", keyPress, true);

        timer = window.setInterval(mainLoop, 1000 / Pacman.FPS);
        /*if (Pacman.attackVar1 === true) {
            window.setInterval(user.move, 1000/Pacman.AFPS)
        } */
    };

    function getGhostPos() {
        return ghostPosX;
    }

    return {
       "getUserPos": getUserPos,
        "getGhostPos": getGhostPos,
        "loseLife": loseLife,
        "completedLevel": completedLevel,
        "getUserDir" : getUserDir,
        "getUserDue" : getUserDue,
        "init" : init,
        "getGhostPosY" : getGhostPosY
    };

}());

/* Human readable keyCode index */
var KEY = {'BACKSPACE': 8, 'TAB': 9, 'NUM_PAD_CLEAR': 12, 'ENTER': 13, 'SHIFT': 16, 'CTRL': 17, 'ALT': 18, 'PAUSE': 19, 'CAPS_LOCK': 20, 'ESCAPE': 27, 'SPACEBAR': 32, 'PAGE_UP': 33, 'PAGE_DOWN': 34, 'END': 35, 'HOME': 36, 'ARROW_LEFT': 37, 'ARROW_UP': 38, 'ARROW_RIGHT': 39, 'ARROW_DOWN': 40, 'PRINT_SCREEN': 44, 'INSERT': 45, 'DELETE': 46, 'SEMICOLON': 59, 'WINDOWS_LEFT': 91, 'WINDOWS_RIGHT': 92, 'SELECT': 93, 'NUM_PAD_ASTERISK': 106, 'NUM_PAD_PLUS_SIGN': 107, 'NUM_PAD_HYPHEN-MINUS': 109, 'NUM_PAD_FULL_STOP': 110, 'NUM_PAD_SOLIDUS': 111, 'NUM_LOCK': 144, 'SCROLL_LOCK': 145, 'SEMICOLON': 186, 'EQUALS_SIGN': 187, 'COMMA': 188, 'HYPHEN-MINUS': 189, 'FULL_STOP': 190, 'SOLIDUS': 191, 'GRAVE_ACCENT': 192, 'LEFT_SQUARE_BRACKET': 219, 'REVERSE_SOLIDUS': 220, 'RIGHT_SQUARE_BRACKET': 221, 'APOSTROPHE': 222};

(function () {
    /* 0 - 9 */
    for (var i = 48; i <= 57; i++) {
        KEY['' + (i - 48)] = i;
    }
    /* A - Z */
    for (i = 65; i <= 90; i++) {
        KEY['' + String.fromCharCode(i)] = i;
    }
    /* NUM_PAD_0 - NUM_PAD_9 */
    for (i = 96; i <= 105; i++) {
        KEY['NUM_PAD_' + (i - 96)] = i;
    }
    /* F1 - F12 */
    for (i = 112; i <= 123; i++) {
        KEY['F' + (i - 112 + 1)] = i;
    }
})();

Pacman.WALL    = 0;
Pacman.BISCUIT = 1;
Pacman.EMPTY   = 2;
Pacman.BLOCK   = 3;
Pacman.PILL    = 4;

Pacman.MAP = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

Pacman.WALLS = [

    [{"move": [0, 9.5]}, {"line": [20, 9.5]}],


    [{"move": [0, 11.5]}, {"line": [20, 11.5]}]
];

Object.prototype.clone = function () {
    var i, newObj = (this instanceof Array) ? [] : {};
    for (i in this) {
        if (i === 'clone') {
            continue;
        }
        if (this[i] && typeof this[i] === "object") {
            newObj[i] = this[i].clone();
        } else {
            newObj[i] = this[i];
        }
    }
    return newObj;
};

$(function(){
    var el = document.getElementById("pacman");

    if (Modernizr.canvas && Modernizr.localstorage &&
        Modernizr.audio && (Modernizr.audio.ogg || Modernizr.audio.mp3)) {
        window.setTimeout(function () { PACMAN.init(el, "https://raw.githubusercontent.com/tarun-sreedhar/pacman/master/"); }, 0);
    } else {
        el.innerHTML = "Sorry, needs a decent browser<br /><small>" +
            "(firefox 3.6+, Chrome 4+, Opera 10+ and Safari 4+)</small>";
    }
});

