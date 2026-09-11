/* =========================================================
   PEARL HAVEN ADMIN PANEL
   ========================================================= */


/* =========================================
   ADMIN EMAILS
   ========================================= */

const ADMIN_EMAILS = [
  "jhayann04022000@gmail.com",
  "keishaaquino2@gmail.com",
  "syvxnlei01@gmail.com"
];


let allUsers = [];


/* =========================================
   HELPERS
   ========================================= */

function money(value) {

  return "₱" +
    Number(value || 0).toLocaleString(
      "en-PH",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    );
}


function escapeHtml(value) {

  return String(value ?? "")
    .replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char]));

}


function showMessage(text, type = "") {

  const element =
    document.getElementById("message");

  if (!element) return;

  element.textContent = text;

  element.className =
    "message " + type;

}


/* =========================================
   CHECK ADMIN
   ========================================= */

async function checkAdmin() {

  const {
    data: {
      user
    }
  } =
    await supabaseClient.auth.getUser();


  if (!user) {

    window.location.href =
      "index.html";

    return false;
  }


  const email =
    String(user.email || "")
      .toLowerCase()
      .trim();


  if (!ADMIN_EMAILS.includes(email)) {

    alert(
      "Access denied. Admin account only."
    );

    await supabaseClient.auth.signOut();

    window.location.href =
      "index.html";

    return false;
  }


  return true;
}


/* =========================================
   LOAD USERS
   ========================================= */

async function loadUsers() {

  showMessage(
    "Loading registered users..."
  );


  const {
    data,
    error
  } =
    await supabaseClient
      .from("profiles")
      .select(
        "username,email,balance"
      )
      .order(
        "username",
        {
          ascending: true
        }
      );


  if (error) {

    console.error(
      "ADMIN LOAD ERROR:",
      error
    );

    showMessage(
      "Unable to load users: " +
      error.message
    );

    return;
  }


  allUsers =
    data || [];


  displayUsers(
    allUsers
  );


  updateStats(
    allUsers
  );


  showMessage(
    `${allUsers.length} user(s) found.`
  );
}


/* =========================================
   DISPLAY USERS
   ========================================= */

function displayUsers(users) {

  const table =
    document.getElementById(
      "usersTable"
    );


  if (!table) return;


  if (!users.length) {

    table.innerHTML = `
      <tr>
        <td colspan="3"
            style="text-align:center;padding:30px;">
          No registered users found.
        </td>
      </tr>
    `;

    return;
  }


  table.innerHTML =
    users.map(user => {

      return `
        <tr>

          <td>
            ${escapeHtml(
              user.username || "-"
            )}
          </td>

          <td>
            ${escapeHtml(
              user.email || "-"
            )}
          </td>

          <td>
            ${money(
              user.balance
            )}
          </td>

        </tr>
      `;

    }).join("");
}


/* =========================================
   STATS
   ========================================= */

function updateStats(users) {

  const totalUsers =
    document.getElementById(
      "totalUsers"
    );

  const totalBalance =
    document.getElementById(
      "totalBalance"
    );


  if (totalUsers) {

    totalUsers.textContent =
      users.length;
  }


  const total =
    users.reduce(
      (sum, user) => {

        return sum +
          Number(
            user.balance || 0
          );

      },
      0
    );


  if (totalBalance) {

    totalBalance.textContent =
      money(total);
  }
}


/* =========================================
   SEARCH
   ========================================= */

function searchUsers() {

  const search =
    document
      .getElementById("search")
      .value
      .toLowerCase()
      .trim();


  if (!search) {

    displayUsers(
      allUsers
    );

    return;
  }


  const filtered =
    allUsers.filter(user => {

      const username =
        String(
          user.username || ""
        ).toLowerCase();

      const email =
        String(
          user.email || ""
        ).toLowerCase();


      return (
        username.includes(search) ||
        email.includes(search)
      );

    });


  displayUsers(
    filtered
  );
}


/* =========================================
   LOGOUT
   ========================================= */

async function logoutAdmin() {

  await supabaseClient.auth.signOut();

  window.location.href =
    "index.html";
}


/* =========================================
   START ADMIN PANEL
   ========================================= */

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    const allowed =
      await checkAdmin();


    if (!allowed) return;


    await loadUsers();


    const search =
      document.getElementById(
        "search"
      );

    if (search) {

      search.addEventListener(
        "input",
        searchUsers
      );
    }


    const refreshBtn =
      document.getElementById(
        "refreshBtn"
      );

    if (refreshBtn) {

      refreshBtn.onclick =
        loadUsers;
    }


    const logoutBtn =
      document.getElementById(
        "logoutBtn"
      );

    if (logoutBtn) {

      logoutBtn.onclick =
        logoutAdmin;
    }

  }
);