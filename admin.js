if (localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "./login.html";
}

let user = JSON.parse(localStorage.getItem("user"));

// ترحيل تلقائي: أي منتج قديم اتضاف قبل نظام hostId بيتربط بأول هوست يفتح الداشبورد
(function migrateLegacyProducts() {
  if (!user) return;
  let allProducts = JSON.parse(localStorage.getItem("products")) || [];
  let changed = false;
  allProducts.forEach(p => {
    if (!p.hostId) {
      p.hostId = user.id;
      changed = true;
    }
  });
  if (changed) {
    localStorage.setItem("products", JSON.stringify(allProducts));
  }
})();

if (user) {
  
  document.querySelector(".sidebar-name").innerText =
    user.firstName + " " + user.lastName;
  
  document.querySelector(".admin-avatar").innerText =
    user.firstName[0];
  
  document.querySelector(".sidebar-email").innerText =
    user.email;
}

// ===============================
// Dashboard Stats
// ===============================
// ===============================
// Dashboard Stats (حساب المدفوع والمقبول فقط)
// ===============================
function updateDashboardStats(hostProducts) {
  // جلب المنتجات بتاعة الهوست الحالي بس (وليس كل منتجات المنصة)
  let totalProducts = hostProducts ? hostProducts.length : ((typeof products !== "undefined") ? products.length : 0);
  
  // جلب الحجوزات والمستخدمين من الـ LocalStorage
  let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let revenue = 0;
  
  // حساب الإيرادات بناءً على الشروط (مقبول + مدفوع)
  bookings.forEach((b) => {
    if (b.status === "accepted" && b.paid === true) {
      // تنظيف نص السعر وتحويله لرقم (حذف $ أو /night)
      let price = parseFloat(
        b.price.toString().replace("$", "").replace("/night", "").replace(/[^\d.]/g, "")
      );
      
      // تحويل نص عدد الأفراد إلى رقم ذكي
      let people = 1;
      if (b.people) {
        let text = b.people.toString().toLowerCase().trim();
        if (!isNaN(text)) { people = parseInt(text); }
        else if (text.includes("one")) { people = 1; }
        else if (text.includes("two")) { people = 2; }
        else if (text.includes("three")) { people = 3; }
        else if (text.includes("four")) { people = 4; }
        else if (text.includes("five")) { people = 5; }
      }
      
      // إضافة الحسبة الإجمالية للحجز
      revenue += (price * people);
    }
  });
  
  // تحديث واجهة المستخدم (UI) مع التأكد من وجود العناصر في الـ HTML
  if (document.getElementById("totalProducts")) {
    document.getElementById("totalProducts").innerText = totalProducts;
  }
  if (document.getElementById("totalBookings")) {
    document.getElementById("totalBookings").innerText = bookings.length;
  }
  if (document.getElementById("totalUsers")) {
    document.getElementById("totalUsers").innerText = users.length;
  }
  if (document.getElementById("totalRevenue")) {
    document.getElementById("totalRevenue").innerText = "$" + revenue.toFixed(2);
  }
}

// ===============================
// Render Products Table
// ===============================
function renderAdminTable() {
  
  const tableBody = document.getElementById("productBody");
  
  if (!tableBody) return;
  
  tableBody.innerHTML = "";

  // كل هوست يشوف بس منتجاته هو (المنتجات القديمة اللي مالهاش hostId بتفضل ظاهرة لحد ما تتعدل)
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const hostProducts = products.filter(p =>
    !p.hostId || (currentUser && p.hostId === currentUser.id)
  );

  if (hostProducts.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" class="text-center">No products yet — add your first one!</td></tr>`;
    updateDashboardStats(hostProducts);
    return;
  }
  
  hostProducts.forEach((p) => {
    
    tableBody.innerHTML += `

      <tr>

        <td>
          <strong>${p.name}</strong><br>
          <small style="color:#f44336">📍 ${p.location}</small>
        </td>

        <td>${p.pCategory || "General"}</td>

        <td>${p.price}</td>

        <td>
          <span class="status ${p.status || "active"}">
            ${p.status || "active"}
          </span>
        </td>

        <td>
          <button class="btn-edit" onclick="editProduct(${p.id})">
            Edit
          </button>

          <button class="btn-delete" onclick="deleteProduct(${p.id})">
            Delete
          </button>
        </td>

      </tr>
    `;
  });
  
  updateDashboardStats(hostProducts);
}

