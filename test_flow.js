const email = "user" + Date.now() + "@example.com";
const password = "password123";

async function run() {
  console.log("Registering " + email);
  let res = await fetch('http://localhost:8081/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: "Full Test User",
      email: email,
      phone: "1234567890",
      password: password,
      confirmPassword: password
    })
  });
  console.log("Registration status:", res.status);
  let json = await res.json();
  console.log("Registration response:", json);

  const userId = json.data?.id;
  if (!userId) {
     console.log("No user id returned. Cannot test accounts.");
     return;
  }

  console.log("Testing auth login...");
  res = await fetch('http://localhost:8081/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email, password: password })
  });
  console.log("Login status:", res.status);
  console.log("Login response:", await res.json());

  console.log("Testing GET /api/accounts with userId=" + userId);
  res = await fetch('http://localhost:8081/api/accounts?userId=' + userId);
  console.log("Accounts status:", res.status);
  console.log("Accounts response:", await res.json());

  console.log("Testing GET /api/transactions with userId=" + userId);
  res = await fetch('http://localhost:8081/api/transactions?userId=' + userId);
  console.log("Transactions status:", res.status);
  console.log("Transactions response:", await res.json());
}
run();
