// 전역 변수
const optionIcon = document.getElementById('optionIcon');
const optionScreen = document.getElementById('optionScreen');
const closeOption = document.getElementById('closeOption');
const soundToggle = document.getElementById('soundToggle');
const volumeSlider = document.getElementById('volume');

// 옵션 화면 열기
optionIcon.addEventListener('click', () => {
    optionScreen.classList.remove('hidden');
});

// 옵션 화면 닫기
closeOption.addEventListener('click', () => {
    optionScreen.classList.add('hidden');
});

// 사운드 토글
soundToggle.addEventListener('change', (e) => {
    const soundOn = e.target.checked;
    if (soundOn) {
        // 사운드 켜기
        console.log('Sound On');
    } else {
        // 사운드 끄기
        console.log('Sound Off');
    }
});

// 볼륨 조절
volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value;
    // 볼륨 설정
    console.log(`Volume: ${volume}`);
});