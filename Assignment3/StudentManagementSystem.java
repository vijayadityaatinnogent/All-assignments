import java.util.*;
import java.util.stream.Collectors;

// Data classes / containers
class ClassObj {
    int id;
    String name;

    ClassObj(int id, String name) {
        this.id = id;
        this.name = name;
    }
}

class StudentObj {
    int id;
    String name;
    int classId;
    int marks;
    String gender;
    int age;
    String status; // "Pass" or "Fail"
    Integer rank; // nullable

    StudentObj(int id, String name, int classId, int marks, String gender, int age) {
        this.id = id;
        this.name = name;
        this.classId = classId;
        this.marks = marks;
        this.gender = gender;
        this.age = age;
    }
}

class AddressObj {
    int id;
    String pinCode;
    String city;
    int studentId;

    AddressObj(int id, String pinCode, String city, int studentId) {
        this.id = id;
        this.pinCode = pinCode;
        this.city = city;
        this.studentId = studentId;
    }
}

// In-memory "DB"
class InMemoryDB {
    Map<Integer, ClassObj> classes = new HashMap<>();
    Map<Integer, StudentObj> students = new HashMap<>();
    Map<Integer, AddressObj> addresses = new HashMap<>();

    ClassObj findClassByName(String name) {
        for (ClassObj cl : classes.values()) {
            if (cl.name.equalsIgnoreCase(name)) {
                return cl;
            }
        }
        return null;
    }
}

// Business logic
class StudentService {
    private final InMemoryDB db;

    public StudentService(InMemoryDB db) {
        this.db = db;
    }

    // Validation rule: age <= 20, otherwise reject
    public Map.Entry<Boolean, String> insertStudent(StudentObj s, List<AddressObj> addresses) {
        if (s.age > 20) {
            return Map.entry(false, "Student " + s.id + " NOT inserted: age " + s.age + " > 20 (violates rule).");
        }
        if (!db.classes.containsKey(s.classId)) {
            return Map.entry(false, "Student " + s.id + " NOT inserted: class_id " + s.classId + " does not exist.");
        }
        db.students.put(s.id, s);
        for (AddressObj a : addresses) {
            db.addresses.put(a.id, a);
        }
        return Map.entry(true, "Student " + s.id + " inserted.");
    }

    // Evaluate Pass/Fail and ranks
    public void evaluatePassFailAndRank() {
        for (StudentObj s : db.students.values()) {
            s.status = (s.marks >= 50) ? "Pass" : "Fail";
        }

        List<StudentObj> sorted = db.students.values().stream()
                .sorted(Comparator.comparingInt((StudentObj s) -> -s.marks)
                        .thenComparing(s -> s.name))
                .collect(Collectors.toList());

        int lastMarks = -1;
        int lastRank = 0;
        int countSeen = 0;

        for (StudentObj s : sorted) {
            countSeen++;
            if (s.marks != lastMarks) {
                lastMarks = s.marks;
                lastRank = countSeen;
            }
            s.rank = lastRank;
        }
    }

    // Generic filter helper
    private List<StudentObj> applyFilters(List<StudentObj> students,
            String gender,
            Integer age,
            Integer minAge,
            Integer maxAge,
            String className,
            String pincode,
            String city) {
        return students.stream().filter(s -> {
            if (gender != null && !s.gender.equalsIgnoreCase(gender))
                return false;
            if (age != null && s.age != age)
                return false;
            if (minAge != null && s.age < minAge)
                return false;
            if (maxAge != null && s.age > maxAge)
                return false;
            if (className != null) {
                ClassObj cl = db.classes.get(s.classId);
                if (cl == null || !cl.name.equalsIgnoreCase(className))
                    return false;
            }
            if (pincode != null || city != null) {
                List<AddressObj> addrs = db.addresses.values().stream()
                        .filter(a -> a.studentId == s.id)
                        .collect(Collectors.toList());
                if (pincode != null && addrs.stream().noneMatch(a -> a.pinCode.equals(pincode)))
                    return false;
                if (city != null && addrs.stream().noneMatch(a -> a.city.equalsIgnoreCase(city)))
                    return false;
            }
            return true;
        }).collect(Collectors.toList());
    }

