// ======================================================
// EARNINGS.JS — SocialMint Earnings Page
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

  // ============================
  // DYNAMIC YEAR IN FOOTER
  // ============================
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }


  // ============================
  // TASK CARD ANIMATION
  // ============================
  const cards = document.querySelectorAll(".task-card");

  const reveal = () => {
    for (let i = 0; i < cards.length; i++) {
      let windowHeight = window.innerHeight;
      let elementTop = cards[i].getBoundingClientRect().top;

      if (elementTop < windowHeight - 40) {
        cards[i].classList.add("show");
      }
    }
  };

  window.addEventListener("scroll", reveal);
  reveal(); // initial call


  // ============================
  // SELECT BUTTON HANDLING
  // ============================
  document.querySelectorAll(".select").forEach(btn => {
    btn.addEventListener("click", () => {
      alert("This will later link to task registration or login.");
    });
  });


  // ============================
  // HERO BUTTON HANDLING
  // ============================
  const heroBtns = document.querySelectorAll(".big-btn");

  heroBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      window.location.href = "/signup/";
    });
  });


  // ============================
  // SCROLL TO TOP ON NAV CLICK
  // ============================
  document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

});
