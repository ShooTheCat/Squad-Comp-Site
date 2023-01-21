const SQUADSIZE = 50;
const squadContainer = document.querySelector('.squad-container');

function makeGridBox () {
    for (let i = 1; i <= 50; i++) {
        const playerBox = document.createElement("div");
        playerBox.classList.add("player-box");
        squadContainer.appendChild(playerBox);
    };
};

makeGridBox();


function dragstart_handler(ev) {
    // Add the target element's id to the data transfer object
    ev.dataTransfer.setData('image', ev.target.id);
  }

  window.addEventListener("DOMContentLoaded", () => {
    // Get the element by id
    const element = document.getElementById("p1");
    // Add the ondragstart event listener
    element.addEventListener("dragstart", dragstart_handler);
  });
