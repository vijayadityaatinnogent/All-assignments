import java.util.InputMismatchException;
import java.util.Scanner;

public class FactorialRecursion {

    private static final int MAX_INPUT_FOR_LONG = 20;

    
    public static long factorialRecursion(int n) {
        // Validation 1: Negative numbers
        if (n < 0) {
            throw new IllegalArgumentException("Factorial negative numbers ke liye defined nahi hai.");
        }

        // Validation 2: Overflow 
        if (n > MAX_INPUT_FOR_LONG) {
            throw new IllegalArgumentException("Input " + n + " bohot bada hai. Result 'long' ko overflow kar dega. Max input 20 hai.");
        }

        // Base Case: 0! ya 1! = 1
        if (n == 0 || n == 1) {
            return 1L;
        }

        // Recursive Step: n * (n-1)!
        return n * factorialRecursion(n - 1);
    }

    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Recursion waale code ke liye number enter kar (0-20):");

        try {
            // Validation 3: String or decimal input 
            int number = scanner.nextInt();

            // if number is correct call the function
            long recursiveResult = factorialRecursion(number);
            System.out.println("Factorial of " + number + " is: " + recursiveResult);

        } catch (InputMismatchException e) {
            // User enter string or decimal
            System.out.println("Error: Invalid input. Sirf whole number daal.");
        } catch (IllegalArgumentException e) {
            // catch the exception of big numbers and negative numbers
            System.out.println("Error: " + e.getMessage());
        } finally {
            scanner.close(); 
        }
    }
}