// ===============================
// Edit Product
// ===============================
function editProduct(id) {
  editId = id; // تعيين الـ id الثابت الحالي للتعديل (بدل الأندكس المتغير)

  let product = products.find(p => p.id === id);
  if (!product) return;

  openModal();
  
  // ملء الحقول بالبيانات الحالية
  document.getElementById("name").value = product.name;
  document.getElementById("desc").value = product.desc;
  document.getElementById("price").value = product.price;
  document.getElementById("location").value = product.location;
  document.getElementById("pCategory").value = product.pCategory;
  
  // تغيير نص زر الإرسال ليشير إلى التعديل
  const publishBtn = document.querySelector(".publish-btn");
  if (publishBtn) {
    publishBtn.innerText = "Update Product";
  }
}

// ===============================
// Delete Product
// ===============================
function deleteProduct(id) {
  
  Swal.fire({
    
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
    
  }).then((result) => {
    
    if (result.isConfirmed) {
      
      let index = products.findIndex(p => p.id === id);
      if (index === -1) return;
      products.splice(index, 1);
      
      localStorage.setItem("products", JSON.stringify(products));
      
      renderAdminTable();
      
      displayProducts();
      
      updateDashboardStats();
      
      Swal.fire(
        'Deleted!',
        'Product has been deleted.',
        'success'
      );
    }
  });
}

// ===============================
// Render Bookings
// ===============================
function renderBookings() {
  
  let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  
  let table = document.getElementById("bookingBody");
  
  if (!table) return;
  
  table.innerHTML = "";
  
  bookings.forEach((b, index) => {
    
    if (b.status === "cancelled") return;
    
    table.innerHTML += `

      <tr>

      <td>${b.productName || b.name}</td>
        <td>${b.location}</td>
        <td>${b.price}</td>
        <td>${b.status}</td>

        <td>
          <button onclick="acceptBooking(${index})" class="btn-edit acpe">
            Accept
          </button>

          <button onclick="cancelBooking(${index})" class="btn-delete">
            Cancel
          </button>
        </td>

      </tr>
    `;
  });
  
  updateDashboardStats();
}

// ===============================
// Accept Booking
// ===============================
function acceptBooking(index) {
  
  let bookings = JSON.parse(localStorage.getItem("bookings"));
  
  bookings[index].status = "accepted";
  
  localStorage.setItem("bookings", JSON.stringify(bookings));
  
  renderBookings();
  
  updateDashboardStats();
}

