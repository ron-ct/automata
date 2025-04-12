document.addEventListener('DOMContentLoaded', () => {
    const totalFloors = 11;
    const floorHeight = 50; // Height of each floor in pixels
    const doorAnimationDuration = 500; // Duration for door open/close in milliseconds
    const elevatorAnimationDuration = 1000; // Duration for elevator movement in milliseconds

    const userFeedback = document.getElementById('userFeedback');

    const building = document.getElementById('building');
// Adjust this to match your building's total floors


// Loop through each floor, starting from 0 (Ground Floor) to 9
for (let i = 0; i < totalFloors; i++) {
  const line = document.createElement('div');
  line.className = 'floor-line';
  line.style.bottom = (i * floorHeight) + 'px';
  building.appendChild(line);
}



    // Elevator objects for each shaft
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

    // Set door colors for each elevator
    Object.values(elevators).forEach(elevator => {
        elevator.leftDoor.style.background = elevator.color;
        elevator.rightDoor.style.background = elevator.color;
    });

    // Function to handle floor selection
    function selectFloor(floor) {
        let chosenElevator = null;

        // Determine which elevator serves the requested floor
        if (floor <= elevators.A.allowedMax) {
            chosenElevator = elevators.A;
        } else if (floor <= elevators.B.allowedMax) {
            chosenElevator = elevators.B;
        } else if (floor <= elevators.C.allowedMax) {
            chosenElevator = elevators.C;
        }

        if (!chosenElevator) {
            userFeedback.innerText = `No elevator serves floor ${floor}.`;
            return;
        }

        moveElevator(chosenElevator, floor);
    }

    // Function to move the elevator to the target floor
    function moveElevator(elevator, targetFloor) {
        const distance = Math.abs(targetFloor - elevator.currentFloor);
        const travelTime = distance * elevatorAnimationDuration;

        // Close doors before moving
        closeDoors(elevator, () => {
            // Calculate new position
            const newPosition = targetFloor * floorHeight;
            elevator.element.style.transition = `bottom ${travelTime}ms ease-in-out`;
            elevator.element.style.bottom = `${newPosition}px`;

            setTimeout(() => {
                elevator.currentFloor = targetFloor;
                openDoors(elevator);
            }, travelTime);
        });
    }

    // Function to open elevator doors
    function openDoors(elevator, callback) {
        elevator.leftDoor.style.left = '-20px';
        elevator.rightDoor.style.left = '58px';
        setTimeout(() => {
            if (callback) callback();
        }, doorAnimationDuration);
    }

    // Function to close elevator doors
    function closeDoors(elevator, callback) {
        elevator.leftDoor.style.left = '0px';
        elevator.rightDoor.style.left = '38px';
        setTimeout(() => {
            if (callback) callback();
        }, doorAnimationDuration);
    }

    // Attach event listeners to floor buttons
    document.querySelectorAll('.menu_buttons').forEach(button => {
        button.addEventListener('click', () => {
            const floor = parseInt(button.id);
            selectFloor(floor);
        });
    });
});
