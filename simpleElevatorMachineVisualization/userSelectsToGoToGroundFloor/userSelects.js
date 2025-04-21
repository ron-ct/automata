// code.js
document.addEventListener('DOMContentLoaded', () => {
    const totalFloors = 11;
    const floorHeight = 50; // Height of each floor in pixels
    const doorAnimationDuration = 500; // Duration for door open/close in milliseconds
    const elevatorAnimationDuration = 1000; // Duration for elevator movement in milliseconds
    const userFeedback = document.getElementById('userFeedback');
    const building = document.getElementById('building');
   
   
    // Function to update feedback for the user by overwriting previous text.
    function addFeedback(message) {
    userFeedback.innerText = message;
    }
   
   
    // Create floor lines in the building.
    for (let i = 0; i < totalFloors; i++) {
    const line = document.createElement('div');
    line.className = 'floor-line';
    line.style.bottom = (i * floorHeight) + 'px';
    building.appendChild(line);
    }
   
   
    // Elevator objects for each shaft.
    const elevators = {
    A: {
    name: 'A',
    element: document.getElementById('elevatorA'),
    leftDoor: document.querySelector('#elevatorA .door.left'),
    rightDoor: document.querySelector('#elevatorA .door.right'),
    human: document.getElementById('humanA'),
    currentFloor: 0,
    allowedMax: 5, // Elevator A serves Ground through floor 5
    color: 'red',
    isMoving: false // Track if the elevator is moving
    },
    B: {
    name: 'B',
    element: document.getElementById('elevatorB'),
    leftDoor: document.querySelector('#elevatorB .door.left'),
    rightDoor: document.querySelector('#elevatorB .door.right'),
    human: document.getElementById('humanB'),
    currentFloor: 0,
    allowedMax: 8, // Elevator B serves Ground through floor 8
    color: 'green',
    isMoving: false
    },
    C: {
    name: 'C',
    element: document.getElementById('elevatorC'),
    leftDoor: document.querySelector('#elevatorC .door.left'),
    rightDoor: document.querySelector('#elevatorC .door.right'),
    human: document.getElementById('humanC'),
    currentFloor: 0,
    allowedMax: 10, // Elevator C serves Ground through floor 10
    color: 'blue',
    isMoving: false
    }
    };
   
   
    // Set door colors for each elevator.
    Object.values(elevators).forEach(elevator => {
    elevator.leftDoor.style.background = elevator.color;
    elevator.rightDoor.style.background = elevator.color;
    });
   
   
    let selectedElevator = null;
   
   
    // Function to handle elevator selection.
    function selectElevator(elevatorName) {
    selectedElevator = elevators[elevatorName];
    addFeedback(`Elevator ${elevatorName} selected.`);
    }
   
   
    // Add click listeners to the elevators to select them
    document.getElementById('elevatorA').addEventListener('click', () => selectElevator('A'));
    document.getElementById('elevatorB').addEventListener('click', () => selectElevator('B'));
    document.getElementById('elevatorC').addEventListener('click', () => selectElevator('C'));
   
   
    // Function to handle floor selection.
    function selectFloor(floor) {
    if (!selectedElevator) {
    addFeedback('Please select an elevator first.');
    return;
    }
   
   
    if (floor > selectedElevator.allowedMax) {
    addFeedback(`Elevator ${selectedElevator.name} does not serve floor ${floor}.`);
    return;
    }
   
   
    if (selectedElevator.isMoving) {
    addFeedback(`Elevator ${selectedElevator.name} is currently in motion. Please wait.`);
    return;
    }
   
   
    moveElevator(selectedElevator, floor);
    selectedElevator = null; // Clear selected elevator after floor is selected and call is made.
    }
   
   
    // Function to handle the full movement process.
    function moveElevator(elevator, targetFloor) {
    if (elevator.currentFloor === targetFloor) {
    addFeedback(`Elevator ${elevator.name} is already at floor ${targetFloor}.`);
    return;
    }
   
   
    elevator.isMoving = true; // Set the flag to indicate the elevator is moving
   
   
    // Prompt users to board by instructing them to go into the appropriate door.
    addFeedback(`Kindly go into door ${elevator.name}`);
   
   
    // Open doors and let them stay open for 3 seconds.
    openDoors(elevator, () => {
    // Show human entering
    showHumanEnters(elevator);
   
   
    setTimeout(() => {
    closeDoors(elevator, () => {
    // Hide human after entering
    hideHuman(elevator);
   
   
    // Calculate travel time for the movement.
    const distance = Math.abs(targetFloor - elevator.currentFloor);
    const travelTime = distance * elevatorAnimationDuration;
    addFeedback(`Elevator ${elevator.name} moving to floor ${targetFloor}.`);
   
   
    // Move the elevator.
    const newPosition = targetFloor * floorHeight;
    elevator.element.style.transition = `bottom ${travelTime}ms ease-in-out`;
    elevator.element.style.bottom = `${newPosition}px`;
   
   
    setTimeout(() => {
    elevator.currentFloor = targetFloor;
    addFeedback(`Elevator ${elevator.name} reached floor ${targetFloor}.`);
   
   
    // Open doors at the destination.
    openDoors(elevator, () => {
    showHumanExits(elevator); // Show human exiting
   
   
    setTimeout(() => {
    hideHuman(elevator); // Hide human after exiting
    closeDoors(elevator, () => {
    elevator.isMoving = false; // Reset the moving flag when the elevator stops
    });
    }, 2000); // keep doors open for 2 seconds at destination
    });
    }, travelTime);
    });
    }, 3000); // 3-second delay for passengers to enter before closing doors.
    });
    }
   
   
    // Function to open elevator doors.
    function openDoors(elevator, callback) {
    elevator.leftDoor.style.left = '-20px';
    elevator.rightDoor.style.left = '58px';
    addFeedback(`Elevator ${elevator.name} opens.`);
    setTimeout(() => {
    if (callback) callback();
    }, doorAnimationDuration);
    }
   
   
    // Function to close elevator doors.
    function closeDoors(elevator, callback) {
    elevator.leftDoor.style.left = '0px';
    elevator.rightDoor.style.left = '38px';
    addFeedback(`Elevator ${elevator.name} closes.`);
    setTimeout(() => {
    if (callback) callback();
    }, doorAnimationDuration);
    }
   
   
    // Function to show human entering the elevator
    function showHumanEnters(elevator) {
    elevator.human.style.display = 'block';
    elevator.human.style.transform = 'translateX(-40px)'; // Move human into elevator
    }
   
   
    // Function to show human exiting the elevator
    function showHumanExits(elevator) {
    elevator.human.style.display = 'block';
    elevator.human.style.transform = 'translateX(40px)'; // Move human out of elevator
    }
   
   
    // Function to hide the human
    function hideHuman(elevator) {
    elevator.human.style.display = 'none';
    elevator.human.style.transform = 'translateX(0)'; // Reset position
    }
   
   
    // Attach event listeners to floor buttons.
    document.querySelectorAll('.menu_buttons').forEach(button => {
    button.addEventListener('click', () => {
    const floor = parseInt(button.id);
    selectFloor(floor);
    });
    });
   });
   