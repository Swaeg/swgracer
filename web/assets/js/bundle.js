/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Helper = function () {
    function Helper() {
        _classCallCheck(this, Helper);
    }

    _createClass(Helper, [{
        key: "timestamp",
        value: function timestamp() {
            return new Date().getTime();
        }
    }, {
        key: "random",
        value: function random() {
            return Math.random();
        }
    }, {
        key: "sign",
        value: function sign(number) {
            return number ? number < 0 ? -1 : 1 : 0;
        }
    }]);

    return Helper;
}();

var helper = exports.helper = new Helper();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* Source code for swaeg racer */
/* Go check out https://github.com/onaluf/RacerJS/ and https://github.com/jakesgordon/javascript-racer */
/* Code author: huqa (github: huqa // pikkuhukka@gmail.com)*/
/* GFX by KeFF */


var _helper = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/****
    * Raster Racer!
    *
    * Sprite things:
    * bg_sky 512x165 (h. 0->165, w. 0-512), bg_land (512x24) (h. 166->190, w. 0-512)
    * carb 448->512, carl 129, carr 258
    * TODO: nÃ¤sinneula, uudet taustat, spritet
    */

var Racer = function () {
    function Racer() {
        _classCallCheck(this, Racer);

        this.canvas = document.getElementById("canvas");
        this.context = this.canvas.getContext("2d");
        this.startTime;
        // delta x-position (left -|+ right)
        this.lastDelta = 0;
        this.sprites;
        this.g_texture;
        this.currentTime = "";
        this.audio;
        //this.audioOgg;

        this.roadData = [];
        this.segmentSize = 5;
        this.segmentsPerColour = 5;

        this.piPerTwo = Math.PI / 2;

        this.introInterval;
        this.gameInterval;
        this.animInterval;

        this.keypresses = [];

        this.ai_car_data = [];

        this.roadParameters = {
            maxCurve: 300, //300
            maxHeight: 1500, //900
            zones: 24,
            curvyness: 0.6, //0.6
            heightness: 0.8, // 0.6
            zoneSize: 150
        };

        this.render = {
            width: 512,
            height: 384,
            cameraDistance: 30,
            cameraHeight: 150,
            depthOfField: 250
        };

        this.player = {
            posX: 0, //x-position (left -|+ right)
            posZ: 10,
            acc: 0.03,
            dec: 0.3,
            turning: 4.0,
            breaking: 0.4,
            maxSpeed: 9,
            speed: 0
        };

        this.animCoefficient = 0;

        this.carSprite = {};

        this.car_forward = {
            x: 0,
            y: 402,
            w: 154,
            h: 112
        };

        this.car_left = {
            x: 0,
            y: 532,
            w: 154,
            h: 112
        };
        this.car_right = {
            x: 0,
            y: 662,
            w: 154,
            h: 112
        };

        this.sky = {
            x: 0,
            y: 0,
            w: 5,
            h: 360
        };

        this.sun = {
            x: 10,
            y: 0,
            w: 357,
            h: 130
        };

        this.red_city = {
            x: 905,
            y: 196,
            w: 74,
            h: 36
        };
        this.black_city = {
            x: 375,
            y: 62,
            w: 512,
            h: 246
        };

        this.naesar = {
            x: 915,
            y: 0,
            w: 26,
            h: 170
        };

        this.rock = {
            x: 0,
            y: 0,
            w: 2,
            h: 2
        };

        this.tahti = {
            x: 658,
            y: 346,
            w: 314,
            h: 382
        };
    }

    _createClass(Racer, [{
        key: "init",
        value: function init() {
            var _this = this;

            console.log("init");
            //this.canvas = document.getElementById("canvas");
            console.log(this.canvas);
            //this.context = this.canvas.getContext('2d');
            console.log(this.context);

            document.onkeydown = function (e) {
                _this.keypresses[e.keyCode] = true;
            };
            document.onkeyup = function (e) {
                _this.keypresses[e.keyCode] = false;
            };

            this.canvas.height = this.render.height;
            this.canvas.width = this.render.width;

            // build some road bwwooy
            this.buildRoad();
        }

        // handles acceleration and decleration

    }, {
        key: "handleAccDec",
        value: function handleAccDec() {
            var _this2 = this;

            console.log("handleAccDec");
            // for animating the car when car is running
            if (this.player.speed > 0) {
                this.animInterval = setInterval(function () {
                    _this2.animateCar();
                }, 2000);
            } else {
                // car has stopped
                clearInterval(this.animInterval);
                this.animCoefficient = 0;
            }
            if (this.keypresses[38]) {
                // up
                this.player.speed += this.player.acc;
            } else if (this.keypresses[40]) {
                // down
                this.player.speed -= this.player.breaking;
            } else {
                // slow down if no key is pressed
                this.player.speed -= this.player.dec;
            }
            // check if car outside boundaries
            if (Math.abs(this.lastDelta) > 301) {
                if (this.player.speed > 2) {
                    this.player.speed -= 0.3;
                }
            }
        }
    }, {
        key: "handleTurning",
        value: function handleTurning() {
            console.log("handleTurning");
            if (this.keypresses[39]) {
                // right
                if (this.player.speed > 0) {

                    this.player.posX += this.player.turning;
                }
                this.car_right.x = this.animCoefficient * 154;
                this.carSprite = {
                    a: this.car_right,
                    x: 180,
                    y: 270
                };
            } else if (this.keypresses[37]) {
                // left
                if (this.player.speed > 0) {

                    this.player.posX -= this.player.turning;
                }
                this.car_left.x = this.animCoefficient * 154;
                this.carSprite = {
                    a: this.car_left,
                    x: 180,
                    y: 270
                };
            } else {
                this.car_forward.x = this.animCoefficient * 154;
                this.carSprite = {
                    a: this.car_forward,
                    x: 180,
                    y: 270
                };
            }
        }
    }, {
        key: "cameraRotation",
        value: function cameraRotation() {
            this.context.save();
            this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
            var degs = 0;
            if (_helper.helper.sign(this.player.posX) > 0) {
                degs = Math.min(this.player.posX / 640, 45);
            } else if (_helper.helper.sign(this.player.posX) < 0) {
                degs = Math.min(Math.abs(this.player.posX / 640), 130);
            }
            //var degs = Math.min(Math.abs(this.player.posX/640), 45);
            this.context.rotate(degs);
            this.context.restore();
            // reset transformation-matrix with identity-matrix
            //this.context.setTransform(1, 0, 0, 1, 0, 0);
        }

        // Render splash screen

    }, {
        key: "renderSplashScreen",
        value: function renderSplashScreen() {
            var _this3 = this;

            //console.log("renderSplashScreen");
            // Here be dragons
            this.context.fillStyle = "rgb(0,0,0)";
            this.context.rect(0, 0, this.render.width, this.render.height);
            this.context.stroke();
            this.drawText("GOTO SWAG!", 123, 180, "white");
            this.drawText("PRESS ANY KEY TO START", 0, 300, "white");
            this.drawText("PRESS ARROWS TO MOVE", 0, 320, "white");
            if (this.keypresses.length > 0) {
                clearInterval(this.introInterval);
                this.gameInterval = setInterval(function () {
                    _this3.renderFrame();
                }, 20);
                this.startTime = _helper.helper.timestamp();
                //this.audio.play();
            }
        }

        // render one frame of game

    }, {
        key: "renderFrame",
        value: function renderFrame() {
            console.log("renderFrame");
            this.context.fillStyle = "#f8dcb5";
            this.context.fillRect(0, 0, this.render.width, this.render.height);
            this.handleAccDec();
            this.handleTurning();
            // Check if player tries to go in reverse
            this.player.speed = Math.max(this.player.speed, 0);
            // enforce max speed
            this.player.speed = Math.min(this.player.speed, this.player.maxSpeed);
            this.player.posZ += this.player.speed;
            // draw background
            this.drawBackground(-this.player.posX);
            // render the road
            this.renderRoad();
            // reset transformation-matrix with identity-matrix
            //this.context.setTransform(1, 0, 0, 1, 0, 0);
        }
    }, {
        key: "renderRoad",
        value: function renderRoad() {
            console.log("renderRoad");
            // spritebuffer
            var spriteBuffer = [];
            // index of the players relative position translated to the roadData index
            var positionIndex = Math.floor(this.player.posZ / this.segmentSize);

            // get index of the road segment
            var currentSegmentIndex = (positionIndex - 2) % this.roadData.length;
            // a negative number, relative position of the camera - player realtive position?
            var currentSegmentPosition = (positionIndex - 2) * this.segmentSize - this.player.posZ;
            var currentSegment = this.roadData[currentSegmentIndex];

            var lastProjectionHeight = Number.POSITIVE_INFINITY;
            //var probedDepth = 0;
            // Used for color counting 
            var segmentColourCounter = positionIndex % (2 * this.segmentsPerColour);

            // the height of the segment player is on
            var playerPositionSegmentHeight = this.roadData[positionIndex % this.roadData.length].height;
            var playerNextPositionSegmentHeight = this.roadData[(positionIndex + 1) % this.roadData.length].height;
            // a value between (0 to segmentSize-1) / segmentSize -> 0-0.8;
            var playerRelativePosition = this.player.posZ % this.segmentSize / this.segmentSize;
            var playerHeight = this.render.cameraHeight + playerPositionSegmentHeight + (playerNextPositionSegmentHeight - playerPositionSegmentHeight) * playerRelativePosition;
            var baseOffset = currentSegment.curve + (this.roadData[(currentSegmentIndex + 1) % this.roadData.length].curve - currentSegment.curve) * playerRelativePosition;

            this.lastDelta = this.player.posX - baseOffset * 2;
            var j = this.render.depthOfField;
            while (j--) {
                // fetch the following segment
                var nextSegmentIndex = (currentSegmentIndex + 1) % this.roadData.length;
                var nextSegment = this.roadData[nextSegmentIndex];

                var startProjectionHeight = Math.floor((playerHeight - currentSegment.height) * this.render.cameraDistance / (this.render.cameraDistance + currentSegmentPosition));
                var startScaling = 30 / (this.render.cameraDistance + currentSegmentPosition);

                var endProjectionHeight = Math.floor((playerHeight - nextSegment.height) * this.render.cameraDistance / (this.render.cameraDistance + currentSegmentPosition + this.segmentSize));
                var endScaling = 30 / (this.render.cameraDistance + currentSegmentPosition + this.segmentSize);

                var currentHeight = Math.min(lastProjectionHeight, startProjectionHeight);
                var currentScaling = startScaling;

                var halfHeight = this.render.height / 2;
                var halfWidth = this.render.width / 2;
                if (currentHeight > endProjectionHeight) {
                    this.drawSegment(halfHeight + currentHeight, currentScaling, currentSegment.curve - baseOffset - this.lastDelta * currentScaling, halfHeight + endProjectionHeight, endScaling, nextSegment.curve - baseOffset - this.lastDelta * endScaling, segmentColourCounter < this.segmentsPerColour, currentSegmentIndex == 2 || currentSegmentIndex == this.roadParameters.zones - this.render.depthOfField);
                }
                if (currentSegment.sprite) {
                    spriteBuffer.push({
                        x: halfWidth - currentSegment.sprite.pos * this.render.width * currentScaling + currentSegment.curve - baseOffset - (this.player.posX - baseOffset * 2) * currentScaling,
                        y: halfHeight + startProjectionHeight,
                        yMax: halfHeight + lastProjectionHeight,
                        scale: 2.5 * currentScaling,
                        identity: currentSegment.sprite.type
                    });
                }

                lastProjectionHeight = currentHeight;

                currentSegmentIndex = nextSegmentIndex;
                currentSegment = nextSegment;
                currentSegmentPosition += this.segmentSize;
                // increment colour counter
                segmentColourCounter = (segmentColourCounter + 1) % (2 * this.segmentsPerColour);
            }
            // draw sprites
            var sprite;
            while (sprite = spriteBuffer.pop()) {
                this.drawSprite(sprite);
            }

            // draw car
            this.drawImage(this.carSprite.x, this.carSprite.y, 1, this.carSprite.a);

            // draw hud
            var speed = Math.round(this.player.speed / this.player.maxSpeed * 180);
            this.drawText("" + speed + "km/h", 8, 30, "black");
            this.drawText("" + speed + "km/h", 10, 30, "white");

            var now = new Date();
            var diff = now.getTime() - this.startTime;
            var min = Math.floor(diff / 60000);
            var sec = Math.floor((diff - min * 60000) / 1000);
            if (sec < 10) sec = "0" + sec;
            var milli = Math.floor(diff - min * 60000 - sec * 1000);
            if (milli < 100) milli = "0" + milli;
            if (milli < 10) milli = "0" + milli;

            this.currentTime = "" + min + ":" + sec + ":" + milli;
            this.drawText(this.currentTime, 198, 30, "black");
            this.drawText(this.currentTime, 200, 30, "white");

            // Player is over the finish line
            if (positionIndex >= this.roadParameters.zones - this.render.depthOfField - 1) {
                clearInterval(this.gameInterval);
                //this.audio.stop();
                this.drawText("You made it!", 120, 180, "black");
                this.drawText("You made it!", 126, 180, "black");
                this.drawText("You made it!", 123, 180, "white");
            }
        }
    }, {
        key: "buildRoad",
        value: function buildRoad() {
            console.log("buildRoad");
            // heighState 0 = tasainen, 1=ylÃ¶s, 2=alas
            // curveState 0 = suora, 1=vasen, 2=oikea
            var heightState = 0,
                heightTransition = [[0, 1, 2], [0, 2, 2], [2, 1, 1], [1, 1, 1], [0, 2, 2]],
                curveState = 0,
                curveTransition = [[0, 2, 1], [1, 0, 2], [2, 0, 1], [0, 2, 0]],
                currentHeight = 0,
                currentCurve = 0,
                zones = this.roadParameters.zones;

            console.log("build that Road");
            // Build that road
            while (zones--) {

                var height;
                switch (heightState) {
                    case 0:
                        height = 0;
                        break;
                    case 1:
                        height = this.roadParameters.maxHeight * _helper.helper.random();
                        break;
                    case 2:
                        height = -this.roadParameters.maxHeight * _helper.helper.random();
                        break;
                }
                var curve;
                switch (curveState) {
                    case 0:
                        curve = 0;
                        break;
                    case 1:
                        curve = -this.roadParameters.maxCurve * _helper.helper.random();
                        break;
                    case 2:
                        curve = this.roadParameters.maxCurve * _helper.helper.random();
                        break;
                }

                for (var i = 0; i < this.roadParameters.zoneSize; i++) {

                    if (i === 70 && zones === 1) {
                        var sprite = {
                            type: this.tahti,
                            pos: 0.6,
                            inBuffer: false
                        };
                    }

                    this.roadData.push({
                        height: currentHeight + height / 2 * (1 + Math.sin(i / this.roadParameters.zoneSize * Math.PI - this.piPerTwo)),
                        curve: currentCurve + curve / 2 * (1 + Math.sin(i / this.roadParameters.zoneSize * Math.PI - this.piPerTwo)),
                        sprite: sprite
                    });
                }
                currentCurve += curve;
                currentHeight += height;
                // next zone?
                if (_helper.helper.random() < this.roadParameters.heightness) {
                    heightState = heightTransition[heightState][1 + Math.round(_helper.helper.random())];
                } else {
                    heightState = heightTransition[heightState][0];
                }
                if (_helper.helper.random() < this.roadParameters.curvyness) {
                    curveState = curveTransition[curveState][1 + Math.round(_helper.helper.random())];
                } else {
                    curveState = curveTransition[curveState][0];
                }
            }
            this.roadParameters.zones = this.roadParameters.zones * this.roadParameters.zoneSize;
        }
    }, {
        key: "drawSegment",
        value: function drawSegment(pos0, scale0, offset0, pos1, scale1, offset1, colourToggle, isStartOrFinish) {
            // TODO colors in seperate object
            var laneColour = colourToggle ? "#FFF" : "#777";
            var borderColour = colourToggle ? "#696969" : "#696969";
            var grassColour = colourToggle ? "#090" : "#060";
            var roadColour = colourToggle ? "#999" : "#777";
            var white = "#fff";
            // so we have a start/finish line
            if (isStartOrFinish) {
                borderColour = white;
                laneColour = white;
                roadColour = white;
            }
            // segment render hierarchy (grass -> road -> border -> lanes)
            this.context.fillStyle = grassColour;
            this.context.fillRect(0, pos1, this.render.width, pos0 - pos1);
            // road
            this.drawTrapezoid(pos0, scale0, offset0, pos1, scale1, offset1, -0.7, 0.7, roadColour);
            // road borders
            this.drawTrapezoid(pos0, scale0, offset0, pos1, scale1, offset1, -0.7, -0.67, borderColour);
            this.drawTrapezoid(pos0, scale0, offset0, pos1, scale1, offset1, 0.67, 0.7, borderColour);
            // lanes
            this.drawTrapezoid(pos0, scale0, offset0, pos1, scale1, offset1, -0.01, 0.01, laneColour);
            //this.drawTrapezoid(pos0, scale0, offset0, pos1, scale1, offset1, 0.15, 0.18, laneColour);
        }

        // draw a trapezoid

    }, {
        key: "drawTrapezoid",
        value: function drawTrapezoid(pos0, scale0, offset0, pos1, scale1, offset1, delta0, delta1, colour) {
            var halfScreen = this.render.width / 2;
            this.context.fillStyle = colour;
            this.context.beginPath();
            this.context.moveTo(halfScreen + delta0 * this.render.width * scale0 + offset0, pos0);
            this.context.lineTo(halfScreen + delta0 * this.render.width * scale1 + offset1, pos1);
            this.context.lineTo(halfScreen + delta1 * this.render.width * scale1 + offset1, pos1);
            this.context.lineTo(halfScreen + delta1 * this.render.width * scale0 + offset0, pos0);
            this.context.fill();
        }
    }, {
        key: "drawBackground",
        value: function drawBackground(posX) {
            var n = Math.floor(posX / 8);
            var j = Math.floor(posX / 6);
            var k = Math.floor(posX / 4);
            var m = Math.floor(posX / 10);
            //this.drawImage(n-sky.w, 0, 1, sky);
            // Draw sky
            var skyCoef = this.render.width / this.sky.w;
            for (var i = 0; i < skyCoef; ++i) {
                this.drawImage(i * this.sky.w, -20, 1, this.sky);
            }

            // draw sun
            this.drawImage(50 + m, 60, 1, this.sun);
            // draw red city
            var redCoef = this.render.width / this.red_city.w;
            for (var i = -redCoef * 3; i < redCoef * 3; ++i) {
                this.drawImage(i * this.red_city.w + j, 135, 1, this.red_city);
            }
            //draw black city
            this.drawImage(-1024 + k, 110, 1, this.black_city);
            this.drawImage(-512 + k, 110, 1, this.black_city);
            this.drawImage(0 + k, 110, 1, this.black_city);
            this.drawImage(512 + k, 110, 1, this.black_city);
            this.drawImage(1024 + k, 110, 1, this.black_city);

            this.drawImage(180 + n, 80, 1, this.naesar);
            //this.drawImage(n-sky.w -k, 142, 3.5, land);
            //this.drawImage(n, 142, 3.5, land);        
        }
    }, {
        key: "drawImage",
        value: function drawImage(x, y, scale, image) {
            this.context.drawImage(this.sprites, image.x, image.y, image.w, image.h, x, y, image.w * scale, image.h * scale);
        }
    }, {
        key: "drawSprite",
        value: function drawSprite(sprite) {
            var projY = sprite.y - sprite.identity.h * sprite.scale;
            if (sprite.yMax < sprite.y) {
                var h = Math.min(sprite.identity.h * (sprite.yMax - projY) / (sprite.identity.h * sprite.scale), sprite.identity.h);
            } else {
                var h = sprite.identity.h;
            }
            if (h > 0) {
                this.context.drawImage(this.sprites, sprite.identity.x, sprite.identity.y, sprite.identity.w, h, sprite.x, projY, sprite.scale * sprite.identity.w, sprite.scale * h);
            }
        }
    }, {
        key: "drawText",
        value: function drawText(string, x, y, fillStyle) {
            this.context.font = '20px "Press Start 2P"';
            this.context.fillStyle = fillStyle;
            this.context.fillText(string, x, y);
        }
    }, {
        key: "animateCar",
        value: function animateCar() {
            if (this.animCoefficient >= 3) {
                this.animCoefficient = 0;
            } else {
                this.animCoefficient++;
            }
        }
    }, {
        key: "start",
        value: function start() {
            var _this4 = this;

            console.log("start");
            this.init();
            this.sprites = new Image();
            this.sprites.onload = function () {
                _this4.introInterval = setInterval(function () {
                    _this4.renderSplashScreen();
                }, 20);
            };
            //this.sprites.src = "new_spritesheet_big.png";
            this.sprites.src = "assets/img/ss_fin.png";
            //this.audio = new Audio('6feetthunder.ogg'); 
            /*this.audio.addEventListener('ended', function() {
                this.currentTime = 0;
                this.play();
            }, false);*/
        }
    }]);

    return Racer;
}();

window.onload = function () {
    var RacerGame = new Racer();
    RacerGame.start();
};

/***/ })
/******/ ]);