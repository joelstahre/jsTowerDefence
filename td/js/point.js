/* TODO:

- 

*/
var J = J || {};

J.Point = function (type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.size = 32; // sätter storleken på alla points

    if (this.type === 0) {
        this.color = "#231F20";   // default     
    } else if (this.type === 1) {
        this.color = "#c70004"; // pathstart
    }
    else if (this.type === 2) {
        this.color = "#ffffff"; //path
    }
    else {
        this.color = "#87ADFF"; // pathend
    }
};

J.Point.prototype.draw = function(ctx) { // ta emot canvas-referensen (spelbordet)
    
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x * this.size, this.y * this.size, this.size, this.size);
};