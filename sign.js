let userType = "user";

let userBtn = document.getElementById("userBtn");
let hostBtn = document.getElementById("hostBtn");

userBtn.onclick = () => {
  userType = "user";
  userBtn.classList.add("active");
  hostBtn.classList.remove("active");
};

hostBtn.onclick = () => {
  userType = "host";
  hostBtn.classList.add("active");
  userBtn.classList.remove("active");
};

document.getElementById("signupForm").addEventListener("submit", function(e){

  e.preventDefault();

  let firstName = document.getElementById("firstName").value.trim();
  let lastName = document.getElementById("lastName").value.trim();
  let email = document.getElementById("email").value.trim().toLowerCase();
  let password = document.getElementById("password").value.trim();

  if(password.length < 8){
    Swal.fire({
      title: "Weak Password",
      text: "Password must be at least 8 characters",
      icon: "warning"
    });
    return;
  }

  // تحميل كل الحسابات المسجلة (array بدل حساب واحد)
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // منع تكرار نفس الإيميل
  let exists = users.some(u => u.email.toLowerCase() === email);

  if(exists){
    Swal.fire({
      title: "Email Already Used",
      text: "يوجد حساب مسجل بهذا الإيميل بالفعل",
      icon: "error"
    });
    return;
  }

  let newUser = {
    id: Date.now(),
    type: userType,
    firstName,
    lastName,
    email,
    password,
    verified: false,
    bio: "",
    profilePic: ""
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  Swal.fire({
    title: "Successfully completed!",
    text: "Account Created ✅",
    icon: "success"
  });

  setTimeout(() => {
    window.location.href = "./login.html";
  }, 1200);

});