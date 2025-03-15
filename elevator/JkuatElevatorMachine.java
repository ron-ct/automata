package elevator;
import java.util.Scanner;
import automataExceptions.*;


public class JkuatElevatorMachine{
    private int userCurrentFloor;
    private String elevatorState;

    public JkuatElevatorMachine(){
        this.userCurrentFloor = 0;
        this.elevatorState = "Idle";
    }

    /**
     * The Machine determines the appropriate door based on the requested floor
     */
    public String getDoor(int requestedFloor){
        try {
            if(requestedFloor == userCurrentFloor){
                throw new SameFloor("Dear User you are already on the desired Floor");
            }
        }catch (SameFloor e){
            System.out.println(e.getMessage());
        }

        try {
            if(requestedFloor > 10 || requestedFloor < 0){
                throw new noSuchFloor("Dear User, the floor specified is not available in this building...\n Kindly choose a valid floor from 1 to 10");
            }
        }catch(noSuchFloor e){System.out.println(e.getMessage()); }

        if(requestedFloor >= 0 && requestedFloor <= 5){
            return "Door A";
        } else if (requestedFloor > 5 && requestedFloor < 9) {
            return "Door B";
        }else if(requestedFloor > 8 && requestedFloor <= 10){
            return "Door C";
        }else{
            return null;
        }
    }

    //movement to the floor the user has requested
    public void moveToFloor(int requestedFloor){
        String door = getDoor(requestedFloor);

        System.out.println("Request received: Move from floor "+ userCurrentFloor+ " to " + requestedFloor);

        //Change state from Idle to moving
        elevatorState = "Moving";
        String direction;

        if(requestedFloor > userCurrentFloor){direction = "UP";
        } else if (requestedFloor < userCurrentFloor) {
            direction="DOWN";
        }else{
            direction = "none";
        }

        if(!direction.equals("none")){
            System.out.println("*[MOVING]* Elevator is moving " + direction + " from floor " + userCurrentFloor +" to floor "+ requestedFloor + " ...");
        }else{
            System.out.print("You are already in the requested floor");
        }

        //Simulate Movement
        try{
            Thread.sleep(estimateTime(requestedFloor));
        }catch (InterruptedException e){
            e.printStackTrace();
        }

        //change state to arrived
        userCurrentFloor = requestedFloor;
        elevatorState = "Arrived";

        System.out.println("[Arrived] Elevator has reached floor "+ userCurrentFloor);
        System.out.println("Door opened. Users may enter/exit.");

        //simulate door open duration
        try {
            Thread.sleep(1000); //Door open delay
        }catch (InterruptedException e){
            e.printStackTrace();
        }
        System.out.println(door + " closes");

        //change state to idle
        elevatorState = "idle";
        System.out.println("Elevator is now idle at floor "+ userCurrentFloor);




    }

    public int estimateTime(int requestedFloor){
        int difference = requestedFloor - userCurrentFloor ;
        return difference * 2000; // 2000 milliseconds for each floor

    }

}