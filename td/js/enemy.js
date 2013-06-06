
var J = J || {};

J.Enemy = function (type, enemiesArray, level, levelNr, player) {
    this.level = level;
    this.levelNr = levelNr;
    this.type = type;
    this.enemyTypes = J.EnemyTypes;
    this.enemies = enemiesArray;
    this.player = player;

    this.startX = this.level[levelNr].startX;
    this.startY = this.level[levelNr].startY;
    this.x = this.startX * 32;
    this.y = this.startY * 32;
    
    this.posX = this.startX;
    this.posY = this.startY;
    
 
    this.lock = false;

    //this.alive = true;

    this.up = false;
    this.down = false;
    this.right = false;
    this.left = false;

    
    this.img = document.getElementById(this.enemyTypes[type].img1);


    this.color = this.enemyTypes[type].color;
    this.size = this.enemyTypes[type].size;
    this.speed = this.enemyTypes[type].speed;   
    this.hp = this.enemyTypes[type].hp;        
    this.value = this.enemyTypes[type].value; 
    
    
    this.maxFrame = 32 / this.speed;
    this.frame = 0;
};

J.Enemy.prototype.takeDamage = function(damage) {
    this.hp -= damage;

    if (this.hp <= 0) {
        this.enemies.splice(W.getIndex(this, this.enemies), 1);
        this.player.addCash(this.value);
    }    
};


J.Enemy.prototype.update = function () {

    var level = this.level[this.levelNr].layout;
    var that = this;

    
    
    //
    if(this.frame <= 10){
        this.img = document.getElementById(this.enemyTypes[that.type].img1);
    } else {
        this.img = document.getElementById(this.enemyTypes[that.type].img2);
    }
    
    
    
    // Se TODO lista 2.2
    // Se TODO lista 2.3
    // Se TODO lista 2.4
    
    if (this.lock === false) {
        
        
        // Om en fiende har nått målet, plocka bort dem från arrayen.
        // Och updatera spelarens hp.
       if (level[this.posY][this.posX] == 3) {

            that.enemies.splice(this, 1);
            that.player.updateHp(-1);

            console.log(that.enemies);
        }

        //Avgör position
        // Up
    
    
       
    
        if (level[this.posY - 1][this.posX] == 2 && this.down === false) {
            
            
            this.posY--;
            this.lock = true;

            this.up = true;
            this.left = false;
            this.right = false;
        }

        // Right
        else if (level[this.posY][this.posX + 1] == 2 && this.left === false) {
            
            this.posX++;
            this.lock = true;

            this.right = true;
            this.down = false;
            this.up = false;
        }

        // Down
        else if (level[this.posY + 1][this.posX] == 2 && this.up === false) {

            this.posY++;
            this.lock = true;

            this.down = true;
            this.left = false;
            this.right = false;
        }

        // Left
        else if (level[this.posY][this.posX - 1] == 2 && this.right === false) {

            this.posX--;
            this.lock = true;

            this.left = true;
            this.down = false;
            this.up = false;
        }


        // Se till att fienderna fortsätter att gå ifall dem kommer i mål.
        if (level[this.posY][this.posX + 1] == 3) {

            this.posX++;
            this.lock = true;
        }

        else if (level[this.posY][this.posX - 1] == 3) {

            this.posX--;
            this.lock = true;
        }

        else if (level[this.posY + 1][this.posX] == 3) {

            this.posY++;
            this.lock = true;
        }

        else if (level[this.posY - 1][this.posX] == 3) {
            
            this.posY--;
            this.lock = true;
        }   
    }


    //Förflyttning i pixlar
    //Up
    if (this.posY * 32 < this.y) {

        this.y -= this.speed;

        if (this.y == this.posY * 32) {

            this.lock = false;
        }
 
    }

    // Right
    else if (this.posX * 32 > this.x) {

        this.x += this.speed;

        if (this.x == this.posX * 32) {

            this.lock = false;
        }
    }

    // Down
    else if (this.posY * 32 > this.y) {

        this.y += this.speed;

        if (this.y == this.posY * 32) {

            this.lock = false;
        }
    }

    // Left
    else if (this.posX * 32 < this.x) {

        this.x -= this.speed;

        if (this.x == this.posX * 32) {

            this.lock = false;
        }
    }
};


J.Enemy.prototype.draw = function (ctx) { // ta emot canvas-referensen (spelbordet)
    // Se TODO lista 2.5
   
    if (this.frame == this.maxFrame) {
        this.frame = 0;
    } else {
        this.frame++;
    }
    
     ctx.drawImage(this.img, this.x, this.y, this.size, this.size);    
    
};