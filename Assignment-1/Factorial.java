import java.util.InputMismatchException;
import java.util.Scanner;


public class Factorial {

    private static final int MAX_INPUT_FOR_LONG = 20;

    
    public static long factorialLoop(int n) {
        // Validation 1: Negative numbers
        if (n < 0) {
            throw new IllegalArgumentException("Factorial not defined for negative numbers.");
        }

        // Validation 2: Overflow 
        if (n > MAX_INPUT_FOR_LONG) {
            throw new IllegalArgumentException("Input " + n + " is too large the result will overflow.");
        }

        // Base Case: 0! = 1
        if (n == 0) {
            return 1L;
        }

        // Loop logic
        long result = 1L;
        for (int i = 1; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Enter a number for factorial (0-20):");

        try {
            int number = scanner.nextInt();

            long loopResult = factorialLoop(number);
            System.out.println("Factorial of " + number + " is: " + loopResult);

        } catch (InputMismatchException e) {
            System.out.println("Error: Invalid input. Enter only whole number.");
        } catch (IllegalArgumentException e) {
            System.out.println("Error: " + e.getMessage());
        } finally {
            scanner.close();
        }
    }
}