import boons from './boons.js';
import builds from './builds.js';

const SQUADSIZE = 50;
const squadContainer = document.querySelector('.squad-container');

function makeGridBox() {
  for (let i = 1; i <= 50; i++) {
    const playerBox = document.createElement("div");
    playerBox.classList.add("player-box");
    playerBox.ondragover = allowDrop;
    playerBox.ondrop = drop;
    squadContainer.appendChild(playerBox);
  };
};


function allowDrop(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("text");
  const exampleBuild = document.getElementById(data);

  const newImage = document.createElement('img');
  newImage.src = exampleBuild.src;
  newImage.id = `${exampleBuild.id}-1-1`

  if (event.target.parentNode.className == 'player-box') {
    const fchild = event.target.parentNode.firstChild;
    event.target.parentNode.replaceChild(newImage, fchild);
  } else {
    event.target.appendChild(newImage);
  }
}

makeGridBox();
