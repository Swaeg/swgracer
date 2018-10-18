/* Source code for swaeg racer */
/* Go check out https://github.com/onaluf/RacerJS/ and https://github.com/jakesgordon/javascript-racer */
/* Code author: huqa (github: huqa // pikkuhukka@gmail.com)*/
/* GFX by KeFF */
var Racer = {};

// Helper functions
var Helper = {

    timestamp: function() { 
        return new Date().getTime(); 
    },
    random: function() {
        return Math.random();
    },
    sign: function(number) {
        return number ? number < 0 ? -1 : 1 : 0;
    },
};
/****
    * Raster Racer!
    * 
    * Sprite things:
    * bg_sky 512x165 (h. 0->165, w. 0-512), bg_land (512x24) (h. 166->190, w. 0-512)
    * carb 448->512, carl 129, carr 258
    * TODO: nÃ¤sinneula, uudet taustat, spritet
    */
var Game = function() {
    
    var self = this;
    // Some global variables
    self.canvas;
    self.context;
    self.startTime;
    // delta x-position (left -|+ right)
    self.lastDelta = 0;
    self.sprites;
    self.g_texture;
    self.currentTime = "";
    self.audio;
    //self.audioOgg;

    self.roadData = [];
    self.segmentSize = 5;
    self.segmentsPerColour = 5;

    self.piPerTwo = Math.PI / 2;

    self.introInterval;
    self.gameInterval;
    self.animInterval;

    self.keypresses = [];

    self.ai_car_data = [];

    self.roadParameters = {
        maxCurve: 300, //300
        maxHeight: 1500, //900
        zones: 24,
        curvyness: 0.6, //0.6
        heightness: 0.8, // 0.6
        zoneSize: 150,
    };

    self.render = {
        width: 512,
        height: 384,
        cameraDistance: 30,
        cameraHeight: 150,
        depthOfField: 250,
    };

    self.player = {
        posX: 0, //x-position (left -|+ right)
        posZ: 10,
        acc: 0.03,
        dec: 0.3,
        turning: 4.0,
        breaking: 0.4,
        maxSpeed: 9,
        speed: 0,
    };

    self.animCoefficient = 0;

    var carSprite = {};

    var car_forward = { 
        x: 0,
        y: 402,
        w: 154,
        h: 112
    };

    var car_left = {
        x: 0,
        y: 532,
        w: 154,
        h: 112
    };
    var car_right = {
        x: 0,
        y: 662,
        w: 154,
        h: 112
    };
    
    var sky = {
        x: 0,
        y: 0,
        w: 5,
        h: 360
    };

    var sun = {
        x: 10,
        y: 0,
        w: 357,
        h: 130
    };
    
    var red_city = {
        x: 905,
        y: 196,
        w: 74,
        h: 36
    };
    var black_city = {
        x: 375,
        y: 62,
        w: 512,
        h: 246
    };
    
    var naesar = {
        x: 915,
        y: 0,
        w: 26,
        h: 170
    };

    var rock = {
        x: 0,
        y: 0,
        w: 2,
        h: 2
    };

    var tahti = {
        x: 658,
        y: 346,
        w: 314,
        h: 382
    };
    
    
    self.init = function() {
        console.log("init");
        self.canvas = document.getElementById("canvas");
        console.log(self.canvas);
        self.context = canvas.getContext('2d');
        console.log(self.context);
        
        self.canvas.height = self.render.height;
        self.canvas.width = self.render.width;

        document.onkeydown = function(e) {
            self.keypresses[e.keyCode] = true;
        };
        document.onkeyup = function(e) {
            self.keypresses[e.keyCode] = false;
        };
        // build some road bwwooy
        self.buildRoad();
    };

    // handles acceleration and decleration
    self.handleAccDec = function() {
        console.log("handleAccDec")
        // for animating the car when car is running
        if (self.player.speed > 0) {
            self.animInterval = setInterval(self.animateCar, 2000);
        } else {
            // car has stopped
            clearInterval(self.animInterval);
            self.animCoefficient = 0;
        }
        if (self.keypresses[38]) {
            // up
            self.player.speed += self.player.acc;

        } else if (self.keypresses[40]) {
            // down
            self.player.speed -= self.player.breaking;
        } else {
            // slow down if no key is pressed
            self.player.speed -= self.player.dec;
        }
        // check if car outside boundaries
        if (Math.abs(self.lastDelta) > 301) {
            if (self.player.speed > 2) {
                self.player.speed -= 0.3;
            }
        }  
    };

    self.handleTurning = function() {
        console.log("handleTurning");
        if (self.keypresses[39]) {
            // right
            if (self.player.speed > 0) {
                
                self.player.posX += self.player.turning;
            }
            car_right.x = self.animCoefficient * 154;
            carSprite = {
                a: car_right,
                x: 180,
                y: 270
            };
        } else if (self.keypresses[37]) {
            // left
            if (self.player.speed > 0) {
            
                self.player.posX -= self.player.turning;
            }
            car_left.x = self.animCoefficient * 154;
            carSprite = {
                a: car_left,
                x: 180,
                y: 270
            };
        } else {
            car_forward.x = self.animCoefficient * 154;
            carSprite = {
                a: car_forward,
                x: 180,
                y: 270
            };            
        }
    };

    self.cameraRotation = function() {
        self.context.save();
        self.context.translate(self.canvas.width / 2, self.canvas.height / 2);
        var degs = 0;
        if (Helper.sign(self.player.posX) > 0) {
            degs = Math.min(self.player.posX/640, 45);
        } else if (Helper.sign(self.player.posX) < 0) {
            degs = Math.min(Math.abs(self.player.posX/640), 130);
        }
        //var degs = Math.min(Math.abs(self.player.posX/640), 45);
        self.context.rotate(degs);
        self.context.restore();
        // reset transformation-matrix with identity-matrix
        //self.context.setTransform(1, 0, 0, 1, 0, 0);
    };

    // Render splash screen
    self.renderSplashScreen = function() {
        console.log("renderSplashScreen");
        // Here be dragons
        self.context.fillStyle = "rgb(0,0,0)";
        self.context.rect(0,0,self.render.width, self.render.height);
        self.context.stroke();
        self.drawText("GOTO SWAG!", 123, 180, "white");
        self.drawText("PRESS ANY KEY TO START", 0, 300, "white");
        self.drawText("PRESS ARROWS TO MOVE", 0, 320, "white");
        if(self.keypresses.length > 0){
            clearInterval(self.introInterval);
            self.gameInterval = setInterval(self.renderFrame, 20);
            self.startTime = Helper.timestamp();
            self.audio.play();
        }
    };
    // render one frame of game
    self.renderFrame = function() {
        console.log("renderFrame");
        self.context.fillStyle = "#f8dcb5";
        self.context.fillRect(0,0,self.render.width, self.render.height);
        self.handleAccDec();
        self.handleTurning();
        // Check if player tries to go in reverse
        self.player.speed = Math.max(self.player.speed, 0); 
        // enforce max speed
        self.player.speed = Math.min(self.player.speed, self.player.maxSpeed); 
        self.player.posZ += self.player.speed;
        // draw background
        self.drawBackground(-self.player.posX);
        // render the road
        self.renderRoad();
        // reset transformation-matrix with identity-matrix
        //self.context.setTransform(1, 0, 0, 1, 0, 0);
    };

    self.renderRoad = function() {
        console.log("renderRoad");
        // spritebuffer
        var spriteBuffer = [];
        // index of the players relative position translated to the roadData index
        var positionIndex = Math.floor(self.player.posZ / self.segmentSize);

        // get index of the road segment
        var currentSegmentIndex = (positionIndex - 2) % self.roadData.length;
        // a negative number, relative position of the camera - player realtive position?
        var currentSegmentPosition = (positionIndex - 2) * self.segmentSize - self.player.posZ;
        var currentSegment = self.roadData[currentSegmentIndex];

        var lastProjectionHeight = Number.POSITIVE_INFINITY;
        //var probedDepth = 0;
        // Used for color counting 
        var segmentColourCounter = positionIndex % (2 * self.segmentsPerColour);

        // the height of the segment player is on
        var playerPositionSegmentHeight = self.roadData[positionIndex % self.roadData.length].height;
        var playerNextPositionSegmentHeight = self.roadData[(positionIndex + 1)% self.roadData.length].height;
        // a value between (0 to segmentSize-1) / segmentSize -> 0-0.8;
        var playerRelativePosition = (self.player.posZ % self.segmentSize) / self.segmentSize;
        var playerHeight = self.render.cameraHeight + playerPositionSegmentHeight + 
                            (playerNextPositionSegmentHeight - playerPositionSegmentHeight) * 
                            playerRelativePosition;
        var baseOffset = currentSegment.curve + 
                            (self.roadData[(currentSegmentIndex + 1) % self.roadData.length].curve - currentSegment.curve) *
                            playerRelativePosition;

        self.lastDelta = self.player.posX - baseOffset*2;
        var j = self.render.depthOfField;
        while(j--) {
            // fetch the following segment
            var nextSegmentIndex = (currentSegmentIndex + 1) % self.roadData.length;
            var nextSegment = self.roadData[nextSegmentIndex];

            var startProjectionHeight = Math.floor((playerHeight - currentSegment.height) * 
                                            self.render.cameraDistance / (self.render.cameraDistance + currentSegmentPosition));
            var startScaling = 30 / (self.render.cameraDistance + currentSegmentPosition);

            var endProjectionHeight = Math.floor((playerHeight - nextSegment.height) * 
                                            self.render.cameraDistance / (self.render.cameraDistance + currentSegmentPosition + self.segmentSize));
            var endScaling = 30 / (self.render.cameraDistance + currentSegmentPosition + self.segmentSize);

            var currentHeight = Math.min(lastProjectionHeight, startProjectionHeight);
            var currentScaling = startScaling;

            var halfHeight = self.render.height / 2;
            var halfWidth = self.render.width / 2;
            if (currentHeight > endProjectionHeight) {
                self.drawSegment(
                    halfHeight + currentHeight,
                    currentScaling,
                    currentSegment.curve - baseOffset - self.lastDelta * currentScaling,
                    halfHeight + endProjectionHeight,
                    endScaling,
                    nextSegment.curve - baseOffset - self.lastDelta * endScaling,
                    segmentColourCounter < self.segmentsPerColour,
                    (currentSegmentIndex == 2 || currentSegmentIndex == (self.roadParameters.zones-self.render.depthOfField))
                );
            }
            if (currentSegment.sprite) {
                spriteBuffer.push({
                    x: halfWidth - currentSegment.sprite.pos * self.render.width *
                        currentScaling + currentSegment.curve - baseOffset -
                        (self.player.posX - baseOffset * 2) * currentScaling,
                    y: halfHeight + startProjectionHeight,
                    yMax: halfHeight + lastProjectionHeight,
                    scale: 2.5*currentScaling,
                    identity: currentSegment.sprite.type
                });
            }

            lastProjectionHeight = currentHeight;

            currentSegmentIndex = nextSegmentIndex;
            currentSegment = nextSegment;
            currentSegmentPosition += self.segmentSize;
            // increment colour counter
            segmentColourCounter = (segmentColourCounter + 1) % (2 * self.segmentsPerColour);

        }
        // draw sprites
        var sprite;
        while(sprite = spriteBuffer.pop()) {
            self.drawSprite(sprite);
        }

        // draw car
        self.drawImage(carSprite.x, carSprite.y, 1, carSprite.a);

        // draw hud
        var speed = Math.round(self.player.speed / self.player.maxSpeed*180);
        self.drawText(""+speed+"km/h", 8, 30, "black");
        self.drawText(""+speed+"km/h", 10, 30, "white");
        
        var now = new Date();
        var diff = now.getTime() - self.startTime;
        var min = Math.floor(diff / 60000);
        var sec = Math.floor((diff - min * 60000) / 1000); 
        if(sec < 10) sec = "0" + sec;
        var milli = Math.floor(diff - min * 60000 - sec * 1000);
        if(milli < 100) milli = "0" + milli;
        if(milli < 10) milli = "0" + milli;
        
        self.currentTime = ""+min+":"+sec+":"+milli;
        self.drawText(self.currentTime, 198, 30, "black");
        self.drawText(self.currentTime, 200, 30, "white");

        // Player is over the finish line
        if (positionIndex >= self.roadParameters.zones-self.render.depthOfField-1) {
            clearInterval(self.gameInterval);
            self.audio.stop();
            self.drawText("You made it!", 120, 180, "black");
            self.drawText("You made it!", 126, 180, "black");
            self.drawText("You made it!", 123, 180, "white");
        }


    };

    self.buildRoad = function() {
        console.log("buildRoad");
        // heighState 0 = tasainen, 1=ylÃ¶s, 2=alas
        // curveState 0 = suora, 1=vasen, 2=oikea
        var heightState = 0,
        heightTransition = [[0,1,2],
                            [0,2,2],
                            [2,1,1],
                            [1,1,1],
                            [0,2,2]],
        curveState = 0,
        curveTransition = [[0,2,1],
                            [1,0,2],
                            [2,0,1],
                            [0,2,0]],
        currentHeight = 0,
        currentCurve = 0,
        zones = self.roadParameters.zones;

        console.log("build that Road");
        // Build that road
        while(zones--) {

            var height;
            switch(heightState) {
                case 0:
                    height = 0;
                    break;
                case 1:
                    height = self.roadParameters.maxHeight * Helper.random();
                    break;
                case 2:
                    height = -self.roadParameters.maxHeight * Helper.random();
                    break;
            }
            var curve;
            switch(curveState) {
                case 0:
                    curve = 0;
                    break;
                case 1:
                    curve = -self.roadParameters.maxCurve * Helper.random();
                    break;
                case 2:
                    curve = self.roadParameters.maxCurve * Helper.random();
                    break;
            }

            for(var i=0; i < self.roadParameters.zoneSize; i++) {

                if (i === 70 && zones ===1) {
                        var sprite = {
                            type: tahti,
                            pos: 0.6,
                            inBuffer: false,
                        };
                }

                self.roadData.push({
                    height: currentHeight+height / 2 * (1 + Math.sin(i/self.roadParameters.zoneSize * Math.PI - self.piPerTwo)),
                    curve: currentCurve+curve / 2 * (1 + Math.sin(i/self.roadParameters.zoneSize * Math.PI - self.piPerTwo)),
                    sprite: sprite,
                });
            }
            currentCurve += curve;
            currentHeight += height;
            // next zone?
            if(Helper.random() < self.roadParameters.heightness) {
                heightState = heightTransition[heightState][1+Math.round(Helper.random())];
            } else {
                heightState = heightTransition[heightState][0];
            }
            if(Helper.random() < self.roadParameters.curvyness) {
                curveState = curveTransition[curveState][1+Math.round(Helper.random())];
            } else {
                curveState = curveTransition[curveState][0];
            }
        }
        self.roadParameters.zones = self.roadParameters.zones * self.roadParameters.zoneSize;
    };

    self.drawSegment = function(pos0, scale0, offset0, pos1, scale1, offset1, colourToggle, isStartOrFinish) {
        // TODO colors in seperate object
        var laneColour = (colourToggle) ? "#FFF" : "#777";
        var borderColour = (colourToggle) ? "#696969" : "#696969";
        var grassColour = (colourToggle) ? "#090": "#060";
        var roadColour = (colourToggle) ? "#999" : "#777";
        var white = "#fff";
        // so we have a start/finish line
        if(isStartOrFinish) {
            borderColour = white;
            laneColour = white;
            roadColour = white;
        }
        // segment render hierarchy (grass -> road -> border -> lanes)
        self.context.fillStyle = grassColour;
        self.context.fillRect(0, pos1, self.render.width, (pos0-pos1));
        // road
        self.drawTrapezoid(pos0, scale0, offset0, pos1, scale1, offset1, -0.7, 0.7, roadColour);
        // road borders
        self.drawTrapezoid(pos0, scale0, offset0, pos1, scale1, offset1, -0.7, -0.67, borderColour);
        self.drawTrapezoid(pos0, scale0, offset0, pos1, scale1, offset1, 0.67, 0.7, borderColour);
        // lanes
        self.drawTrapezoid(pos0, scale0, offset0, pos1, scale1, offset1, -0.01, 0.01, laneColour);
        //self.drawTrapezoid(pos0, scale0, offset0, pos1, scale1, offset1, 0.15, 0.18, laneColour);

    };

    // draw a trapezoid
    self.drawTrapezoid = function(pos0, scale0, offset0, pos1, scale1, offset1, delta0, delta1, colour) {
        var halfScreen = self.render.width / 2;
        self.context.fillStyle = colour;
        self.context.beginPath();
        self.context.moveTo(halfScreen + delta0 * self.render.width * scale0 + offset0, pos0);
        self.context.lineTo(halfScreen + delta0 * self.render.width * scale1 + offset1, pos1);
        self.context.lineTo(halfScreen + delta1 * self.render.width * scale1 + offset1, pos1);
        self.context.lineTo(halfScreen + delta1 * self.render.width * scale0 + offset0, pos0);
        self.context.fill();
    };

    self.drawBackground = function(posX) {
        var n = Math.floor(posX / 8);
        var j = Math.floor(posX / 6);
        var k = Math.floor(posX / 4);
        var m = Math.floor(posX / 10);
        //self.drawImage(n-sky.w, 0, 1, sky);
        // Draw sky
        var skyCoef = self.render.width / sky.w;
        for(var i = 0; i < skyCoef; ++i) {
            self.drawImage((i*sky.w), -20, 1, sky);
        }

        // draw sun
        self.drawImage(50+m, 60, 1, sun);
        // draw red city
        var redCoef = self.render.width / red_city.w;
        for(var i = (-redCoef*3); i < (redCoef*3); ++i) {
            self.drawImage((i*red_city.w)+j,135,1,red_city);
        }
        //draw black city
        self.drawImage(-1024+k,110,1,black_city);
        self.drawImage(-512+k,110,1,black_city);
        self.drawImage(0+k,110,1,black_city);
        self.drawImage(512+k,110,1,black_city);
        self.drawImage(1024+k,110,1,black_city);

        self.drawImage(180+n, 80, 1, naesar);
        //self.drawImage(n-sky.w -k, 142, 3.5, land);
        //self.drawImage(n, 142, 3.5, land);        
    };

    self.drawImage = function(x, y, scale, image) {
        self.context.drawImage(self.sprites, image.x, image.y, image.w, image.h, x, y, image.w*scale, image.h*scale);
    };

    self.drawSprite = function(sprite) {
        var projY = sprite.y - sprite.identity.h * sprite.scale;
        if (sprite.yMax < sprite.y) {
            var h = Math.min(sprite.identity.h * (sprite.yMax - projY) / (sprite.identity.h * sprite.scale), sprite.identity.h);
        } else {
            var h = sprite.identity.h;
        }
        if (h > 0) {
            self.context.drawImage(self.sprites, sprite.identity.x, sprite.identity.y, sprite.identity.w, h, sprite.x, projY, sprite.scale * sprite.identity.w, sprite.scale * h);
        }
    };

    self.drawText = function(string, x, y, fillStyle) {
        self.context.font = '20px "Press Start 2P"';
        self.context.fillStyle = fillStyle;
        self.context.fillText(string, x, y);
    };

    self.animateCar = function() {
        if(self.animCoefficient >= 3) {
            self.animCoefficient = 0;
        } else {
            self.animCoefficient++;
        }
    };

    self.start = function() {
        console.log("start");
        self.init();
        self.sprites = new Image();
        self.sprites.onload = function() {
            self.introInterval = setInterval(self.renderSplashScreen, 20);
        };
        //self.sprites.src = "new_spritesheet_big.png";
        self.sprites.src = "assets/img/ss_fin.png";
        //self.audio = new Audio('6feetthunder.ogg'); 
        /*self.audio.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);*/    
    };
    
};

Racer.Game = new Game();

window.onload = function() {
    Racer.Game.start();
};

