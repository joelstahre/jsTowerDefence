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

