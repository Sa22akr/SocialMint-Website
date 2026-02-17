document.addEventListener("DOMContentLoaded", () => {

  // ================================
  // FORMAT MONEY
  // ================================
  const money = (n) => `£${parseFloat(n || 0).toFixed(2)}`;


  // ================================
  // LOAD USER INFO
  // ================================
  async function loadUser() {
    try {
      const res = await fetch("/api/user-info/", { credentials: "include" });

      if (!res.ok) {
        window.location.href = "/login/";
        return;
      }

      const data = await res.json();

      document.getElementById("usernameDisplay").textContent = data.username;
      document.getElementById("usernameTag").textContent = "@" + data.username;
      document.getElementById("usernameDynamic").textContent = data.username;

      document.getElementById("followers").textContent = data.followers || 0;
      document.getElementById("following").textContent = data.following || 0;

      document.getElementById("balanceAmount").textContent = money(data.balance);
      document.getElementById("earningsTotal").textContent = money(data.earnings);

    } catch (err) {
      console.error("USER LOAD ERROR:", err);
      window.location.href = "/login/";
    }
  }


  // ================================
  // LOAD TASKS
  // ================================
  async function loadTasks() {
    const container = document.getElementById("taskList");
    if (!container) return;

    try {
      const res = await fetch("/api/tasks/", { credentials: "include" });
      const data = await res.json();

      const tasks = Array.isArray(data.tasks) ? data.tasks : [];
      container.innerHTML = "";

      if (tasks.length === 0) {
        container.innerHTML = `<p>No tasks available.</p>`;
        return;
      }

      tasks.forEach(task => {

        const badgeText =
          task.available >= 1000
            ? `${(task.available / 1000).toFixed(1)}k Tasks Available`
            : `${task.available} Tasks Available`;

        container.innerHTML += `
          <div class="task-row">
            <div class="task-left">
              <img src="/static/img/${task.icon}" class="task-big-icon">

              <button class="task-select-btn" data-id="${task.id}">
                SELECT
              </button>
            </div>

            <div class="task-mid">
              <h3 class="task-title">${task.title}</h3>

              <p class="task-earn">
                Earnings: <strong>${money(task.payout)} per action</strong>
              </p>

              <p class="task-desc">
                ${task.instructions}
              </p>
            </div>

            <div class="task-right">
              <div class="task-badge">${badgeText}</div>
            </div>
          </div>
        `;
      });

    } catch (err) {
      console.error("TASK LOAD ERROR:", err);
    }
  }


  // ================================
  // TASK SELECT → OPEN MODAL
  // ================================
  document.addEventListener("click", async function(e) {
    const btn = e.target.closest(".task-select-btn");
    if (!btn) return;

    const id = btn.dataset.id;

    try {
      const res = await fetch(`/api/task/${id}/`);
      const data = await res.json();

      document.getElementById("taskTitle").innerText = data.title;
      document.getElementById("taskInstructions").innerText = data.instructions;
      document.getElementById("taskReward").innerText = `Earn ${money(data.payout)}`;

      const link = document.getElementById("taskLink");

      if (data.link) {
        link.href = data.link;
        link.style.display = "inline-block";
      } else {
        link.style.display = "none";
      }

      document.getElementById("taskModal").style.display = "flex";

    } catch (err) {
      console.error("TASK DETAIL ERROR:", err);
    }
  });


  // ================================
  // CLOSE TASK MODAL
  // ================================
  const taskModal = document.getElementById("taskModal");
  const taskClose = document.getElementById("taskClose");

  taskClose?.addEventListener("click", () => {
    taskModal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === taskModal) {
      taskModal.style.display = "none";
    }
  });


  // ================================
  // LOGOUT
  // ================================
  async function logout() {
    try {
      await fetch("/api/logout/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      console.error("Logout error:", err);
    }

    window.location.href = "/login/";
  }

  document.querySelectorAll(".logout").forEach(btn => {
    btn.addEventListener("click", logout);
  });


  // ================================
  // FUND MODAL
  // ================================
  const fundModal = document.getElementById("fundModal");
  const fundBtn = document.querySelector(".fund");
  const fundClose = document.getElementById("fundClose");
  const fundAmountInput = document.getElementById("fundAmountInput");
  const fundSubmitBtn = document.getElementById("fundSubmitBtn");
  const fundMsg = document.getElementById("fundMsg");

  function openFundModal() {
    fundMsg.textContent = "";
    fundAmountInput.value = "";
    fundModal.style.display = "flex";
  }

  function closeFundModal() {
    fundModal.style.display = "none";
  }

  fundBtn?.addEventListener("click", openFundModal);
  fundClose?.addEventListener("click", closeFundModal);

  fundSubmitBtn?.addEventListener("click", async () => {
    const amount = fundAmountInput.value;

    if (!amount || Number(amount) <= 0) {
      fundMsg.textContent = "Enter valid amount.";
      return;
    }

    fundSubmitBtn.disabled = true;
    fundMsg.textContent = "Funding...";

    try {
      const res = await fetch("/api/demo-fund/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount })
      });

      const data = await res.json();

      if (!res.ok) {
        fundMsg.textContent = data.error || "Failed.";
        return;
      }

      document.getElementById("balanceAmount").textContent = money(data.balance);
      loadUser();

      fundMsg.textContent = "Wallet funded!";
      setTimeout(closeFundModal, 700);

    } catch (err) {
      fundMsg.textContent = "Network error.";
    }

    fundSubmitBtn.disabled = false;
  });


  // ================================
  // INIT
  // ================================
  loadUser();
  loadTasks();

});


// ================================
// EARN MODAL
// ================================
const earnModal = document.getElementById("earnModal");
const earnClose = document.getElementById("earnClose");

// open when clicking Earn in nav
document.querySelectorAll(".fa-coins").forEach(icon => {
  icon.parentElement.addEventListener("click", (e) => {
    e.preventDefault();
    earnModal.style.display = "flex";
  });
});

earnClose?.addEventListener("click", () => {
  earnModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === earnModal) {
    earnModal.style.display = "none";
  }
});


// ================================
// ADVERTISE MODAL
// ================================
const adModal = document.getElementById("adModal");
const adClose = document.getElementById("adClose");

// open when clicking Advertise in nav
document.querySelectorAll(".fa-bullhorn").forEach(icon => {
  icon.parentElement.addEventListener("click", (e) => {
    e.preventDefault();
    adModal.style.display = "flex";
  });
});

adClose?.addEventListener("click", () => {
  adModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === adModal) {
    adModal.style.display = "none";
  }
});
