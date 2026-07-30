document.addEventListener("DOMContentLoaded", function () {

  let loginBtn = document.getElementById("loginBtn");
  let signupBtn = document.getElementById("signupBtn");
  let logoutBtn = document.getElementById("logoutBtn");

  function updateUI() {

    let isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true") {

      if(loginBtn) loginBtn.classList.add("hidden");
      if(signupBtn) signupBtn.classList.add("hidden");
      if(logoutBtn) logoutBtn.classList.remove("hidden");

    } else {

      if(loginBtn) loginBtn.classList.remove("hidden");
      if(signupBtn) signupBtn.classList.remove("hidden");
      if(logoutBtn) logoutBtn.classList.add("hidden");

    }
  }

  updateUI();

  if(logoutBtn){

    logoutBtn.onclick = () => {

      localStorage.removeItem("isLoggedIn");

      Swal.fire({
        title: "Logged Out",
        icon: "success"
      });

      setTimeout(() => {
        window.location.href = "./index.html";
      }, 1000);

    };
  }

});