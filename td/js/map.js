/* TODO:

- 

*/
var J = J || {};

J.Map = function (ctx, levels, levelNr) {

    this.levels = levels;
    this.level = [];

    // Hämtar information om hur mappen ser ut
    this.map = this.levels[levelNr].layout;

    // Skapar mapen
    for (var y = 0; y < this.map[0].length; y++) {
        this.level.push([]);
        for (var x = 0; x < this.map[y].length; x++) {
            this.level[y].push([]);
            this.level[y][x].push(new J.Point(this.map[y][x], x, y)); // skapa en ny point
        }
    }

    // Kallar på draw
    this.draw(this.map, this.level, ctx);
};

// Update
J.Map.prototype.update = function () {
    

};

// Draw
J.Map.prototype.draw = function (map, level, ctx) {
    console.log("     Map has been drawn.");
   
    // Rita ut mapen
    for (var y = 0; y < map[0].length; y++) {
        for (var x = 0; x < map[y].length; x++) {
            level[y][x][0].draw(ctx); // rita ut pointen
        }
    }
};


"use strict";
var J = J || {};


J.Game = function () {

    var that = this;

    this.canvasMap = document.getElementById('canvasMap');
    this.canvasMapCTX = this.canvasMap.getContext('2d');

    this.canvasObjects = document.getElementById('canvasObjects');
    this.canvasObjectsCTX = this.canvasObjects.getContext('2d');

    this.canvasText = document.getElementById('canvasText').getContext('2d');

    this.canvasMouse = document.getElementById("canvasObjects");
    this.canvasMouse.addEventListener("mousemove", mouseMove, false);
    this.canvasMouse.addEventListener("mousedown", mouseDown, false);
    window.addEventListener("mousemove", mouseMove, false);
    window.addEventListener("keydown", keyDown, false);
    //window.addEventListener("blur", this.PauseGame, false);
    //window.addEventListener("focus", this.PauseGame, false);
    // Se TODO lista 4.12

    W.requestAnimationFrame(); // requestAnimationFrame fix

    this.fps = 30;
    this.startBtnClicked = false;
    this.initiated = false;
    this.gamePaused = false;
    this.updateLoopInterval;

    //Config
    //***************//
    this.levelNr = 1;
    this.pointSize = 32; // TileSize.
    this.spawnDelay = 1000; // 1/2sek mellan varje fiende.
    this.waveSize = 7; // Antalet fiender i en wave.
    this.waveDelayTime = 11000; // 11 sek innan ny wave startar.

    //**************//

    this.enemyTypes = J.EnemyTypes;
    this.towerTypes = J.TowerTypes;
    this.level = J.Levels;
    this.map;
    this.player;

    this.mouseX;
    this.mouseY;

    this.pointX = 0;
    this.pointY = 0;
    this.pointSize = 32;


    this.started = false;
    this.waiting = true;

    //Tower variables.
    this.towers = [];
    this.towerType = 0;
    this.placingTower = false;
    this.towerHover = false;

    //Bullet variables.
    this.bullets = [];

    // Enemy spawning variables.
    this.enemies = [];
    this.type = 3;
    this.spawnInterval;
    this.totalEnemies = 0;
    this.SPAWN_AMOUNT = 1;
    this.spawnCounter = 0;

    // Wave variables.
    this.waveInterval;
    this.waveCount = 0;

    // DrawLoop.
    this.drawLoop = function () {
        that.drawAll();
        window.requestAnimationFrame(that.drawLoop);
    };



    // Tower buttons och tower onclick.
    // Se TODO lista 4.1
    this.towerInnerDiv = document.getElementById("towersInner");
    this.towerRedBtn = document.getElementById("towerRedBtn");
    this.towerBlackBtn = document.getElementById("towerBlackBtn")
    this.towerGreenBtn = document.getElementById("towerGreenBtn");

    this.towerRedBtn.onclick = function () {
        that.towerType = 1;

        if(that.player.playerCash < that.towerTypes[that.towerType].cost){
            that.placingTower = false;
        } else {
            that.placingTower = true;
        }
    };
    this.towerBlackBtn.onclick = function () {
        that.towerType = 2;

        if(that.player.playerCash < that.towerTypes[that.towerType].cost){
            that.placingTower = false;
        } else {
            that.placingTower = true;
        }
    };
    this.towerGreenBtn.onclick = function () {
        that.towerType = 3;

        if(that.player.playerCash < that.towerTypes[that.towerType].cost){
            that.placingTower = false;
        } else {
            that.placingTower = true;
        }
    };


    //Keyboard events
    function keyDown(e) {
        if (e.keyCode == 80) that.PauseGame();
    }


    // Mouse functions.
    // Se TODO lista 4.2
    this.UItowerInfo = document.getElementById("towerInfo2");
    this.UIName = document.getElementById("tName");
    this.UILevel = document.getElementById("tLevel");
    this.UIDamage = document.getElementById("tDamage");
    this.UIRange = document.getElementById("tRange");
    this.upgradeBTN = document.getElementById("upgradeBTN");
    this.sellBTN = document.getElementById("sellBTN");

    function mouseDown(e) {

        console.log("mouse Down");
        var level = that.level[that.levelNr].layout;


        for (var i = 0; i < that.towers.length; i++) {

            var tower = that.towers[i];

            if (that.pointX == tower.x && that.pointY == tower.y) {

                that.UItowerInfo.classList.remove("hidden");
                that.UIName.innerHTML = tower.towerName;
                that.UILevel.innerHTML = tower.level;
                that.UIDamage.innerHTML = tower.damage;
                that.UIRange.innerHTML = tower.range / that.pointSize;
                that.upgradeBTN.innerHTML = "$" + (tower.cost);
                that.sellBTN.innerHTML = "$" + (tower.sellValue);


                // Se TODO lista 4.3
                that.upgradeBTN.onclick = function () {
                    tower.upgrade();
                };

                that.sellBTN.onclick = function () {
                    tower.sell(i);
                    that.UItowerInfo.classList.add("hidden");
                };
                break;
            }
            else{
                that.UItowerInfo.classList.add("hidden");
            }
        }


        // Kontroll för att kolla så att man inte placerar ut torn på start/slut eller path position.
        if (level[that.pointY][that.pointX] == 2 || level[that.pointY][that.pointX] == 1 || level[that.pointY][that.pointX] == 3) {

            return;

        } else if (that.placingTower) {

            that.createTower();
            that.placingTower = false;
        }


    }

    function mouseMove(e) {

        that.mouseX = e.pageX - that.canvasMouse.offsetLeft;
        that.mouseY = e.pageY - that.canvasMouse.offsetTop;

        that.pointX = Math.floor((that.mouseX - Math.floor(that.mouseX / that.pointSize)) / that.pointSize);
        that.pointY = Math.floor((that.mouseY - Math.floor(that.mouseY / that.pointSize)) / that.pointSize);

        // Show mouse cordinates.
        // Se TODO lista 4.5
        //document.getElementById("mouseCoors").innerHTML = "X: " + that.mouseX + " Y: " + that.mouseY;
        //document.getElementById("points").innerHTML = "Tile X: " + that.pointX + " Tile Y: " + that.pointY;


        if (!that.towerHover && e.target.getAttribute("towerName")) {

            this.price = that.towerTypes[e.target.getAttribute('towerName')].cost;
            e.target.style.background = "#231F20";
            e.target.innerHTML = '$' + this.price;
            that.towerHover = e.target;
        }

        if (that.towerHover && e.target != that.towerHover) {
            that.towerHover.style.backgroundImage = "url(" + that.towerTypes[that.towerHover.getAttribute('towerName')].src + ")";
            that.towerHover.innerHTML = "";
            that.towerHover = false;
        }
    }


    this.startScreen();

};



