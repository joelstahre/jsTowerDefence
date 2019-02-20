/* TODO:

- 

*/
var J = J || {};

J.Player = function () {
    
    this.playerHp = 20;
    this.playerCash = 250;


    document.getElementById('cash').innerHTML = this.playerCash;
     document.getElementById('hp').innerHTML = this.playerHp;
};


J.Player.prototype.updateHp = function (hp) {
    this.playerHp += hp;
    document.getElementById('hp').innerHTML = this.playerHp;

    if (this.playerHp <= 0) {
        
        // Se TODO lista 7.1
        console.log("Game Over");
        document.getElementById('hp').innerHTML = "Game Over Motherfucker"; // TODO spelet slut
    }
   
};


J.Player.prototype.updateCash = function (cash) {
    this.playerCash -= cash;
    document.getElementById('cash').innerHTML = this.playerCash;

};

J.Player.prototype.addCash = function (cash) {
    this.playerCash += cash;
    document.getElementById('cash').innerHTML = this.playerCash;

};