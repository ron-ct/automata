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
            currentFloor: 0,
            allowedMax: 5,   // Elevator A serves Ground through floor 5
            color: 'red'
        },
        B: {
            name: 'B',
            element: document.getElementById('elevatorB'),
            leftDoor: document.querySelector('#elevatorB .door.left'),
            rightDoor: document.querySelector('#elevatorB .door.right'),
            currentFloor: 0,
            allowedMax: 8,   // Elevator B serves Ground through floor 8
            color: 'green'
        },
        C: {
            name: 'C',
            element: document.getElementById('elevatorC'),
            leftDoor: document.querySelector('#elevatorC .door.left'),
            rightDoor: document.querySelector('#elevatorC .door.right'),
            currentFloor: 0,
            allowedMax: 10,  // Elevator C serves Ground through floor 10
            color: 'blue'
        }
    };

    // Set door colors for each elevator.
    Object.values(elevators).forEach(elevator => {
        elevator.leftDoor.style.background = elevator.color;
        elevator.rightDoor.style.background = elevator.color;
    });

    // Function to handle floor selection.
    function selectFloor(floor) {
        let chosenElevator = null;

        // Determine which elevator serves the requested floor.
        if (floor <= elevators.A.allowedMax) {
            chosenElevator = elevators.A;
        } else if (floor <= elevators.B.allowedMax) {
            chosenElevator = elevators.B;
        } else if (floor <= elevators.C.allowedMax) {
            chosenElevator = elevators.C;
        }

        if (!chosenElevator) {
            addFeedback(`No elevator serves floor ${floor}.`);
            return;
        }

        moveElevator(chosenElevator, floor);
    }

    // Function to handle the full movement process.
    // It first prompts the passenger to board (with doors open for 3 seconds) before moving.
    function moveElevator(elevator, targetFloor) {
        if (elevator.currentFloor === targetFloor) {
            addFeedback(`Elevator ${elevator.name} is already at floor ${targetFloor}.`);
            return;
        }
        
        // Prompt users to board by instructing them to go into the appropriate door.
        addFeedback(`Kindly go into door ${elevator.name}`);
        // Open doors and let them stay open for 3 seconds.
        openDoors(elevator);
        setTimeout(() => {
            closeDoors(elevator, () => {
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
                        // If the destination is not the ground floor, then return after a short delay.
                        if (targetFloor !== 0) {
                            setTimeout(() => {
                                closeDoors(elevator, () => {
                                    addFeedback(`Elevator ${elevator.name} returning to ground floor.`);
                                    moveElevator(elevator, 0);
                                });
                            }, 1000);
                        }
                    });
                }, travelTime);
            });
        }, 3000); // 3-second delay for passengers to enter before closing doors.
    }

    // Function to open elevator doors.
    // The callback is executed after the door animation completes.
    function openDoors(elevator, callback) {
        elevator.leftDoor.style.left = '-20px';
        elevator.rightDoor.style.left = '58px';
        addFeedback(`Elevator ${elevator.name} opens.`);
        setTimeout(() => {
            if (callback) callback();
        }, doorAnimationDuration);
    }

    // Function to close elevator doors.
    // The callback is executed after the door animation completes.
    function closeDoors(elevator, callback) {
        elevator.leftDoor.style.left = '0px';
        elevator.rightDoor.style.left = '38px';
        addFeedback(`Elevator ${elevator.name} closes.`);
        setTimeout(() => {
            if (callback) callback();
        }, doorAnimationDuration);
    }

    // Attach event listeners to floor buttons.
    document.querySelectorAll('.menu_buttons').forEach(button => {
        button.addEventListener('click', () => {
            const floor = parseInt(button.id);
            selectFloor(floor);
        });
    });
});
