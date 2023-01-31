import { boons } from './boons.js';
import { builds } from './builds.js';

//Base squad size is 10x 5-man parties
let partyAmount = 10;

const squadContainer = document.querySelector('.squad-container');
const boonsContainer = document.querySelector('.boons-container');
const condiesContainer = document.querySelector('.condi-container');
const modal = document.getElementById("playerModal");
const modalCloseX = document.querySelector(".close-modal");
const modalNameForm = document.getElementById('modal-name-form')

modalNameForm.addEventListener('submit', UpdatePlayerName)


for (const buildType in builds) {
  AddBuild(buildType);
};

for (let i = 1; i <= partyAmount; i++) {
  AddBoon(i);
};


MakeGridBox(partyAmount);

function MakeGridBox(rows) {
  for (let i = 1; i <= rows; i++) {
    DrawRow(i);
  };

  function DrawRow(rowNumb) {
    const partyRow = document.createElement("div");

    partyRow.classList.add('party-row', `party-${rowNumb}`)

    const partyNumbBox = document.createElement("h2");
    partyNumbBox.textContent = rowNumb

    partyRow.appendChild(partyNumbBox);

    for (let j = 1; j <= 5; j++) {
      let partySpot = j;
      let party = rowNumb;

      const playerBox = document.createElement("div");

      playerBox.classList.add("player-box", "empty");
      playerBox.id = `player-box-${party}-${partySpot}`;

      playerBox.ondragover = allowDrop;
      playerBox.ondrop = drop;
      playerBox.setAttribute('ondragstart', 'drag(event)')

      playerBox.onclick = OpenModal;

      partyRow.appendChild(playerBox);

    };
    squadContainer.appendChild(partyRow);
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
  for (const profession in builds[buildType]) {
    for (const build of builds[buildType][profession]) {
      const buildBox = document.createElement('img');

      buildBox.src = build.icon;

      buildBox.classList.add('icon', 'build');
      buildBox.id = `${buildType}-${build.id}${build.value}`

      buildBox.draggable = true;
      buildBox.setAttribute('ondragstart', 'drag(event)')

      boxInner.appendChild(buildBox);
    };
  };
};

function AddModalBuild(buildType) {
  const boxInner = document.getElementById(`modal-${buildType}-inner`);
  for (const profession in builds[buildType]) {
    for (const build of builds[buildType][profession]) {
      const buildBox = document.createElement('img');

      buildBox.src = build.icon;

      buildBox.classList.add('icon', 'build');
      buildBox.id = `modal-${buildType}-${build.id}${build.value}`
      buildBox.onclick = ModalChoice;

      boxInner.appendChild(buildBox);
    };
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

document.onkeydown = function (event) {
  if ((event.key == 'Escape') || (event.key == 'Enter')) {
    modal.style.display = "none";
    UpdatePlayerName(event);
    RemoveModalBuilds();
  };
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

      playerBuild.id = chosenBuild.id.replace('modal-', '');
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
  newDiv.id = sourceEle.id.replace('modal-', '');

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
};

function AddBoon(party) {
  const partyBox = document.createElement('div');
  const partyNumb = document.createElement('p');

  partyBox.classList.add('party-box');

  partyNumb.textContent = `Party ${party}`;

  boonsContainer.appendChild(partyNumb);

  for (const boon in boons) {
    const boonIcon = document.createElement('img');

    boonIcon.src = boons[boon]['url'];
    boonIcon.classList.add('icon');

    partyBox.appendChild(boonIcon);
  };

  boonsContainer.appendChild(partyBox);

};