J.Game.prototype.startScreen = function () {
    var that = this;
    this.canvasObjectsCTX.clearRect(0, 0, 320, 320);

    // Se TODO lista 4.6

    var helpScreen = false;
    var creditScreen = false;

    var title = "JS TowerDefence",
        subHeading = "",
        name = "",
        p = "";

    function getCenter(ctx, text, y) {
        var measurement = ctx.measureText(text);
        var x = (ctx.canvas.width - measurement.width) / 2;
        ctx.fillText(text, x, y);
    }

    var y = (this.canvasObjectsCTX.canvas.height / 2) - 130;
    this.canvasObjectsCTX.fillStyle = "#E9F2E1";
    this.canvasObjectsCTX.font = 'bold 33px myFont';
    getCenter(this.canvasObjectsCTX, title, y);

    // Se TODO lista 4.7
    var imgPlay = document.getElementById("../td/img/startBTN.png"),
        imgHelp = document.getElementById("../td/img/helpBTN.png"),
        imgCredits = document.getElementById("../td/img/creditsBTN.png"),
        imgBack = document.getElementById("../td/img/backBTN.png");

    this.canvasObjectsCTX.drawImage(imgPlay, 140, 130);
    this.canvasObjectsCTX.drawImage(imgHelp, 140, 190);
    this.canvasObjectsCTX.drawImage(imgCredits, 140, 250);

    that.canvasMouse.addEventListener('mousedown', function () {

        //Start Game
        if (that.mouseX > 140 && that.mouseX < 190 && that.mouseY > 130 && that.mouseY < 180 && !that.initiated && !helpScreen && !creditScreen) {

            that.canvasObjectsCTX.clearRect(0, 0, 320, 320);
            that.startBtnClicked = true;
            that.initiated = true;
            that.levelScreen();
        }
        //Help Menu
        else if (that.mouseX > 140 && that.mouseX < 190 && that.mouseY > 190 && that.mouseY < 230 && !that.initiated && !creditScreen) {

            that.canvasObjectsCTX.clearRect(0, 0, 320, 320);
            helpScreen = true;
            y = (that.canvasObjectsCTX.canvas.height / 2) - 130;
            title = "How to play";

            that.canvasObjectsCTX.fillStyle = "#E9F2E1";
            that.canvasObjectsCTX.font = 'bold 30px myFont';
            getCenter(that.canvasObjectsCTX, title, y);


            that.canvasObjectsCTX.fillStyle = "#E9F2E1";
            that.canvasObjectsCTX.font = 'bold 15px myFont';

            p = "Build towers to defend your base";
            that.canvasObjectsCTX.fillText(p, 10, 100);

            p = "against the enemy monsters.";
            that.canvasObjectsCTX.fillText(p, 10, 120);

            p = "Uppgrade the towers if you ";
            that.canvasObjectsCTX.fillText(p, 10, 140);

            p = "can afford..............";
            that.canvasObjectsCTX.fillText(p, 10, 160);

            that.canvasObjectsCTX.drawImage(imgBack, 0, 270);
        }
        //Credits menu
        else if (that.mouseX > 140 && that.mouseX < 190 && that.mouseY > 250 && that.mouseY < 296 && !that.initiated && !helpScreen) {

            that.canvasObjectsCTX.clearRect(0, 0, 320, 320);

            creditScreen = true;
            y = (that.canvasObjectsCTX.canvas.height / 2) - 130;
            title = "Credits";

            that.canvasObjectsCTX.fillStyle = "#E9F2E1";
            that.canvasObjectsCTX.font = 'bold 30px myFont';
            getCenter(that.canvasObjectsCTX, title, y);


            that.canvasObjectsCTX.font = 'bold 22px myFont';
            subHeading = "Code and Graphics";
            getCenter(that.canvasObjectsCTX, subHeading, 80);

            that.canvasObjectsCTX.font = 'bold 18px myFont';
            name = "Joel Stahre";
            getCenter(that.canvasObjectsCTX, name, 110);


            that.canvasObjectsCTX.drawImage(imgBack, 0, 270);

        }
        //Back button
        else if (that.mouseX > 0 && that.mouseX < 46 && that.mouseY > 270 && that.mouseY < 320 && !that.initiated && (helpScreen || creditScreen)) {

            that.canvasObjectsCTX.clearRect(0, 0, 320, 320);
            helpScreen = false;
            creditScreen = false;
            that.startScreen();
        }
    }, false);

};

