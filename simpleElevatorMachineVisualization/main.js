document.addEventListener('DOMContentLoaded', () => {

  const total_floors = 11;
  const floorHeight = 50;
  const doorAnimationDuration = 500;
  const elevatorAnimDuration = 1000;
  
  const userMenu = document.getElementById('user_menu');
  const messageDiv = document.getElementById('userFeedback');
  
  let groundButton = document.getElementById('0');
  let button1 = document.getElementById('1');
  let button2 = document.getElementById('2');
  let button3 = document.getElementById('3');
  let button4 = document.getElementById('4');
  let button5 = document.getElementById('5');
  let button6 = document.getElementById('6');
  let button7 = document.getElementById('7');
  let button8 = document.getElementById('8');
  let button9 = document.getElementById('9');
  let button10 = document.getElementById('10');
  
  
  // Draw horizontal floor lines.
  const building = document.getElementById('building');
  for (let i = 0; i <= totalFloors; i++) {
    const line = document.createElement('div');
    line.className = 'floor-line';
    line.style.bottom = (i * floorHeight) + 'px';
    building.appendChild(line);
  }
  
  // Elevator objects for each shaft.
  // Each elevator contains its cabin, door elements, current floor, allowed maximum floor, and designated color.
  const elevators = {
    A: {
       element: document.getElementById('elevatorA'),
       leftDoor: document.querySelector('#elevatorA .door.left'),
       rightDoor: document.querySelector('#elevatorA .door.right'),
       currentFloor: 0,
       allowedMax: 5,   // Elevator A serves Ground through floor 5
       color: 'red'
    },
    B: {
       element: document.getElementById('elevatorB'),
       leftDoor: document.querySelector('#elevatorB .door.left'),
       rightDoor: document.querySelector('#elevatorB .door.right'),
       currentFloor: 0,
       allowedMax: 8,   // Elevator B serves Ground through floor 8
       color: 'green'
    },
    C: {
       element: document.getElementById('elevatorC'),
       leftDoor: document.querySelector('#elevatorC .door.left'),
       rightDoor: document.querySelector('#elevatorC .door.right'),
       currentFloor: 0,
       allowedMax: 10,  // Elevator C serves Ground through floor 10
       color: 'blue'
    }
  };
  
  // Set door colors for each elevator.
  elevators.A.leftDoor.style.background = 'red';
  elevators.A.rightDoor.style.background = 'red';
  elevators.B.leftDoor.style.background = 'green';
  elevators.B.rightDoor.style.background = 'green';
  elevators.C.leftDoor.style.background = 'blue';
  elevators.C.rightDoor.style.background = 'blue';
  
  let selectedElevator = null;
  let targetFloor = 0;
  
  // When a floor button is clicked:
  // Assignment rules:
  // - Floors 0 (Ground) to 5 use Elevator A.
  // - Floors 6 to 8 use Elevator B.
  // - Floors 9 to 10 use Elevator C.
  function selectFloor(floor) {
    let chosen;
    if (floor <= 5) {
      chosen = elevators.A;
    } else if (floor <= 8) {
      chosen = elevators.B;
    } else if (floor <= 10) {
      chosen = elevators.C;
    }
    // Enforce allowed floors.
    if (floor > chosen.allowedMax) {
       messageEl.innerText = "Floor " + (floor === 0 ? "Ground" : floor) +
         " is not served by Elevator " + (chosen === elevators.A ? "A" : chosen === elevators.B ? "B" : "C");
       return;
    }
    targetFloor = floor;
    selectedElevator = chosen;
    messageEl.innerText = "Elevator " + (chosen === elevators.A ? "A" : chosen === elevators.B ? "B" : "C") +
      " moving to " + (floor === 0 ? "Ground" : "Floor " + floor) + "...";
    disableButtons(true);
    // Move elevator to target floor.
    moveElevator(chosen, chosen.currentFloor, targetFloor, () => {
       chosen.currentFloor = targetFloor;
       messageEl.innerText = "Arrived at " + (floor === 0 ? "Ground" : "Floor " + floor) + ". Opening doors...";
       // Open doors upon arrival.
       openDoors(chosen, () => {
         messageEl.innerText = "Doors open. Closing doors...";
         // After a pause, close doors.
         setTimeout(() => {
           closeDoors(chosen, () => {
             messageEl.innerText = "Doors closed. Returning to Ground...";
             // After dropping off the user, return the elevator to ground floor.
             moveElevator(chosen, chosen.currentFloor, 0, () => {
               chosen.currentFloor = 0;
               messageEl.innerText = "Elevator returned to Ground. Ready.";
               disableButtons(false);
             });
           });
         }, 1000);
       });
    });
  }
  
  // Disable or enable floor buttons.
  function disableButtons(disable) {
    const btns = document.getElementsByClassName('floor-button');
    Array.from(btns).forEach(btn => btn.disabled = disable);
  }
  
  // Animate elevator movement from startFloor to endFloor.
  function moveElevator(elevator, startFloor, endFloor, callback) {
    const startBottom = startFloor * floorHeight;
    const endBottom = endFloor * floorHeight;
    const delta = endBottom - startBottom;
    const startTime = performance.now();
    function animateMove(now) {
       const elapsed = now - startTime;
       const t = Math.min(elapsed / elevatorAnimDuration, 1);
       const currentBottom = startBottom + delta * t;
       elevator.element.style.bottom = currentBottom + 'px';
       if (t < 1) {
          requestAnimationFrame(animateMove);
       } else {
          if (callback) callback();
       }
    }
    requestAnimationFrame(animateMove);
  }
  
  // Animate door opening: slide left door to left and right door to right.
  function openDoors(elevator, callback) {
    elevator.leftDoor.style.left = '-20px';
    elevator.rightDoor.style.left = '58px';
    setTimeout(() => {
       if (callback) callback();
    }, doorAnimDuration);
  }
  
  // Animate door closing: slide doors back to original positions.
  function closeDoors(elevator, callback) {
    elevator.leftDoor.style.left = '0px';
    elevator.rightDoor.style.left = '38px';
    setTimeout(() => {
       if (callback) callback();
    }, doorAnimDuration);
  }
})

