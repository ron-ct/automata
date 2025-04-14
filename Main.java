import java.util.*;
import elevator.*;

public class Main {
    public static void main(String[] args) {
        JkuatElevatorMachine elevator = new JkuatElevatorMachine();
        Scanner scanner = new Scanner(System.in);
        int num;
        
        System.out.println("Elevator Finite State Machine Simulation with Java: ");
        System.out.println("Elevator serves from Ground floor to 10th floor, with:");
        System.out.println("Door A: floors 0 - 5");
        System.out.println("Door B: floors 6 - 8");
        System.out.println("Door C: floors 9 - 10");
        System.out.println("Type 'exit' to quit\n");


        while (true) {
            System.out.println();
            System.out.println("Enter requested floor (0 - 10): ");
            System.out.println("0 for Ground floor\n1 - 1st\n2 - 2nd\n3 - 3rd\n4 - 4th\n5 - 5th\n6 - 6th\n7 - 7th\n8 - 8th\n9 - 9th\n10 - 10th\n: ");
            String input = scanner.nextLine();
            
            if (input.equalsIgnoreCase("exit")) {
                System.out.println("Exiting simulation.");
                break;
            }
            
            try {
                num = Integer.parseInt(input);
            } catch (NumberFormatException nfe) {
                System.out.println("Invalid input. Please enter a valid number between 0 and 10.");
                continue;
            }
            
            if (num < 0 || num > 10) {
                System.out.println("Invalid floor selection. Please choose a valid floor (0-10).");
                continue;
            }
            
            // If valid floor is entered, move the elevator.
            elevator.moveToFloor(num);
            System.out.println("Elevator will be ready to serve you in 5");
            System.out.println();

            try{
                for(int i = 5; i > 0; i--){
                    System.out.print("\r" + i);
                    Thread.sleep(1000);
                }
                continue;

            }catch(InterruptedException e){
                e.printStackTrace();

            }
            System.out.println();
            continue;
        }
        
        scanner.close();
    }
}
