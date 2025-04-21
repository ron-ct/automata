document.addEventListener('DOMContentLoaded', () => {
    const totalFloors = 11;
    const floorHeight = 60; // Height of each floor in pixels
    const doorAnimationDuration = 500;
    const elevatorAnimationDuration = 1000;

    const userFeedback = document.getElementById('userFeedback');
    const building = document.getElementById('building');

    let selectedElevator = null; // ✅ MOD 1: Track the selected elevator

    function addFeedback(message) {
        userFeedback.innerText = message;
    }

    for (let i = 0; i < totalFloors; i++) {
        const line = document.createElement('div');
        line.className = 'floor-line';
        line.style.bottom = (i * floorHeight) + 'px';
        building.appendChild(line);
    }

    const elevators = {
        A: {
            name: 'A',
            element: document.getElementById('elevatorA'),
            leftDoor: document.querySelector('#elevatorA .door.left'),
            rightDoor: document.querySelector('#elevatorA .door.right'),
            currentFloor: 0,
            allowedMax: 5,
            color: 'red'
        },
        B: {
            name: 'B',
            element: document.getElementById('elevatorB'),
            leftDoor: document.querySelector('#elevatorB .door.left'),
            rightDoor: document.querySelector('#elevatorB .door.right'),
            currentFloor: 0,
            allowedMax: 8,
            color: 'green'
        },
        C: {
            name: 'C',
            element: document.getElementById('elevatorC'),
            leftDoor: document.querySelector('#elevatorC .door.left'),
            rightDoor: document.querySelector('#elevatorC .door.right'),
            currentFloor: 0,
            allowedMax: 10,
            color: 'blue'
        }
    };

    function openDoors(elevator, callback) {
        elevator.leftDoor.style.left = '-13px';
        elevator.rightDoor.style.left = '39px';
        addFeedback(`Elevator ${elevator.name} doors open.`);
        setTimeout(() => {
            if (callback) callback();
        }, doorAnimationDuration);
    }

    function closeDoors(elevator, callback) {
        elevator.leftDoor.style.left = '0px';
        elevator.rightDoor.style.left = '26px';
        addFeedback(`Elevator ${elevator.name} doors close.`);
        setTimeout(() => {
            if (callback) callback();
        }, doorAnimationDuration);
    }

    function moveElevator(elevator, targetFloor) {
        if (elevator.currentFloor === targetFloor) {
            addFeedback(`Elevator ${elevator.name} is already at floor ${targetFloor}. Doors opening...`);
            openDoors(elevator, () => {
                setTimeout(() => {
                    closeDoors(elevator);
                }, 1000);
            });
            return;
        }

        addFeedback(`Enter Elevator ${elevator.name}`);
        openDoors(elevator);
        setTimeout(() => {
            closeDoors(elevator, () => {
                const distance = Math.abs(targetFloor - elevator.currentFloor);
                const travelTime = distance * elevatorAnimationDuration;
                addFeedback(`Elevator ${elevator.name} moving to floor ${targetFloor}.`);

                const newPosition = targetFloor * floorHeight;
                elevator.element.style.transition = `bottom ${travelTime}ms ease-in-out`;
                elevator.element.style.bottom = `${newPosition}px`;

                setTimeout(() => {
                    elevator.currentFloor = targetFloor;
                    addFeedback(`Elevator ${elevator.name} arrived at floor ${targetFloor}.`);
                    openDoors(elevator, () => {
                        setTimeout(() => {
                            closeDoors(elevator);
                        }, 1000);
                    });
                }, travelTime);
            });
        }, 3000);
    }

    function selectClosestElevator(floor) {
        const eligibleElevators = Object.values(elevators).filter(elevator => floor <= elevator.allowedMax);
        if (!eligibleElevators.length) {
            addFeedback(`No elevator serves floor ${floor}.`);
            return null;
        }

        return eligibleElevators.reduce((closest, elevator) => {
            const distance = Math.abs(elevator.currentFloor - floor);
            return (!closest || distance < Math.abs(closest.currentFloor - floor)) ? elevator : closest;
        }, null);
    }

    Object.values(elevators).forEach(elevator => {
        const doors = [elevator.leftDoor, elevator.rightDoor];
        doors.forEach(door => {
            door.addEventListener('click', () => {
                // ✅ MOD 2: Select elevator and handle button clicks
                selectedElevator = elevator;
                addFeedback(`Select a floor for Elevator ${elevator.name}.`);

                Object.values(elevators).forEach(el => {
                    el.element.style.border = el === elevator ? '2px solid yellow' : 'none';
                });

                document.querySelectorAll('.menu_buttons').forEach(button => {
                    button.onclick = () => {
                        const targetFloor = button.id === '0' ? 0 : parseInt(button.id);
                        const pickupFloor = selectedElevator?.currentFloor || 0;

                        if (selectedElevator) {
                            if (targetFloor > selectedElevator.allowedMax) {
                                addFeedback(`Elevator ${selectedElevator.name} cannot serve floor ${targetFloor}.`); // No access message

                                const suitableElevator = selectClosestElevator(targetFloor);
                                if (suitableElevator) {
                                    addFeedback(`Elevator ${suitableElevator.name} incoming to your floor (${pickupFloor}) to take you to floor ${targetFloor}.`); // Best suited elevator message
                                    moveElevator(suitableElevator, pickupFloor);

                                    const pickupDelay = (Math.abs(suitableElevator.currentFloor - pickupFloor) * elevatorAnimationDuration) + 3000;
                                    setTimeout(() => {
                                        moveElevator(suitableElevator, targetFloor);
                                    }, pickupDelay);
                                } else {
                                    addFeedback(`No elevator can go to floor ${targetFloor}.`);
                                }
                            } else {
                                moveElevator(selectedElevator, targetFloor);
                            }
                        } else {
                            const autoElevator = selectClosestElevator(targetFloor);
                            if (autoElevator) {
                                addFeedback(`Elevator ${autoElevator.name} incoming to take you to floor ${targetFloor}.`);
                                moveElevator(autoElevator, targetFloor);
                            } else {
                                addFeedback(`No elevator can reach floor ${targetFloor}.`);
                            }
                        }

                        selectedElevator = null;
                        Object.values(elevators).forEach(el => el.element.style.border = 'none');
                    };
                });
            });
        });
    });

    document.getElementById('allToGround').addEventListener('click', () => {
        addFeedback('Moving elevators to ground floor.');
        Object.values(elevators).forEach(elevator => {
            if (elevator.currentFloor !== 0) {
                moveElevator(elevator, 0);
            }
        });
    });
});
