// ===== PEARL HAVEN ADMIN PANEL =====

const ADMIN_EMAILS = [
  "keishaaquino2@gmail.com",
  "jhayann04022000@gmail.com",
  "syvxnlei01@gmail.com"
];

// Check kung admin ang naka-login
async function checkAdmin() {
  const { data: { user } } = await supabaseClient.auth.getUser();

  if (!user) {
    alert("Please login first.");
    window.location.href = "index.html";
    return null;
  }

  if (!ADMIN_EMAILS.includes(user.email.toLowerCase())) {
    alert("Access denied. Admin only.");
    window.location.href = "index.html";
    return null;
  }

  document.getElementById("adminEmail").textContent = user.email;
  return user;
}

// Load users
async function loadUsers() {
  const tableBody = document.getElementById("usersTableBody");
  tableBody.innerHTML = "<tr><td colspan='3'>Loading...</td></tr>";

  const { data, error } = await supabaseClient
    .from("profiles")
    .select("username,email,balance")
    .order("created_at", { ascending: false });

  if (error) {
    tableBody.innerHTML =
      `<tr><td colspan="3">${error.message}</td></tr>`;
    return;
  }

  if (!data.length) {
    tableBody.innerHTML =
      "<tr><td colspan='3'>No registered users.</td></tr>";
    return;
  }

  tableBody.innerHTML = "";

  data.forEach((user) => {
    tableBody.innerHTML += `
      <tr>
        <td>${user.username || "-"}</td>
        <td>${user.email}</td>
        <td>₱${Number(user.balance || 0).toLocaleString()}</td>
      </tr>
    `;
  });

  document.getElementById("totalUsers").textContent = data.length;
}

// Logout
async function logoutAdmin() {
  await supabaseClient.auth.signOut();
  window.location.href = "index.html";
}

window.addEventListener("DOMContentLoaded", async () => {
  const user = await checkAdmin();
  if (user) loadUsers();

  document.getElementById("logoutBtn").addEventListener("click", logoutAdmin);
});