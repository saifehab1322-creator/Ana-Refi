function saveProfile() {

  let user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  user.firstName = document.getElementById("firstNameInput").value.trim();
  user.lastName  = document.getElementById("lastNameInput").value.trim();
  user.bio       = document.getElementById("bioInput").value.trim();

  if (base64Image) {
    user.profilePic = base64Image;
  }

  localStorage.setItem("user", JSON.stringify(user));

  // مزامنة التعديل مع مصفوفة كل الحسابات "users"
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let idx = users.findIndex(u => u.email === user.email);
  if (idx !== -1) {
    users[idx] = user;
    localStorage.setItem("users", JSON.stringify(users));
  }

  refreshUI();
  closeProfileModal();

  Swal.fire({
    title: "Successfully completed!",
    text: "your updated profile",
    icon: "success",
    timer: 1200,
    showConfirmButton: true
  });
}