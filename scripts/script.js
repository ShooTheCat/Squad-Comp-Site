import boons from './boons.js';
import { builds } from './builds.js';

const SQUADSIZE = 50;
const squadContainer = document.querySelector('.squad-container');
const modal = document.getElementById("playerModal");
const modalCloseX = document.querySelector(".close-modal");
const modalNameForm = document.getElementById('modal-name-form')

modalNameForm.addEventListener('submit', UpdatePlayerName)


for (const buildType in builds) {
  AddBuild(buildType);
}

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


function MakePlayerContainer(sourceEle, targetSquare, sourceId) {
  const newDiv = document.createElement('div');
  const playerProf = document.createElement('img');
  const playerName = document.createElement('p');

  targetSquare.classList.remove('empty');

  playerName.textContent = 'Name';
  playerName.classList.add('player-name');

  playerProf.src = sourceEle.src;

  newDiv.classList.add('player', `${sourceId.split('-')[0]}-player`);
  newDiv.id = `${sourceId}`;

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

function AddModalBuild(buildType) {
  const boxInner = document.getElementById(`modal-${buildType}-inner`);
  for (const build of builds[buildType]) {
    const buildBox = document.createElement('img');

    buildBox.src = build.icon;

    buildBox.classList.add('icon', 'build');
    buildBox.id = `modal-${buildType}-${build.id}${build.value}`
    buildBox.onclick = ModalChoice;

    boxInner.appendChild(buildBox);
  };
};

function RemoveModalBuilds() {
  for (const buildType in builds) {
    const boxInner = document.getElementById(`modal-${buildType}-inner`);

    while (boxInner.firstChild) {
      boxInner.removeChild(boxInner.lastChild);
    };

    const classList = modal.classList;

    while (classList.length > 0) {
      classList.remove(classList.item(0));
    };

    classList.add('modal')
  };
};

function OpenModal(event) {
  const chosenSpot = event.target
  modal.classList.add(chosenSpot.id)
  for (const buildType in builds) {
    AddModalBuild(buildType);
  }

  const newPlayerName = document.getElementById('pname');
  newPlayerName.value = '';
  //If target square has player in it highlight their class in the selection
  if (chosenSpot.firstChild) {
    const chosenPlayer = chosenSpot.firstChild;
    const modalChosenBuild = document.getElementById(`modal-${chosenPlayer.id}`);
    modalChosenBuild.classList.add('modal-chosen');
  };
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
modalCloseX.onclick = function () {
  modal.style.display = "none";
  RemoveModalBuilds();
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    RemoveModalBuilds();
  };
};

function ModalChoice(event) {
  const chosenBuild = event.target;
  const chosenSpot = document.getElementById(modal.classList.item(1));

  if (chosenBuild.classList.contains('modal-chosen')) {
    return
  } else {
    
    if (chosenSpot.firstChild) {
      const prevChosenBuild = document.querySelector('.modal-chosen');
      prevChosenBuild.classList.remove('modal-chosen');
      
      chosenBuild.classList.add('modal-chosen');

      const playerBuild = chosenSpot.firstChild;

      playerBuild.id = chosenBuild.id.replace('modal-','');
      playerBuild.firstChild.src = chosenBuild.src

      playerBuild.classList.remove(playerBuild.classList.item(1));
      playerBuild.classList.add(`${chosenBuild.id.split('-')[1]}-player`);

    } else {
      chosenBuild.classList.add('modal-chosen');

      const newDiv = MakePlayerContainerModal(chosenBuild, chosenSpot);
      chosenSpot.draggable = true;

      chosenSpot.appendChild(newDiv);

    }

  }
}

function MakePlayerContainerModal(sourceEle, targetSquare) {
  const newDiv = document.createElement('div');
  const playerProf = document.createElement('img');
  const playerName = document.createElement('p');

  targetSquare.classList.remove('empty');

  playerName.textContent = 'Name';
  playerName.classList.add('player-name');

  playerProf.src = sourceEle.src;

  newDiv.classList.add('player', `${sourceEle.id.split('-')[1]}-player`);
  newDiv.id = sourceEle.id.replace('modal-','');

  newDiv.appendChild(playerProf);
  newDiv.appendChild(playerName);

  return newDiv;
};

function UpdatePlayerName(event) {
  event.preventDefault();
  const chosenSpot = document.getElementById(modal.classList.item(1));
  const newPlayerName = document.getElementById('pname');
  
  if (chosenSpot.firstChild) {
    const playerName = chosenSpot.firstChild.lastChild;
    playerName.textContent = newPlayerName.value
  } else {
    return
  }
}