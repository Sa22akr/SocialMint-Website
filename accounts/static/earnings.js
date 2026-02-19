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

    } catch (err) {
      console.error("USER LOAD ERROR:", err);
      window.location.href = "/login/";
    }
  }




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
// MEMBERSHIP JS
// ================================
const payMembershipBtn = document.getElementById("payMembershipBtn");

payMembershipBtn?.addEventListener("click", async () => {

    payMembershipBtn.disabled = true;

    try {
        const res = await fetch("/pay-membership/", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error);
            payMembershipBtn.disabled = false;
            return;
        }

        alert("Membership Activated!");

        window.location.href = "/dashboard/";

    } catch (err) {
        alert("Network error.");
    }

    payMembershipBtn.disabled = false;
});



 
  // ================================
  // INIT
  // ================================
  loadUser();

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

// ================= TASK ACTION MODAL =================

const taskModal = document.getElementById("taskActionModal");
const closeTaskModal = document.getElementById("taskActionClose");

const modalTitle = document.getElementById("taskActionTitle");
const modalPrice = document.getElementById("taskActionPrice");
const modalDescription = document.getElementById("taskActionDescription");
const modalIcon = document.getElementById("taskActionIcon");

const quantityLabel = document.getElementById("quantityLabel");
const platformGroup = document.getElementById("platformGroup");

const quantityInput = document.getElementById("taskQuantity");
const totalDisplay = document.getElementById("taskTotal");

let currentPrice = 0;


// ===== OPEN MODAL =====
document.querySelectorAll(".select-btn").forEach(button => {
    button.addEventListener("click", function () {

        // Set modal content
        modalTitle.innerText = this.dataset.title;
        modalPrice.innerText = this.dataset.price;
        modalDescription.innerText = this.dataset.description;
        modalIcon.src = this.dataset.icon;

        // Store numeric price
        currentPrice = parseFloat(this.dataset.amount) || 0;

        // Reset fields
        quantityInput.value = "";
        totalDisplay.innerText = "£0.00";

        const type = this.dataset.type;

        // Default settings
        platformGroup.style.display = "block";

        if (type === "youtube") {
            quantityLabel.innerText = "Number of Subscribers You Want";
            platformGroup.style.display = "none";
            document.getElementById("taskLink").placeholder =
                "Enter your YouTube channel link";
        }

        else if (type === "like") {
            quantityLabel.innerText = "Number of Likes You Want";
            document.getElementById("taskLink").placeholder =
                "Enter your post link";
        }

        else if (type === "comment") {
            quantityLabel.innerText = "Number of Comments You Want";
            document.getElementById("taskLink").placeholder =
                "Enter your post link";
        }

        else {
            quantityLabel.innerText = "Number of Followers You Want";
            document.getElementById("taskLink").placeholder =
                "Enter your page/profile link";
        }

        taskModal.style.display = "flex";
    });
});


// ===== LIVE TOTAL CALCULATION =====
if (quantityInput) {
    quantityInput.addEventListener("input", function () {

        const quantity = parseFloat(this.value);

        if (!isNaN(quantity) && quantity > 0) {
            const total = quantity * currentPrice;
            totalDisplay.innerText = "£" + total.toFixed(2);
        } else {
            totalDisplay.innerText = "£0.00";
        }

    });
}



// ===== CLOSE MODAL =====
if (closeTaskModal) {
    closeTaskModal.addEventListener("click", function () {
        taskModal.style.display = "none";
    });
}


window.addEventListener("click", function (e) {
    if (e.target === taskModal) {
        taskModal.style.display = "none";
    }
});


