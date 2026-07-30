document.getElementById("loginForm").addEventListener("submit", function(e){
  e.preventDefault();

  let email = document.getElementById("email").value.trim().toLowerCase();
  let password = document.getElementById("password").value.trim();

  let users = JSON.parse(localStorage.getItem("users")) || [];

  let foundUser = users.find(u =>
    u.email.toLowerCase() === email && u.password === password
  );

  if(foundUser){

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(foundUser)); // يوزر الجلسة الحالية

    Swal.fire({
      title: "Successfully completed!",
      text: "Login Successful ✅",
      icon: "success"
    });

    setTimeout(() => {
      window.location.href = "./index.html";
    }, 1200);

  } else {

    Swal.fire({
      title: "Login Failed",
      text: "Wrong Email or Password ❌",
      icon: "error"
    });

  }
});