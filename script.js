document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Scroll Animation Logic (스크롤 시 페이드인 효과)
    const observerOptions = {
        threshold: 0.1 // 요소가 10% 보일 때 작동
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, observerOptions);

    // 애니메이션 적용할 요소들 선택
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up');
    animatedElements.forEach(el => observer.observe(el));


    // 2. Sidebar Active State (현재 보고 있는 섹션 하이라이트)
    const sections = document.querySelectorAll("section");
    const navLi = document.querySelectorAll("#sidebar .nav-links li a");

    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute("id");
            }
        });

        navLi.forEach((a) => {
            a.classList.remove("active");
            if (a.getAttribute("href").includes(current)) {
                a.classList.add("active");
            }
        });
    });

    console.log("Portfolio ready with Pink & Black theme.");
});
