document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Day/Night Theme Toggle ---
    const themeToggleBtn = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");
    const body = document.body;

    // 저장된 테마 불러오기 (없으면 기본값 Dark)
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        body.setAttribute("data-theme", "light");
        themeIcon.classList.replace("ph-sun", "ph-moon");
    }

    themeToggleBtn.addEventListener("click", () => {
        if (body.getAttribute("data-theme") === "light") {
            // Switch to Dark
            body.removeAttribute("data-theme");
            themeIcon.classList.replace("ph-moon", "ph-sun");
            localStorage.setItem("theme", "dark");
        } else {
            // Switch to Light
            body.setAttribute("data-theme", "light");
            themeIcon.classList.replace("ph-sun", "ph-moon");
            localStorage.setItem("theme", "light");
        }
    });


    // --- 2. Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const navLinks = document.querySelectorAll(".nav-links a");

    function toggleMenu() {
        sidebar.classList.toggle("active");
        overlay.classList.toggle("active");
    }

    // 햄버거 버튼 클릭
    if(mobileMenuBtn) {
        mobileMenuBtn.addEventListener("click", toggleMenu);
    }
    
    // 배경 클릭 시 닫기
    overlay.addEventListener("click", toggleMenu);

    // 메뉴 링크 클릭 시 자동으로 닫기 (모바일 UX)
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (sidebar.classList.contains("active")) {
                toggleMenu();
            }
        });
    });


    // --- 3. Scroll Animation (Intersection Observer) ---
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .fade-in-up').forEach(el => observer.observe(el));


    // --- 4. Sidebar Active State Logic ---
    const sections = document.querySelectorAll("section");
    
    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            // 모바일 헤더 높이만큼 보정
            if (scrollY >= sectionTop - 150) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach((a) => {
            a.classList.remove("active");
            if (a.getAttribute("href").includes(current)) {
                a.classList.add("active");
            }
        });
    });
});
