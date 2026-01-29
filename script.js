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
// --- 5. Audio Reactive Wave Border ---
    const canvas = document.getElementById('wave-canvas');
    const ctx = canvas.getContext('2d');
    const micBtn = document.getElementById('mic-btn');
    const micIcon = micBtn.querySelector('i');
    
    let audioContext, analyser, dataArray, source;
    let isMicOn = false;
    
    // 캔버스 크기 설정
    function resizeCanvas() {
        canvas.width = 60; // CSS width와 일치시킴 (픽셀 단위)
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // 애니메이션 변수
    let time = 0;
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let volume = 0;
        
        // 마이크가 켜져있으면 볼륨 분석
        if (isMicOn && analyser) {
            analyser.getByteFrequencyData(dataArray);
            // 저음역대~중음역대 평균 볼륨 계산
            const length = dataArray.length;
            let sum = 0;
            for(let i = 0; i < length; i++) {
                sum += dataArray[i];
            }
            volume = sum / length; // 0 ~ 255 사이 값
        }

        // 선 그리기 스타일
        // 테마에 따라 색상을 가져오려면 getComputedStyle 사용
        const computedStyle = getComputedStyle(document.body);
        const borderColor = computedStyle.getPropertyValue('--border-color').trim();
        const accentColor = computedStyle.getPropertyValue('--accent-pink').trim();

        ctx.beginPath();
        ctx.strokeStyle = isMicOn && volume > 10 ? accentColor : borderColor; // 소리 반응시 핑크색
        ctx.lineWidth = isMicOn ? 2 : 1;
        
        // 곡선 그리기 (Sine Wave)
        // x = 기본위치 + (진폭 * sin(y * 주파수 + 시간))
        const baseX = 30; // 캔버스 중앙
        const waveFrequency = 0.01; // 굴곡 빈도
        
        // 볼륨에 따라 흔들림 강도 조절 (기본 호흡: 2, 소리나면: volume * 0.5)
        const amplitude = isMicOn ? (volume * 0.5 + 5) : 0; 

        for (let y = 0; y < canvas.height; y++) {
            // y값에 따라 x좌표를 흔들어줌
            const x = baseX + Math.sin(y * waveFrequency + time) * amplitude;
            
            if (y === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        
        ctx.stroke();
        
        time += 0.05; // 흐르는 속도
        requestAnimationFrame(animate);
    }
    
    // 초기 실행 (정적인 물결)
    animate();

    // 마이크 버튼 클릭 이벤트
    micBtn.addEventListener('click', async () => {
        if (!isMicOn) {
            try {
                // 오디오 권한 요청
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                source = audioContext.createMediaStreamSource(stream);
                
                source.connect(analyser);
                analyser.fftSize = 256;
                const bufferLength = analyser.frequencyBinCount;
                dataArray = new Uint8Array(bufferLength);
                
                isMicOn = true;
                micBtn.classList.add('active');
                micIcon.classList.replace('ph-microphone-slash', 'ph-microphone');
                micBtn.querySelector('span').innerText = "Listening...";
                
            } catch (err) {
                console.error("Mic Error:", err);
                alert("마이크 권한이 필요합니다! (https 환경 혹은 로컬호스트에서만 작동합니다)");
            }
        } else {
            // 끄기 기능 (옵션)
            if(audioContext) audioContext.close();
            isMicOn = false;
            micBtn.classList.remove('active');
            micIcon.classList.replace('ph-microphone', 'ph-microphone-slash');
            micBtn.querySelector('span').innerText = "Enable Mic";
        }
    });
