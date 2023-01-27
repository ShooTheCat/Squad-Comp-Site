import boons from './boons.js';
import { builds } from './builds.js';

const SQUADSIZE = 50;
const squadContainer = document.querySelector('.squad-container');
const modal = document.getElementById("myModal");
const modalCloseX = document.querySelector(".close-modal");

AddBuild('support');
AddBuild('damage');
AddBuild('celestial');
AddBuild('other');

makeGridBox();

function makeGridBox() {
  let partySpot = 1;
  let party = 1;
  for (let i = 0; i < 50; i++) {
    if ((partySpot % 6) == 0) {
      partySpot = 1;
      party++;
    }
    const playerBox = document.createElement("div");

    playerBox.classList.add("player-box", "empty");
    playerBox.id = `player-box-${party}-${partySpot}`;

    playerBox.ondragover = allowDrop;
    playerBox.ondrop = drop;
    playerBox.setAttribute('ondragstart', 'drag(event)')

    playerBox.onclick = OpenModal;

    squadContainer.appendChild(playerBox);

    partySpot++;
  };
};

function allowDrop(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
};

function drop(event) {
  event.preventDefault();

  const draggedId = event.dataTransfer.getData("text");
  const draggedEle = document.getElementById(draggedId);

  const targetSquare = event.target

  //If it's taken from the build container create a new player container
  //else check if the target spot is empty or not and either
  //move the player to the new spot or swap the two players
  if (draggedEle.classList.contains('build')) {
    const newDiv = MakePlayerContainer(draggedEle, targetSquare, draggedId);
    //If the spot is not empty replace the old one with the new build
    //else just append it to the spot
    if (targetSquare.hasChildNodes()) {
      const playerDiv = targetSquare.firstChild;
      targetSquare.replaceChild(newDiv, playerDiv);
    } else {
      targetSquare.draggable = true;
      
      targetSquare.appendChild(newDiv);
    };
  } else {
    const playerDiv = draggedEle.firstChild;
    if (targetSquare.classList.contains('empty')) {
      targetSquare.classList.remove('empty');

      targetSquare.draggable = true;
      
      targetSquare.appendChild(playerDiv);

      draggedEle.classList.add('empty');
      draggedEle.draggable = false;
    } else {
      const targetPlayer = targetSquare.firstChild;

      targetSquare.replaceChild(playerDiv, targetPlayer);
      draggedEle.appendChild(targetPlayer);
    };
  };
};


function MakePlayerContainer(draggedEle, targetSquare, draggedId) {
  const newDiv = document.createElement('div');
  const playerProf = document.createElement('img');
  const playerName = document.createElement('p');

  targetSquare.classList.remove('empty');

  playerName.textContent = 'Name';

  playerProf.src = draggedEle.src;

  newDiv.classList.add('player', `${draggedId.split('-')[0]}-player`);
  newDiv.id = `${draggedId}`;

  newDiv.appendChild(playerProf);
  newDiv.appendChild(playerName);

  return newDiv;
};


function AddBuild(buildType) {
  const boxInner = document.getElementById(`${buildType}-inner`);
  for (const build of builds[buildType]) {
    const buildBox = document.createElement('img');

    buildBox.src = build.icon;

    buildBox.classList.add('icon', 'build');
    buildBox.id = `${buildType}-${build.id}${build.value}`

    buildBox.draggable = true;
    buildBox.setAttribute('ondragstart', 'drag(event)')

    boxInner.appendChild(buildBox);
  };
};


function OpenModal() {
  modal.style.display = "block"
};

// When the user clicks on <span> (x), close the modal
modalCloseX.onclick = function() {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  };
};