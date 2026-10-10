import java.io.File;
import java.util.Scanner;

public class TestEnv {
    public static void main(String[] args) {
        String key = "DATABASE_URL";
        String[] files = { "d:/project/online-banking-system/.env.local" };
        for (String file : files) {
            File f = new File(file);
            System.out.println("File exists? " + f.exists());
            if (f.exists()) {
                try (Scanner scanner = new Scanner(f)) {
                    while (scanner.hasNextLine()) {
                        String line = scanner.nextLine().trim();
                        if (line.startsWith(key + "=")) {
                            String value = line.substring(key.length() + 1).trim();
                            if (value.startsWith("\"") && value.endsWith("\"")) {
                                value = value.substring(1, value.length() - 1);
                            }
                            System.out.println("Found value: " + value);
                            return;
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        System.out.println("Not found!");
    }
}