J.Game.prototype.levelScreen = function () {
    var that = this;
    this.canvasObjectsCTX.clearRect(0, 0, 320, 320);

    var levelScreen = true;
    var title = "Select Level";

    function getCenter(ctx, text, y) {
        var measurement = ctx.measureText(text);
        var x = (ctx.canvas.width - measurement.width) / 2;
        ctx.fillText(text, x, y);
    }

    var y = (this.canvasObjectsCTX.canvas.height / 2) - 130;
    this.canvasObjectsCTX.fillStyle = "#E9F2E1";
    this.canvasObjectsCTX.font = 'bold 33px myFont';
    getCenter(this.canvasObjectsCTX, title, y);

    that.canvasObjectsCTX.fillStyle = "#E9F2E1";
    that.canvasObjectsCTX.font = 'bold 15px myFont';

    var lvl1 = document.getElementById("../td/img/lvl1.png"),
        lvl1Text = "Level 1",
        lvl2 = document.getElementById("../td/img/lvl2.png"),
        lvl2Text = "Level 2";

    this.canvasObjectsCTX.drawImage(lvl1, 10, 50);
    that.canvasObjectsCTX.fillText(lvl1Text, 30, 150);
    this.canvasObjectsCTX.drawImage(lvl2, 10, 180);
    that.canvasObjectsCTX.fillText(lvl2Text, 30, 280);

    that.canvasMouse.addEventListener('mousedown', function () {

        if (that.mouseX > 10 && that.mouseX < 110 && that.mouseY > 55 && that.mouseY < 150 && levelScreen) {
                that.canvasObjectsCTX.clearRect(0, 0, 320, 320);
                levelScreen = false;
                that.levelNr = 1;
                that.init();
        } else if(that.mouseX > 10 && that.mouseX < 110 && that.mouseY > 180 && that.mouseY < 280 && levelScreen){
                that.canvasObjectsCTX.clearRect(0, 0, 320, 320);
                levelScreen = false;
                that.levelNr = 4;
                that.init();
        }
    }, false);

};