// ===============================
// Cancel Booking
// ===============================
function cancelBooking(index) {
  
  let bookings = JSON.parse(localStorage.getItem("bookings"));
  
  bookings[index].status = "cancelled";
  
  localStorage.setItem("bookings", JSON.stringify(bookings));
  
  renderBookings();
  
  updateDashboardStats();
}
// ===============================
// BOOKING CALENDAR SYSTEM
// ===============================

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function renderCalendar() {
  
  const calendar = document.getElementById("calendarDays");
  
  if (!calendar) return;
  
  calendar.innerHTML = "";
  
  let bookings =
    JSON.parse(localStorage.getItem("bookings")) || [];
  
  // عدد أيام الشهر
  let totalDays =
    new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // أول يوم في الشهر
  let firstDay =
    new Date(currentYear, currentMonth, 1).getDay();
  
  // عنوان الشهر
  document.getElementById("calendarMonth").innerText =
    `${getMonthName(currentMonth)} ${currentYear}`;
  
  // فراغات قبل بداية الشهر
  for (let i = 0; i < firstDay; i++) {
    
    calendar.innerHTML += `
      <div class="empty-day"></div>
    `;
  }
  
  // الأيام
  for (let day = 1; day <= totalDays; day++) {
    
    let fullDate =
      `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    let dayBookings =
      bookings.filter(b => b.bookingDate === fullDate);
    
    let today = new Date();
    
    let isToday =
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear;
    
    calendar.innerHTML += `

      <div
        class="day-card ${isToday ? "today" : ""}"
        onclick="showDayBookings('${fullDate}',this)">

        <div class="day-number">
          ${day}
        </div>

        ${
          dayBookings.length > 0
          ?
          `
          <div class="booking-count">
            ${dayBookings.length} Booking
          </div>
          `
          :
          `
          <div class="booking-empty">
            Empty
          </div>
          `
        }

      </div>
    `;
  }
}

// ===============================
// SHOW BOOKINGS
// ===============================

function showDayBookings(date, element) {

  document.querySelectorAll(".day-card")
    .forEach(card => {
      card.classList.remove("active");
    });

  element.classList.add("active");

  let bookings =
    JSON.parse(localStorage.getItem("bookings")) || [];

  let filtered =
    bookings.filter(b => b.bookingDate === date);

  document.getElementById("selectedDateTitle")
    .innerText = `📅 Bookings of ${date}`;

  let container =
    document.getElementById("dayBookingsContainer");

  container.innerHTML = "";

  // OPEN MODAL
  document
    .getElementById("bookingModal")
    .classList.add("show");

  // EMPTY
  if(filtered.length === 0){

    container.innerHTML = `

      <div class="empty-bookings">

        No bookings found in this day 📭

      </div>
    `;

    return;
  }

  // BOOKINGS
  filtered.forEach(b => {

    let statusColor = "";

    if(b.status === "accepted"){
      statusColor = "#24ae7c";
    }
    else if(b.status === "cancelled"){
      statusColor = "#f44336";
    }
    else{
      statusColor = "#ff9800";
    }

    container.innerHTML += `

      <div class="booking-card">

        <div class="booking-top">

          <div>

            <div class="booking-name">
              ${b.customerName}
            </div>

            <div class="booking-email">
              ${b.userEmail}
            </div>

          </div>

          <div
            style="
              background:${statusColor};
              color:white;
              padding:8px 14px;
              border-radius:20px;
              font-size:13px;
              font-weight:bold;
            ">

            ${b.status}

          </div>

        </div>

        <div class="booking-info">

          <div>
            <span>Product</span>
            ${b.productName}
          </div>

          <div>
            <span>Location</span>
            ${b.location}
          </div>

          <div>
            <span>People</span>
            ${b.people}
          </div>

          <div>
            <span>Price</span>
            EGP ${b.price}
          </div>

          <div>
            <span>Date</span>
            ${b.bookingDate}
          </div>

        </div>

      </div>
    `;
  });
}

// ===============================
// MONTH CONTROL
// ===============================

function nextMonth() {
  
  currentMonth++;
  
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  
  renderCalendar();
}

function prevMonth() {
  
  currentMonth--;
  
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  
  renderCalendar();
}

// ===============================
// MONTH NAME
// ===============================

function getMonthName(month) {
  
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  
  return months[month];
}
function closeBookingModal(){

  document
    .getElementById("bookingModal")
    .classList.remove("show");
}
// START
renderCalendar();
// ===============================
// Start
// ===============================
renderBookings();
renderAdminTable();
updateDashboardStats();

// ===============================
// 🤖 CHAT BOT (IMPROVED FULL VERSION)
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  
  const chatBox = document.querySelector(".chatbot-box");
  const chatBtn = document.getElementById("chatBtn");
  const input = document.getElementById("chatInput");
  const messages = document.getElementById("chatMessages");
  
  const resultModal = document.getElementById("chatResultModal");
  
  let isOpen = false;
  
  // ===============================
  // OPEN / CLOSE CHAT
  // ===============================
  chatBtn.addEventListener("click", () => {
    isOpen = !isOpen;
    chatBox.classList.toggle("show", isOpen);
  });
  
  window.closeChat = function() {
    isOpen = false;
    chatBox.classList.remove("show");
  };
  
  // ===============================
  // SEND MESSAGE
  // ===============================
  window.sendChat = function() {
    
    const value = input.value.trim();
    if (!value) return;
    
    addUserMessage(value);
    input.value = "";
    
    showTyping();
    
    setTimeout(() => {
      hideTyping();
      searchData(value);
    }, 700);
    
    messages.scrollTop = messages.scrollHeight;
  };
  
  // ===============================
  // UI MESSAGES
  // ===============================
  function addUserMessage(text) {
    messages.innerHTML += `<div class="user-msg">${text}</div>`;
  }
  
  function addBotMessage(text) {
    messages.innerHTML += `<div class="bot-msg">${text}</div>`;
  }
  
  function showTyping() {
    messages.innerHTML += `
      <div class="bot-msg" id="typing">🤖 typing...</div>
    `;
  }
  
  function hideTyping() {
    const t = document.getElementById("typing");
    if (t) t.remove();
  }
  
  // ===============================
  // MAIN SEARCH ENGINE
  // ===============================
  function parsePeople(value) {
  
  if (!value) return 1;
  
  // لو رقم مباشر
  if (!isNaN(value)) return parseInt(value);
  
  const text = value.toLowerCase();
  
  if (text.includes("one")) return 1;
  if (text.includes("two")) return 2;
  if (text.includes("three")) return 3;
  if (text.includes("four")) return 4;
  if (text.includes("five")) return 5;
  
  return 1;
}
  
  
  
  function searchData(keyword) {
    
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const products = JSON.parse(localStorage.getItem("products")) || [];
    
    const key = (keyword || "").toLowerCase().trim();
    
    const resultBody = document.getElementById("chatResultBody");
    resultBody.innerHTML = "";
    
    let found = false;
    
    // ===============================
    // 👤 USERS SEARCH
    // ===============================
    const foundUsers = users.filter(u =>
      `${u.firstName || ""} ${u.lastName || ""} ${u.email || ""}`
      .toLowerCase()
      .includes(key)
    );
    
    if (foundUsers.length > 0) {
      found = true;
      
      foundUsers.forEach(user => {
        
        const userBookings = bookings.filter(b =>
          (b.userEmail || "").toLowerCase() === (user.email || "").toLowerCase()
        );
        
        const totalSpent = userBookings.reduce((sum, b) => {
          const price = parseFloat((b.price || "0").toString().replace(/[^\d.]/g, ""));
          const people = parseInt(b.people) || 1;
          return sum + (price * people);
        }, 0);
        
        const totalPeople = userBookings.reduce((sum, b) => {
  return sum + parsePeople(b.people);
}, 0);
        
        resultBody.innerHTML += `
          <div class="result-card">

            <div class="result-title">👤 Customer Profile</div>

            <p><b>Name:</b> ${user.firstName} ${user.lastName}</p>
            <p><b>Email:</b> ${user.email}</p>

            <p><b>Bookings:</b> ${userBookings.length}</p>
            <p><b>Total Spent:</b> $${totalSpent.toFixed(2)}</p>
            <p><b>Total People:</b> ${totalPeople}</p>

          </div>
        `;
        
        // bookings details
        if (userBookings.length > 0) {
          resultBody.innerHTML += `
            <div class="result-card">
              <div class="result-title">📅 Booking History</div>
          `;
          
          userBookings.forEach(b => {
            
            const price = parseFloat((b.price || "0").toString().replace(/[^\d.]/g, ""));
            const people = parseInt(b.people) || 1;
            
            resultBody.innerHTML += `
              <div class="booking-row">

                <p><b>Product:</b> ${b.productName || "-"}</p>
                <p><b>Date:</b> ${b.bookingDate || "-"}</p>
                <p><b>People:</b> ${people}</p>
                <p><b>Total:</b> $${(price * people).toFixed(2)}</p>

              </div>
            `;
          });
          
          resultBody.innerHTML += `</div>`;
        }
      });
    }
    
    // ===============================
    // 🌿 PRODUCTS SEARCH (FULL FIXED)
    // ===============================
    const foundProducts = products.filter(p =>
      (p.name || "").toLowerCase().includes(key)
    );
    
    if (foundProducts.length > 0) {
      found = true;
      
      foundProducts.forEach(product => {
        
        const productBookings = bookings.filter(b =>
          (b.productName || "").toLowerCase().includes((product.name || "").toLowerCase())
        );
        
        let revenue = 0;
        
        productBookings.forEach(b => {
          const price = parseFloat((b.price || "0").toString().replace(/[^\d.]/g, ""));
          const people = parsePeople(b.people);
          revenue += price * people;
        });
        
        const uniqueUsers = new Set(productBookings.map(b => b.userEmail));
        
        resultBody.innerHTML += `
          <div class="result-card">

            <div class="result-title">🌿 Product Details</div>

            <p><b>Name:</b> ${product.name}</p>
            <p><b>Location:</b> ${product.location || "-"}</p>
            <p><b>Category:</b> ${product.pCategory || "-"}</p>
            <p><b>Price:</b> ${product.price}</p>

            <p><b>Bookings:</b> ${productBookings.length}</p>
            <p><b>Revenue:</b> $${revenue.toFixed(2)}</p>
            <p><b>Customers:</b> ${uniqueUsers.size}</p>

          </div>
        `;
        
        // bookings
        if (productBookings.length > 0) {
          
          resultBody.innerHTML += `
            <div class="result-card">
              <div class="result-title">👥 Customers</div>
          `;
          
          productBookings.forEach(b => {
            
            const price = parseFloat((b.price || "0").toString().replace(/[^\d.]/g, ""));
const people = parsePeople(b.people);
            resultBody.innerHTML += `
              <div class="booking-row">

                <p><b>Name:</b> ${b.customerName || "-"}</p>
                <p><b>Email:</b> ${b.userEmail || "-"}</p>
                <p><b>People:</b> ${people}</p>
                <p><b>Total:</b> $${(price * people).toFixed(2)}</p>

              </div>
            `;
          });
          
          resultBody.innerHTML += `</div>`;
        }
      });
    }
    
    // ===============================
    // 📊 DASHBOARD COMMAND
    // ===============================
    if (["stats", "dashboard", "all"].includes(key)) {
      
      found = true;
      
      const revenue = bookings
        .filter(b => b.status === "accepted")
        .reduce((sum, b) => {
          const price = parseFloat((b.price || "0").toString().replace(/[^\d.]/g, ""));
          const people = parseInt(b.people) || 1;
          return sum + (price * people);
        }, 0);
      
      resultBody.innerHTML += `
        <div class="result-card">

          <div class="result-title">📊 System Overview</div>

          <p><b>Users:</b> ${users.length}</p>
          <p><b>Products:</b> ${products.length}</p>
          <p><b>Bookings:</b> ${bookings.length}</p>
          <p><b>Revenue:</b> $${revenue.toFixed(2)}</p>

        </div>
      `;
    }
    
    // ===============================
    // NO RESULT
    // ===============================
    if (!found) {
      resultBody.innerHTML = `
        <div class="result-card">

          <div class="result-title">🤖 Assistant</div>

          <p>❌ No results found</p>

          <p><b>Try:</b> user name, product name, stats</p>

        </div>
      `;
    }
    
    resultModal.classList.add("show");
    
    addBotMessage("Analysis completed ✅");
    messages.scrollTop = messages.scrollHeight;
  }
  
  // ===============================
  // CLOSE MODAL
  // ===============================
  window.closeChatModal = function() {
    resultModal.classList.remove("show");
  };
  
});

const chatBox = document.querySelector(".chatbot-box");

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

chatBox.addEventListener("mousedown", (e) => {
  isDragging = true;

  offsetX = e.clientX - chatBox.getBoundingClientRect().left;
  offsetY = e.clientY - chatBox.getBoundingClientRect().top;

  chatBox.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  chatBox.style.left = (e.clientX - offsetX) + "px";
  chatBox.style.top = (e.clientY - offsetY) + "px";

  chatBox.style.right = "auto";
  chatBox.style.bottom = "auto";
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  chatBox.style.cursor = "grab";
});

chatBox.addEventListener("touchstart", (e) => {
  isDragging = true;

  const touch = e.touches[0];

  offsetX = touch.clientX - chatBox.getBoundingClientRect().left;
  offsetY = touch.clientY - chatBox.getBoundingClientRect().top;
});

document.addEventListener("touchmove", (e) => {
  if (!isDragging) return;

  const touch = e.touches[0];

  chatBox.style.left = (touch.clientX - offsetX) + "px";
  chatBox.style.top = (touch.clientY - offsetY) + "px";

  chatBox.style.right = "auto";
  chatBox.style.bottom = "auto";
});

document.addEventListener("touchend", () => {
  isDragging = false;
});
function toggleMenu() {
  document.querySelector(".nav-links").classList.toggle("show");
}
/* =========================
   PAGE LOADER
========================= */

window.addEventListener("load", () => {

  const loader =
    document.getElementById("pageLoader");

  setTimeout(() => {

    loader.classList.add("hide");

  }, 1200);

});