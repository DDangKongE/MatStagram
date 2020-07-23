const img = document.getElementsByClassName('leftSideImg')[0];

let imgNum = 2;

setInterval(changeImgs, 3000);

function changeImgs() {
    if (imgNum > 3) {
        imgNum = 1;
    }
    img.style.backgroundImage = `url('/images/${imgNum}.jpg')`;
    imgNum++;
}