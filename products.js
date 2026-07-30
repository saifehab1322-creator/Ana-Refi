const modal = document.getElementById("productModal");

function openModal() {

  if (modal) {

    modal.classList.add("show");
    document.body.style.overflow = "hidden";

  }
}

function closeModal() {
  if (modal) {
    modal.classList.remove("show");
    document.body.style.overflow = "";
  }

  // التحديث الجديد: تصفير مؤشر التعديل وإعادة حقول الإدخال ونصوص الأزرار
  editId = null;
  clearInputs();
  const publishBtn = document.querySelector(".publish-btn");
  if (publishBtn) {
    publishBtn.innerText = "Publish Product";
  }
}


function handleOverlayClick(e) {

  if (e.target.id === "productModal") {
    closeModal();
  }
}

let products = JSON.parse(localStorage.getItem("products")) || [];
let editId = null; // بقينا نستخدم id ثابت بدل index عشان مايتلخبطش لو الترتيب اتغير

function loadProducts() {

  let data = localStorage.getItem("products");

  if (data) {
    products = JSON.parse(data);
  }

  if (document.getElementById("PRODUCTS")) {
    displayProducts();
  }

  if (document.getElementById("productBody")) {
    renderAdminTable();
  }
}

loadProducts();

// ===============================
// حساب متوسط تقييم حقيقي للمنتج من الريفيوهات المرتبطة بـ id ثابت
// ===============================
function getProductRating(productId) {
  const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  const productReviews = reviews.filter(r => r.productId === productId);

  if (productReviews.length === 0) {
    return { avg: null, count: 0 };
  }

  const sum = productReviews.reduce((acc, r) => acc + Number(r.rating || 0), 0);
  const avg = sum / productReviews.length;

  return { avg: avg.toFixed(1), count: productReviews.length };
}

function addProduct() {
  let name = document.getElementById("name").value.trim();
  let desc = document.getElementById("desc").value.trim();
  let price = document.getElementById("price").value.trim();
  let location = document.getElementById("location").value.trim();
  let pCategory = document.getElementById("pCategory").value;
  let fileInput = document.getElementById("image");
  let files = fileInput.files;

  // إصلاح شرط التحقق: إذا كان تعديل (editId ليس null)، لا نشترط وجود ملفات جديدة
  if (name === "" || desc === "" || price === "" || location === "" || (editId === null && files.length === 0)) {
    Swal.fire({
      icon: "warning",
      title: "Missing Data",
      text: "Please fill all fields and select at least one image"
    });
    return;
  }

  let loadedImages = [];
  let filesArray = Array.from(files);

  if (filesArray.length > 0) {
    let readCount = 0;
    filesArray.forEach((file) => {
      let reader = new FileReader();
      reader.onload = function (e) {
        loadedImages.push(e.target.result);
        readCount++;
        if (readCount === filesArray.length) {
          saveProductData(name, desc, price, location, pCategory, loadedImages);
        }
      };
      reader.readAsDataURL(file);
    });
  } else {
    // في حالة التعديل وعدم رفع صور جديدة، نحتفظ بالصور القديمة للمنتج
    let oldImages = [];
    if (editId !== null) {
      let existing = products.find(p => p.id === editId);
      if (existing) {
        oldImages = existing.images || (existing.image ? [existing.image] : []);
      }
    }
    saveProductData(name, desc, price, location, pCategory, oldImages);
  }
}

function saveProductData(name, desc, price, location, pCategory, imagesArr) {

  let currentUser = JSON.parse(localStorage.getItem("user"));

  if (editId !== null) {
    // تعديل منتج موجود: نحافظ على نفس الـ id والـ hostId الأصليين
    let index = products.findIndex(p => p.id === editId);
    if (index !== -1) {
      products[index] = {
        ...products[index],
        name, desc, price, location, pCategory,
        images: imagesArr,
        image: imagesArr[0] || ""
      };
    }
    editId = null;
  } else {
    // منتج جديد: id ثابت + ربطه بالهوست الحالي (صاحب الحساب المسجل دخوله)
    let product = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      hostId: currentUser ? currentUser.id : null,
      name, desc, price, location, pCategory,
      images: imagesArr,
      image: imagesArr[0] || "",
      status: "active"
    };
    products.push(product);
  }

  // حفظ في LocalStorage
  localStorage.setItem("products", JSON.stringify(products));

  // تحديث واجهات العرض المتوفرة في الصفحة الحالية
  if (typeof displayProducts === "function") displayProducts();
  if (typeof renderAdminTable === "function") renderAdminTable();

  clearInputs();
  closeModal();

  // إعادة نص الزر لوضعه الطبيعي
  const publishBtn = document.querySelector(".publish-btn");
  if (publishBtn) {
    publishBtn.innerText = "Publish Product";
  }

  Swal.fire({
    icon: "success",
    title: "Success",
    text: "Product Saved Successfully"
  });
}

function displayProducts(arr = products) {
  let container = document.getElementById("PRODUCTS");
  if (!container) return;

  if (arr.length === 0) {
    container.innerHTML = `
      <div class="text-center mt-5">
        <h3>No products found</h3>
      </div>
    `;
    return;
  }

  let cartona = "";
  for (let i = 0; i < arr.length; i++) {
    // جلب أول صورة كغلاف
    let displayImg = arr[i].images && arr[i].images.length > 0 ? arr[i].images[0] : arr[i].image;

    // تقييم حقيقي بدل الرقم الثابت 4.5
    let ratingInfo = getProductRating(arr[i].id);
    let ratingDisplay = ratingInfo.avg
      ? `<i class="fas fa-star"></i> ${ratingInfo.avg} (${ratingInfo.count})`
      : `<i class="fas fa-star"></i> New`;

    cartona += `
      <div class="vv col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-4">
        <div class="card custom-card">
          <img src="${displayImg}">
          <div class="card-body">
            <h5>${arr[i].name}</h5>
            <p>${arr[i].desc}</p>
            <div>
              <small class="rating">${ratingDisplay}</small>
              <small class="mx-2 rating">${arr[i].location}</small>
              <small class="rating">${arr[i].pCategory}</small>
            </div>
            <hr />
            <p class="price">EGP ${arr[i].price}<span class="person">/person</span></p>
            <button onclick="goToBooking(${arr[i].id})" class="btn btn-success w-100"><b>Show Details</b></button>
          </div>
        </div>
      </div>
    `;
  }
  container.innerHTML = cartona;
}

function goToBooking(id) {
  let product = products.find(p => p.id === id);
  if (!product) return;

  localStorage.setItem("selectedProduct", JSON.stringify(product));
  window.location.href = "./booking.html";
}

function clearInputs() {

  const ids = ["name", "desc", "price", "location", "image"];

  ids.forEach(id => {

    const el = document.getElementById(id);

    if (el) el.value = "";
  });
}
