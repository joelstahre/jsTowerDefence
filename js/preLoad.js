var J = J || {};



    var imgs = ['../td/img/greentower.png', '../td/img/bluetower.png', '../td/img/redtower.png', '../td/img/backBTN.png', '../td/img/border.png', '../td/img/controls.png', '../td/img/lvl1.png', '../td/img/lvl2.png' , '../td/img/creditsBTN.png', '../td/img/creditsBTNhover.png', '../td/img/helpBTN.png', '../td/img/helpBTNhover.png', '../td/img/pauseBTN.png', '../td/img/pauseBTNhover.png', '../td/img/startBTN.png', '../td/img/startBTNhover.png', '../td/img/monsters/blue1.png', '../td/img/monsters/green1.png', '../td/img/monsters/purple1.png', '../td/img/monsters/blue2.png', '../td/img/monsters/green2.png', '../td/img/monsters/purple2.png'];
    var imgObjects = [];
    var currentImg = 0;

    var body = document.getElementById("body");
    var loadingDiv = document.getElementById('loadingDiv');

    var loadingText = loadingDiv.getElementsByTagName("p")[0];
    var loadingBar = document.getElementById("loadingbar");


function preLoadImages() {



    if (currentImg >= imgs.length) {

        new J.Game();
        loadingDiv.classList.add("preLoad");

    } else {

        loadingDiv.classList.remove("preLoad");

        imgObjects[currentImg] = new Image();
        imgObjects[currentImg].onload = preLoadImages;
        imgObjects[currentImg].src = imgs[currentImg];
        imgObjects[currentImg].className = "preLoad";
        imgObjects[currentImg].id = imgs[currentImg];

        body.appendChild(imgObjects[currentImg]);

        loadingText.innerHTML = "Loading image <strong>" + (currentImg + 1) + "</strong> of <strong>" + imgs.length + "</strong>";

        loadingBar.style.width = Math.ceil((currentImg + 1) / imgs.length * 100) + "%";

        currentImg++;


    }

    return true;


};



window.addEventListener('load', function() {
    preLoadImages();
});
