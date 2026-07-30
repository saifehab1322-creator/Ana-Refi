window.addEventListener("load", function() {
    const splash = document.getElementById("splash");
    
    setTimeout(() => {
        splash.style.opacity = "0";
        splash.style.transition = "0.5s ease";
        
        setTimeout(() => {
            splash.style.display = "none";
        }, 500);
        
    }, 1500); // مدة التحميل (1.5 ثانية)
});
document.getElementById("contactForm")?.addEventListener("submit", function(e) {
    
    e.preventDefault();
    
    let fullname = document.getElementById("fullname_contact").value.trim();
    let email = document.getElementById("email_contact").value.trim();
    let subject = document.getElementById("subject_contact").value.trim();
    let message = document.getElementById("message_contact").value.trim();
    
    if (fullname === "" || email === "" || subject === "" || message === "") {
        
        Swal.fire({
            title: "The operation was not completed",
            text: "You need to fill in the blanks",
            icon: "warning"
        });
        
        return;
    }
    
    Swal.fire({
        title: "Successfully completed!",
        text: "The operation was successful",
        icon: "success"
    });
    
    document.getElementById("contactForm").reset();
    
});



const counters = document.querySelectorAll(".counter");

const animateCounter = (counter) => {
  const target = +counter.dataset.target;
  let current = 0;

  const step = target / 120;

  const update = () => {
    current += step;

    if (target >= 1000) {
      counter.innerText = Math.floor(current / 1000) + "K+";
    } 
    else if (target < 10) {
      counter.innerText = current.toFixed(1);
    } 
    else {
      counter.innerText = Math.floor(current) + "+";
    }

    if (current < target) {
      requestAnimationFrame(update);
    } else {
      if (target >= 1000) {
        counter.innerText = (target / 1000) + "K+";
      } 
      else if (target < 10) {
        counter.innerText = target;
      } 
      else {
        counter.innerText = target + "+";
      }
    }
  };

  update();
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      counters.forEach(counter => animateCounter(counter));
      observer.disconnect();
    }
  });
}, { threshold: 0.4 });

observer.observe(document.querySelector(".stats-section"));

const menuToggle = document.getElementById("menuToggle");
  const navContainer = document.getElementById("navContainer");

  menuToggle.addEventListener("click", () => {
    navContainer.classList.toggle("active");
    menuToggle.classList.toggle("active");
  });
  
  