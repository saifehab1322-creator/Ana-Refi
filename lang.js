// اللغة الحالية
let lang = localStorage.getItem("lang") || "en";

// القاموس (زود عليه براحتك)
const dict = {

  // NAVBAR
  "HOME": "الرئيسية",
  "EXPLORE": "استكشاف",
  "DISCOVER EGYPT": "اكتشف مصر",
  "Host Dashboard": "لوحة المضيف",
  "HOST DASHBOARD": "لوحة المضيف",
  "User Dashboard": "لوحة المستخدم",
  "USER DASHBOARD": "لوحة المستخدم",
  "Host":"المضيف",
  "Log In": "تسجيل الدخول",
  "Login": "تسجيل الدخول",
  "Sign Up": "إنشاء حساب",
  "Create Account": "إنشاء حساب",
  "Log Out": "تسجيل خروج",
  "logout": "تسجيل خروج",
  "Add New":"اضفت  جديد ",
  "Product":"منتج",
  
  
  
    // HERO + FEATURES
  "Born-and-raised local guides who know every trail, story, and hidden gem in the region.":
  "مرشدون محليون نشأوا في المنطقة ويعرفون كل طريق وقصة وكل مكان مخفي",

  "Handpicked farmhouses and lodges — real homes owned by real locals, not hotel chains.":
  "منازل ريفية ونُزل مختارة بعناية — بيوت حقيقية يملكها السكان المحليون وليست فنادق",

  "Every trip is designed with sustainability at its core, protecting the nature you came to love.":
  "كل رحلة مصممة بالاستدامة في جوهرها، للحفاظ على الطبيعة التي أحببتها",

  "Join thousands of travelers who found peace, purpose, and joy off the beaten path.":
  "انضم إلى آلاف المسافرين الذين وجدوا السلام والهدف والسعادة بعيدًا عن الطرق التقليدية",

  "Ready for Your Rural Adventure?":
  "هل أنت مستعد لمغامرتك الريفية؟",

  "✦ WHY VERDANT TRAILS":
  "✦ لماذا ANA REFI",

  // CONTACT
  "Al-Balina Center, west of the Traffic Department.":
  "مركز البلينا، غرب إدارة المرور",

  // ADMIN DASHBOARD
  "Manage all products, bookings, and users.":
  "إدارة جميع المنتجات والحجوزات والمستخدمين.",

  "+ Add Product":
  "+ إضافة منتج",

  "All Products":
  "جميع المنتجات",

  "⚙ Admin":
  "⚙ المسؤول",

  "📊 Dashboard":
  " 📊 لوحة التحكم",

  "🌿 Products":
  " 🌿 المنتجات ",

  "📅 Booking":
  "الحجوزات",

  "👥 Users":
  "👥 المستخدمين",

  "📈 Analytics":
  "📈 التحليلات",

  "Add New Product":
  "إضافة منتج جديد",
  "🌿 All Products":"🌿 كل المنتجات",

  "Product Name":
  "اسم المنتج",
"Start Exploring":"ابدا الاستكشاف ",
  "e.g. Lavender Hills Farm Stay":
  "مثال: إقامة ريفية في تلال لافندر",
"Welcome":"مرحباً ",
"Back":"بعودتك",
  "Category":
  "التصنيف",
"Create":"انشاء ",
"Account":"حساب",

"PRODUCT":"المنتج",
"CATEGORY":"تصنيف ",
"PRICE":"سعر",
"STATUS":"الحاله",
"ACTIONS":"الاجراء"
  ,"Farm Stay":
  "إقامة ريفية",
  "LOCATION":"الموقع",

  "Price / Night ($)":
  "السعر / الليلة ($)",

  "Tuscany, Italy":
  "توسكانا، إيطاليا",

  "Description":
  "الوصف",

  "Describe the experience...":
  "اكتب وصف التجربة...",

  "image":
  "الصورة",

  "No file chosen":
  "لم يتم اختيار ملف",

  // HERO
  "DISCOVER AUTHENTIC RURAL LIFE": "اكتشف الحياة الريفية الأصيلة",
  "Escape to the": "اهرب إلى",
  "Heart of Nature": "قلب الطبيعة",
  "Watch Film": "شاهد الفيديو",
  "Explore Destinations": "استكشف الوجهات",

  // TEXT
  "Immerse yourself in breathtaking landscapes, ancient traditions, and the serene beauty of the countryside — handcrafted journeys you'll never forget.":
  "استمتع بالطبيعة الخلابة والتقاليد القديمة وجمال الريف في رحلات لا تُنسى",

  // FEATURES
  "WHY VERDANT TRAILS": "لماذا ANA REFI",
  "Ready for Your Rural Adventure?": "هل أنت مستعد لمغامرتك الريفية؟",
  "Travel with Purpose &": "سافر بهدف و",
  "Care": "اهتمام",
  "Eco-Friendly": "صديق للبيئة",
  "Authentic Stays": "إقامات حقيقية",
  "Expert Guides": "مرشدون محترفون",

  // EXPLORE
  "Explore Rural Experiences": "استكشف التجارب الريفية",
  "Discover authentic rural experiences across Egypt": "اكتشف تجارب ريفية أصيلة في مصر",
  "Filter": "فلتر",
  "Location": "الموقع",
  "Activity Type": "نوع النشاط",
  "Price Range": "السعر",
  "All": "الكل",
  "Reset": "إعادة",

  // BOOKING
  "Book now": "احجز الآن",
  "Name": "الاسم",
  "Booking date": "تاريخ الحجز",
  "Number of people": "عدد الأشخاص",
  "Choose a number": "اختر العدد",
  "One person": "شخص واحد",
  "Two people": "شخصين",
  "Three people": "3 أشخاص",
  "Four people": "4 أشخاص",
  "Prev": "السابق",
  "Next": "التالي",
  "AR":"EN",

  // ALERT
  "Booking": "الحجز",
  "Booking Successful ✅": "تم الحجز بنجاح ✅",

  // CONTACT
  "Address": "العنوان",
"Working Hours": "ساعات العمل",
  "Follow Us": "تابعنا",
  "Full Name": "الاسم بالكامل",
  "Email Address": "البريد الإلكتروني",
  "Subject": "الموضوع",
  "Message Text": "نص الرسالة",
  "Send": "إرسال",

  // DASHBOARD
  "Dashboard": "لوحة التحكم",
  "Products": "المنتجات",
  "Bookings": "الحجوزات",
  "Users": "المستخدمين",
  "Analytics": "التحليلات",
  "Add Product": "إضافة منتج",
  "Total Products": "إجمالي المنتجات",
  "Revenue": "الأرباح",
  "Publish Product": "نشر المنتج",

  // USER DASH
  "Welcome back,": "مرحبًا بعودتك،",
  "Overview": "نظرة عامة",
  "My Bookings": "حجوزاتي",
  "Favourites": "المفضلة",
  "Profile": "الملف الشخصي",
  "Notifications": "الإشعارات",
  "Welcome Back": "مرحبًا بعودتك",
  "Login to your account": "سجل دخول إلى حسابك",
  "Don’t have an account?": "ليس لديك حساب؟",
  "Password": "كلمة المرور",

  "Create Account": "إنشاء حساب",
  "Choose your account type to get started.": "اختر نوع الحساب للبدء",

  "👤 Traveler": "👤 مسافر",
  "🏡 Host": "🏡 مضيف",

  "First Name": "الاسم الأول",
  "Last Name": "الاسم الأخير",
  "Min 8 characters": "8 أحرف على الأقل",
  "Already have an account?": "لديك حساب بالفعل؟",

  // FOOTER
  "ANA Refi": "ANA Refi",
  "Connecting tourists with authentic rural Egyptian experiences. Supporting local communities through sustainable tourism.":
  "ربط السياح بتجارب ريفية مصرية أصيلة ودعم المجتمعات المحلية من خلال السياحة المستدامة",

  "Quick Links": "روابط سريعة",
  "Support": "الدعم",
  "Contact Us": "اتصل بنا",

  "Explore Places": "استكشف الأماكن",
  "Become a Host": "كن مضيفًا",
  "About Us": "من نحن",
  "How It Works": "كيف يعمل",

  "Help Center": "مركز المساعدة",
  "Safety Guidelines": "إرشادات الأمان",
  "Terms of Service": "شروط الاستخدام",
  "Privacy Policy": "سياسة الخصوصية",

  "Cairo, Egypt": "القاهرة، مصر",
  "© 2026 ANA Refi. All rights reserved. Supporting SDG 8 & SDG 11 for sustainable communities.":
  "جميع الحقوق محفوظة. دعم أهداف التنمية المستدامة SDG 8 و SDG 11",
  "Show Details":"عرض التفاصيل ",

  // EXPERIENCES TEXT
  "Born-and-raised local guides who know every trail, story, and hidden gem in the region":
  "مرشدون محليون نشأوا في المنطقة ويعرفون كل طريق وقصة وكل مكان مخفي",

  "Handpicked farmhouses and lodges — real homes owned by real locals, not hotel chains":
  "منازل ريفية ونُزل مختارة بعناية — بيوت حقيقية يملكها السكان المحليون وليست فنادق",

  // EXPERIENCES CARDS
  "Village House": "منزل ريفي",
  "Traditional Village House - Fayoum": "منزل ريفي تقليدي - الفيوم",
  "Fayoum Oasis": "واحة الفيوم",
  "Authentic Egyptian village experience with local hosts.":
  "تجربة قرية مصرية أصيلة مع سكان محليين",

  "Artisan Workshop": "ورشة حرفية",
  "Artisan Workshop & Homestay": "ورشة حرفية وإقامة",
  "Siwa Oasis": "واحة سيوة",
  "Learn traditional pottery in the heart of Siwa.":
  "تعلم صناعة الفخار التقليدية في قلب سيوة",

  "Organic Farm": "مزرعة عضوية",
  "Organic Farm Experience": "تجربة مزرعة عضوية",
  "Nile Delta": "دلتا النيل",
  "Hands-on organic farming in the lush Nile Delta.":
  "تجربة زراعة عضوية عملية في دلتا النيل الخضراء",
  
  
  // من هنا ممكن تكون ترجمه حرفيا علشان مش معايا نت اترجم 
  "📍 Nile Delta":"📍وادى النيل ",
  "📍 Siwa Oasis":"📍واحت سيوه",
  "📍 Fayoum Oasis":" 📍الفيوم",
  "📅 Bookings":"📅 الحجوزات",
  "Accept":"قبول",
  "Cancel":"رفض",
  "Edit":"تعديل ",
  "Delete":"حذف",
  "Booking Now":"احجز الان",
  "Total Trips":"مجموع الرحلات ", 
  "Saved Places":"الأماكن المحفوظة ", 
  "Countries":"المحافظات",
  "Member Status":"حاله العضو",
  "Gold":"ذهبى",
  "⭐ Saved Places":"⭐ الأماكن المحفوظة",
  "Here's what's happening with your account.":"هنا تراه ماذا يحدث مع حسابك ",
  "🗺️ My Bookings":" 🗺️حجزاتى",
  "8:00 AM - 11:00 PM (Weekdays)":"8:00 صباحًا - 11:00 مساءً (أيام الأسبوع)"
  ,"11:00 AM - 1:00 AM (Weekend)":"11:00 صباحًا - 1:00 صباحًا (عطلة نهاية الأسبوع)"
,"📍 Cairo, Egypt":"📍 القاهرة، مصر"
  , "Discover The Beauty Of Rural Egypt": "اكتشف جمال الريف المصري",
  "ANA REFI is a modern rural tourism platform that connects travelers with authentic Egyptian village experiences. Explore hidden gems, local traditions, cultural activities, and unforgettable journeys through a smooth and modern digital experience.": "ANA REFI هي منصة حديثة للسياحة الريفية تربط المسافرين بتجارب القرى المصرية الأصيلة. اكتشف الأماكن المخفية، والتقاليد المحلية، والأنشطة الثقافية، والرحلات التي لا تُنسى من خلال تجربة رقمية سهلة وعصرية.",
  "Authentic Places": "أماكن أصيلة",
  "Easy Booking": "حجز سهل",
  "Local Experiences": "تجارب محلية",
    "Hello Admin 👋": "👋مرحبًا بالمشرف",
  "Send the product name to search": "أرسل اسم المنتج للبحث",
  "Smart Admin Assistant": "مساعد الإدارة الذكي",
  "Send": "إرسال",
  "🔍 Search Result": "🔍 نتيجة البحث",
  "profile": "الملف الشخصي",
  "PROFILE": "الملف الشخصي",
  "Happy Travelers": "المسافرون السعداء",
"Rural Destinations": "الوجهات الريفية",
"Bookings Completed": "الحجوزات المكتملة",
"Average Rating": "متوسط التقييم"
  
};


// 🔥 ترجمة كل النصوص (حتى داخل span)
function translatePage() {
  if (lang === "en") return;

  function walk(node) {

    // لو نص
    if (node.nodeType === 3) {
      let text = node.nodeValue.trim();

      if (dict[text]) {
        node.nodeValue = " " + dict[text] + " ";
      }
    }

    // يدخل جوه كل العناصر
    node.childNodes.forEach(child => walk(child));
  }

  walk(document.body);

  // اتجاه عربي
  document.documentElement.dir = "rtl";
}


// تشغيل
translatePage();


// زرار التبديل
document.getElementById("langToggle")?.addEventListener("click", () => {
  
  lang = (lang === "en") ? "ar" : "en";
  
  localStorage.setItem("lang", lang);
  location.reload();
});

