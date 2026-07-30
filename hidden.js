document.addEventListener("DOMContentLoaded", () => {

  let user = JSON.parse(localStorage.getItem("user"));

  let userLink = document.getElementById("userLink");
  let hostLink = document.getElementById("hostLink");

  if(user){

    if(user.type === "user"){

      if(userLink) userLink.classList.remove("hidden");
      if(hostLink) hostLink.classList.add("hidden");

    }
    else if(user.type === "host"){

      if(hostLink) hostLink.classList.remove("hidden");
      if(userLink) userLink.classList.add("hidden");

    }

  } else {

    if(userLink) userLink.classList.add("hidden");
    if(hostLink) hostLink.classList.add("hidden");

  }

});

// DARK MODE
let btn = document.getElementById("themeToggle");

if(localStorage.getItem("theme") === "dark"){
  document.body.classList.add("dark");
}

if(btn){

  btn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
      localStorage.setItem("theme", "dark");
    }
    else{
      localStorage.setItem("theme", "light");
    }

  });
}