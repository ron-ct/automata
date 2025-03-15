import java.util.*;
import elevator.*;
import automataExceptions.*;

public class Main {
    public static void main(String[] args){
        JkuatElevatorMachine elevator = new JkuatElevatorMachine();
        Scanner scanner = new Scanner(System.in);
        int num;

        System.out.println("Elevator Finite State Machine Simulation with Java: ");
        System.out.println("Elevator serves from Ground floor to 10th floor, with:");
        System.out.println("Door A: floors 0 - 5");
        System.out.println("Door B: floors 0 - 8");
        System.out.println("Door C: floors 0 - 10");
        System.out.println("Type 'exit' to quit\n");
        System.out.println("Enter requested floor (0 - 10)");
        System.out.println("0 for Ground floor\n1 - 1st\n2 - 2nd\n3 - 3rd\n4 - 4th\n5 - 5th\n6 - 6th\n7 - 7th\n8 - 8th\n9 - 9th\n10 - 10th\n: ");
        num = scanner.nextInt();

        if(num >= 0 && num <= 10){
            elevator.moveToFloor(num);

        }

    }
}