// Init
J.Game.prototype.init = function () {
    var that = this,
        towerDiv = document.getElementById("towerInfo"),
        statsDiv = document.getElementById("controls");

    // Se TODO lista 4.8

    this.map = new J.Map(this.canvasMapCTX, this.level, this.levelNr);
    this.player = new J.Player();

    that.towerInnerDiv.classList.remove("hidden");
    towerDiv.classList.remove("opacity");
    statsDiv.classList.remove("opacity");

    var seconds = 10;
    var second = 0;
    var countDownInterval;


    countDownInterval = setInterval(function () {
        that.canvasText.clearRect(1, 1, 320, 320);
        that.canvasText.fillStyle = "#fff";
        that.canvasText.font = 'italic bold 15px myFont';
        that.canvasText.fillText('Game starts in: ' + (seconds - second) + ' seconds', 40, 30);
        if (second >= seconds) {
            clearInterval(countDownInterval);
            that.canvasText.clearRect(1, 1, 320, 320);

            if (that.startBtnClicked) {
                that.started = true;
                console.log("Game Started");
                that.startWaves();
            }
        }
        second++;
    }, 1000)


    // Logic Loop.
    that.updateLoopInterval = setInterval(function () {
        that.updateAll();
    }, 1000 / that.fps);
    that.drawLoop();

};

// Se TODO lista 4.11
J.Game.prototype.PauseGame = function () {
    var that = this;


  if (!this.gamePaused) {

    console.log("Game Paused");
    clearInterval(that.updateLoopInterval);
    that.gamePaused = true;

  } else if (this.gamePaused) {

    console.log("Game UnPaused");
    that.updateLoopInterval = setInterval(function () {
        that.updateAll();
    }, 1000 / that.fps);

    that.gamePaused = false;
  }


};


// Create Tower
J.Game.prototype.createTower = function () {

    // När man placerar ut ett torn så skapas ett nytt Tower Objekt.
    this.towers[this.towers.length] = new J.Tower(this.pointX, this.pointY, this.towers, this.towerType, this.player, this.enemies, this.bullets);

};