    // Functional requirements
    public List<StudentObj> findByPincode(String pinCode) {
        return applyFilters(new ArrayList<>(db.students.values()), null, null, null, null, null, pinCode, null);
    }

    public List<StudentObj> findByCity(String city, String gender) {
        return applyFilters(new ArrayList<>(db.students.values()), gender, null, null, null, null, null, city);
    }

    public List<StudentObj> findByClass(String className) {
        return applyFilters(new ArrayList<>(db.students.values()), null, null, null, null, className, null, null);
    }

    public List<StudentObj> getPassedStudents() {
        List<StudentObj> passed = db.students.values().stream()
                .filter(s -> "Pass".equals(s.status))
                .collect(Collectors.toList());
        return applyFilters(passed, null, null, null, null, null, null, null);
    }

    public List<StudentObj> getFailedStudents(String gender) {
        List<StudentObj> failed = db.students.values().stream()
                .filter(s -> "Fail".equals(s.status))
                .collect(Collectors.toList());
        return applyFilters(failed, gender, null, null, null, null, null, null);
    }

    // Delete student and related addresses; also delete class if it becomes empty
    public Map.Entry<Boolean, String> deleteStudent(int studentId) {
        if (!db.students.containsKey(studentId)) {
            return Map.entry(false, "Student " + studentId + " not found.");
        }
        int classId = db.students.get(studentId).classId;

        db.addresses.values().removeIf(a -> a.studentId == studentId);
        db.students.remove(studentId);

        boolean stillInClass = db.students.values().stream()
                .anyMatch(s -> s.classId == classId);

        if (!stillInClass) {
            db.classes.remove(classId);
            return Map.entry(true, "Student " + studentId + " and related addresses deleted. Class " + classId
                    + " deleted (now empty).");
        }
        return Map.entry(true, "Student " + studentId + " and related addresses deleted.");
    }
}

// Pagination utility
class Pagination {
    public static <T> List<T> paginate(List<T> items, Integer start, Integer end,
            String orderBy, boolean ascending, Comparator<T> comparator) {
        List<T> arr = new ArrayList<>(items);
        if (orderBy != null && comparator != null) {
            arr.sort(ascending ? comparator : comparator.reversed());
        }
        int startIdx = (start == null) ? 0 : Math.max(0, start - 1);
        int endIdx = (end == null) ? arr.size() : Math.min(arr.size(), end);
        return arr.subList(startIdx, endIdx);
    }
}

// Bootstrapping sample data
class DataLoader {
    public static void loadSampleData(InMemoryDB db, StudentService svc) {
        List<ClassObj> classes = List.of(
                new ClassObj(1, "A"),
                new ClassObj(2, "B"),
                new ClassObj(3, "C"),
                new ClassObj(4, "D"));
        for (ClassObj cl : classes)
            db.classes.put(cl.id, cl);

        List<StudentObj> students = List.of(
                new StudentObj(1, "stud1", 1, 88, "F", 10),
                new StudentObj(2, "stud2", 1, 70, "F", 11),
                new StudentObj(3, "stud3", 2, 88, "M", 22),
                new StudentObj(4, "stud4", 2, 55, "M", 33),
                new StudentObj(5, "stud5", 1, 30, "F", 44),
                new StudentObj(6, "stud6", 3, 30, "F", 33),
                new StudentObj(7, "stud6", 3, 10, "F", 22),
                new StudentObj(8, "stud6", 3, 0, "M", 11));

        List<AddressObj> addresses = List.of(
                new AddressObj(1, "452002", "indore", 1),
                new AddressObj(2, "422002", "delhi", 1),
                new AddressObj(3, "442002", "indore", 2),
                new AddressObj(4, "462002", "delhi", 3),
                new AddressObj(5, "472002", "indore", 4),
                new AddressObj(6, "452002", "indore", 5),
                new AddressObj(7, "452002", "delhi", 5),
                new AddressObj(8, "482002", "mumbai", 6),
                new AddressObj(9, "482002", "bhopal", 7),
                new AddressObj(10, "482002", "indore", 8));

        Map<Integer, List<AddressObj>> addrByStudent = new HashMap<>();
        for (AddressObj a : addresses) {
            addrByStudent.computeIfAbsent(a.studentId, k -> new ArrayList<>()).add(a);
        }

        for (StudentObj s : students) {
            List<AddressObj> addrs = addrByStudent.getOrDefault(s.id, new ArrayList<>());
            Map.Entry<Boolean, String> res = svc.insertStudent(s, addrs);
            System.out.println(res.getValue());
        }
    }
}

