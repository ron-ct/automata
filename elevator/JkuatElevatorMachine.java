package elevator;
import java.util.Scanner;


public class JkuatElevatorMachine{
    private int userCurrentFloor;
    private String elevatorState;

    public JkuatElevatorMachine(){
        this.userCurrentFloor = 0;
        this.elevatorState = "idle";
    }

    /**
     * The Machine determines the appropriate door based on the requested floor
     */
    public String getDoor(int requestedFloor){
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
        if(door == null){return;}
        if(requestedFloor == userCurrentFloor){
            System.out.println("You are already on the " + requestedFloor + " floor.");
            return;
        }

        System.out.println("Request received: Move from floor "+ userCurrentFloor+ " to " + requestedFloor);
        System.out.println("Kindly enter: "+ door);
        System.out.println("Door "+ door+ " opens. User may enter...");

        for(int i = 5; i >= 0; i --){
            System.out.print("\r " + i);
             try{
        Thread.sleep(1000);
        }
        catch(InterruptedException e){
            e.printStackTrace();
        }

        }
        System.out.println();
        System.out.println("Door " + door + " closes.");


        System.out.println("Elevator will start moving shortly...");
        for(int i = 5; i >= 0; i --){
            System.out.print("\r" + i);
             try{
        Thread.sleep(1000);
        }
        catch(InterruptedException e){
            e.printStackTrace();
        }

        }
        System.out.println();

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
        int timeFloor = estimateTime(requestedFloor);
        int timeToFloor = timeFloor / 1000;

        for(int i = timeToFloor; i >= 0; i--){

            System.out.print("\r" + i);

            try{Thread.sleep(1000);}
            catch (InterruptedException e){
            e.printStackTrace();
        }
        }

        //change state to arrived
        userCurrentFloor = requestedFloor;
        elevatorState = "Arrived";
        System.out.println();

        System.out.println("*[ARRIVED]* Elevator has reached floor "+ userCurrentFloor);
        System.out.println("Door opened. Users may kindly exit.");

        //simulate door open duration
        for(int i = 5; i >=0; i--){
            System.out.print("\r" + i);
            try {
            Thread.sleep(1000); //Door open delay
        }catch (InterruptedException e){
            e.printStackTrace();
        }
        
        }

        System.out.println();

        System.out.println(door + " closes.");


        //change state to idle
        elevatorState = "idle";
        System.out.println("Elevator is now idle at floor "+ userCurrentFloor);

    }

    public int estimateTime(int requestedFloor){
        int difference = requestedFloor - userCurrentFloor ;
        if(difference < 0){
            difference = userCurrentFloor - requestedFloor;
        }
        return difference * 2000;
    }

}