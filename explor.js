function filterProducts() {
  
  let location = document.getElementById("locationFilter").value;
  let type = document.getElementById("typeFilter").value;
  let price = document.getElementById("priceFilter").value;
  
  let filtered = products.filter(item => {
    
    let matchLocation =
      location === "All" ||
      item.location.toLowerCase() === location.toLowerCase();
    
    let matchType =
      type === "All" ||
      item.pCategory.toLowerCase() === type.toLowerCase();
    
    let matchPrice = true;
    
    if (price === "0 - 200") {
      matchPrice = Number(item.price) <= 200;
    }
    else if (price === "200 - 400") {
      matchPrice = Number(item.price) > 200 && Number(item.price) <= 400;
    }
    else if (price === "400+") {
      matchPrice = Number(item.price) > 400;
    }
    
    return matchLocation && matchType && matchPrice;
  });
  
  displayProducts(filtered);
}

document.getElementById("locationFilter")?.addEventListener("change", filterProducts);
document.getElementById("typeFilter")?.addEventListener("change", filterProducts);
document.getElementById("priceFilter")?.addEventListener("change", filterProducts);

document.querySelector(".reset")?.addEventListener("click", () => {
  
  document.getElementById("locationFilter").value = "All";
  document.getElementById("typeFilter").value = "All";
  document.getElementById("priceFilter").value = "All";
  
  displayProducts(products);
});

let scrollBtn = document.getElementById("scrollTopBtn");

if (scrollBtn) {
  
  window.onscroll = function() {
    
    if (document.documentElement.scrollTop > 200) {
      scrollBtn.style.display = "block";
    }
    else {
      scrollBtn.style.display = "none";
    }
  };
  
  scrollBtn.onclick = function() {
    
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
}
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  menuToggle.classList.toggle("active");
});

/* =========================
   PAGE LOADER
========================= */

window.addEventListener("load", () => {

  setTimeout(() => {

    document.getElementById("pageLoader")
      ?.classList.add("hide");

  }, 1800);

});