// Demo / Main runner
public class StudentManagementSystem {
    public static void main(String[] args) {
        InMemoryDB db = new InMemoryDB();
        StudentService svc = new StudentService(db);

        System.out.println("=== Loading sample data (age > 20 will be rejected) ===");
        DataLoader.loadSampleData(db, svc);

        System.out.println("\n=== Evaluate pass/fail and ranks ===");
        svc.evaluatePassFailAndRank();

        System.out.println("All students in DB (post validation):");
        db.students.values().forEach(s -> printStudent(s, db));
        System.out.println();

        System.out.println("== Find students by pincode=482002 ==");
        svc.findByPincode("482002").forEach(s -> printStudent(s, db));
        System.out.println();

        System.out.println("== Find students by city=indore, filter gender=F ==");
        svc.findByCity("indore", "F").forEach(s -> printStudent(s, db));
        System.out.println();

        System.out.println("== Get passed students (no filters) ==");
        svc.getPassedStudents().forEach(s -> printStudent(s, db));
        System.out.println();

        System.out.println("== Get failed students (filters: gender=F) ==");
        svc.getFailedStudents("F").forEach(s -> printStudent(s, db));
        System.out.println();

        System.out.println("== Pagination examples ==");

        // Get all female students
        List<StudentObj> femaleStudents = db.students.values().stream()
                .filter(s -> s.gender.equalsIgnoreCase("F"))
                .collect(Collectors.toList());

        // Example 1: records 1–2 (default order)
        List<StudentObj> page1 = Pagination.paginate(femaleStudents, 1, 2, null, true, null);
        System.out.println("Female students records 1–2 (default order): " +
                page1.stream().map(s -> s.id).toList());

        // Example 2: records 1–2 ordered by name
        List<StudentObj> page2 = Pagination.paginate(femaleStudents, 1, 2, "name", true,
                Comparator.comparing(s -> s.name));
        System.out.println("Female students records 1–2 ordered by name: " +
                page2.stream().map(s -> s.id).toList());

        // Example 3: records 1–2 ordered by marks (descending)
        List<StudentObj> page3 = Pagination.paginate(femaleStudents, 1, 2, "marks", false,
                Comparator.comparingInt(s -> s.marks));
        System.out.println("Female students records 1–2 ordered by marks desc: " +
                page3.stream().map(s -> s.id).toList());

        System.out.println("\n== Delete student with id=1 ==");
        Map.Entry<Boolean, String> delRes = svc.deleteStudent(1);
        System.out.println(delRes.getValue());
        svc.evaluatePassFailAndRank();

        System.out.println("Classes after deletion: " +
                db.classes.values().stream().map(c -> c.name).toList());
        System.out.println("Students after deletion: " +
                db.students.values().stream().map(s -> s.id).toList());
    }

    private static void printStudent(StudentObj s, InMemoryDB db) {
        List<AddressObj> addrs = db.addresses.values().stream()
                .filter(a -> a.studentId == s.id)
                .collect(Collectors.toList());
        String className = db.classes.containsKey(s.classId) ? db.classes.get(s.classId).name : "N/A";
        System.out.printf(Locale.US,
                "{id=%d, name='%s', class='%s', marks=%d, gender='%s', age=%d, status=%s, rank=%s, addresses=%s}%n",
                s.id, s.name, className, s.marks, s.gender, s.age, s.status, s.rank,
                addrs.stream().map(a -> String.format("{pin=%s, city=%s}", a.pinCode, a.city)).toList());
    }
}
