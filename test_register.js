const data = { name: "Agent Test", email: "agenttest@example.com", phone: "1234567890", password: "password123", confirmPassword: "password123" };
fetch('http://localhost:8081/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
.then(res => res.json())
.then(console.log)
.catch(console.error);
