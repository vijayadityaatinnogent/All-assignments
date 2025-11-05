import java.util.*;

// --- O (Open/Closed) & L (Liskov Substitution) ---
abstract class Account {
    protected String accountNumber;
    protected String owner;
    protected double balance;

    public Account(String accountNumber, String owner) {
        this.accountNumber = accountNumber;
        this.owner = owner;
        this.balance = 0.0;
    }

    public abstract String accountType();

    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            System.out.println("Deposited " + amount + ". New Balance: " + balance);
        } else {
            System.out.println("Deposit must be positive.");
        }
    }

    public void withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            System.out.println("Withdrew " + amount + ". New Balance: " + balance);
        } else {
            System.out.println("Invalid withdrawal amount.");
        }
    }

    public double getBalance() {
        return balance;
    }
}

// --- SavingsAccount ---
class SavingsAccount extends Account {
    public SavingsAccount(String accountNumber, String owner) {
        super(accountNumber, owner);
    }

    @Override
    public String accountType() {
        return "Savings Account";
    }
}

// --- CurrentAccount ---
class CurrentAccount extends Account {
    public CurrentAccount(String accountNumber, String owner) {
        super(accountNumber, owner);
    }

    @Override
    public String accountType() {
        return "Current Account";
    }
}

// --- S (Single Responsibility) ---
class TransactionService {
    private Account account;

    public TransactionService(Account account) {
        this.account = account;
    }

    public void performDeposit(double amount) {
        account.deposit(amount);
    }

    public void performWithdrawal(double amount) {
        account.withdraw(amount);
    }
}

// --- D (Dependency Inversion) ---
interface NotificationService {
    void notify(String message);
}

class EmailNotification implements NotificationService {
    @Override
    public void notify(String message) {
        System.out.println("[EMAIL]: " + message);
    }
}

class SMSNotification implements NotificationService {
    @Override
    public void notify(String message) {
        System.out.println("[SMS]: " + message);
    }
}

// --- I (Interface Segregation) ---
interface AccountInfo {
    void displayInfo();
}

class BasicAccountInfo implements AccountInfo {
    private Account account;

    public BasicAccountInfo(Account account) {
        this.account = account;
    }

    @Override
    public void displayInfo() {
        System.out.println(
            "Account No: " + account.accountNumber +
            ", Owner: " + account.owner +
            ", Type: " + account.accountType() +
            ", Balance: " + account.getBalance()
        );
    }
}

public class bankingSystem {
    public static void main(String[] args) {
        Account acc1 = new SavingsAccount("1001", "Vijay");
        Account acc2 = new CurrentAccount("1002", "Rahul");

        // Transactions
        TransactionService service1 = new TransactionService(acc1);
        service1.performDeposit(5000);
        service1.performWithdrawal(1200);

        // Notifications
        NotificationService notifier = new EmailNotification();
        notifier.notify("Transaction completed successfully.");

        // Account Info
        AccountInfo info1 = new BasicAccountInfo(acc1);
        info1.displayInfo();

        AccountInfo info2 = new BasicAccountInfo(acc2);
        info2.displayInfo();
    }
}