// Start Waves
J.Game.prototype.startWaves = function () {
    // Startar ny Wave
    var that = this;

    this.waveCount++;
    document.getElementById('waveCount').innerHTML = this.waveCount;

    // Roterar enemy typen varje wave.
    this.type++;
    if (this.type > 3) {
        this.type = 1;
    }

    // Finederna spawnar 1/sek, tills antal fiender >= waveSize. Då clearas intervallen. och waitning sätts till false.
    this.spawnInterval = setInterval(function () {
        that.spawnEnemy(that.SPAWN_AMOUNT, that.type);

        if(that.spawnCounter >= that.waveSize) {

            that.spawnCounter = 0;
            clearInterval(that.spawnInterval);
            that.waiting = false;
        }
        that.spawnCounter++;
    }, that.spawnDelay);

};


// Spawn Enemy
J.Game.prototype.spawnEnemy = function (n, type) {

    // Skapar ett x antal enemyobjekt beroende på inparameter n.
    for (var i = 0; i < n; i++) {
        this.enemies[this.enemies.length] = new J.Enemy(type , this.enemies, this.level, this.levelNr, this.player);
        //console.log(this.enemies);
    }
};


// Update All
J.Game.prototype.updateAll = function () {

    var that = this;
    var seconds = 10;
    var second = 0;
    var countDownInterval;

    // Om spelet har startat, och waiting är false, och inga enemies finns kvar i arrayen.
    // Starta ny Wave.

    if (this.started && !this.waiting && this.enemies.length == 0) {
        this.waiting = true;

        countDownInterval = setInterval(function () {
            that.canvasText.clearRect(1, 1, 320, 320);
            that.canvasText.fillStyle = "#fff";
            that.canvasText.font = 'italic bold 15px myFont';
            that.canvasText.fillText('Next wave in: ' + (seconds - second) + ' seconds', 50, 30);
            if (second >= seconds) {
                clearInterval(countDownInterval);
                that.canvasText.clearRect(1, 1, 320, 320);
            }
            second++;
        }, 1000)

        this.waveInterval = setTimeout(function () {
            that.startWaves();
        }, that.waveDelayTime);

    }

    // Update All Enemies
    for (var i = 0; i < this.enemies.length; i++) {
        this.enemies[i].update();
    }

    // Update All Towers
    for (var i = 0; i < this.towers.length; i++) {
        this.towers[i].update();
    }

    // Update All Bullets
    for (var i = 0; i < this.bullets.length; i++) {
        this.bullets[i].update();
    }

    /* Collision control for bullets and enemies */
    // Se TODO lista 4.9
    for (var i=0; i<this.bullets.length; i++) {
        for (var j=0; j<this.enemies.length; j++) {
            var bullet = this.bullets[i];
            var enemy = this.enemies[j];
            if (bullet.x+bullet.size >= enemy.x && bullet.x <= enemy.x+enemy.size && bullet.y+bullet.size >= enemy.y && bullet.y <= enemy.y+enemy.size) {
                enemy.takeDamage(bullet.damage);
                this.bullets.splice(i, 1);
                break;
            }
        }
    }
};

// Draw All
J.Game.prototype.drawAll = function () {
    this.canvasObjectsCTX.clearRect(0, 0, 640, 640); // Clearar canvasObject varje iteration.

    // Draw All Eneemies
    for (var i = 0; i < this.enemies.length; i++) {
        this.enemies[i].draw(this.canvasObjectsCTX);
    }

    // Draw All Towers
    for (var i = 0; i < this.towers.length; i++) {
        this.towers[i].draw(this.canvasObjectsCTX);
    }

    // Draw All Bullets
    for (var i = 0; i < this.bullets.length; i++) {
        this.bullets[i].draw(this.canvasObjectsCTX);

    }

    // Om man ska placera ut ett torn, så ska "Pointen" markeras beroande vart man håller muspekaren.
    if (this.placingTower){
        this.canvasObjectsCTX.fillStyle = "#29FF37";
        this.canvasObjectsCTX.fillRect(this.pointX * this.pointSize , this.pointY * this.pointSize , this.pointSize, this.pointSize);
    }
};


/*window.addEventListener('load', function() {
    new J.Game();
});*/
