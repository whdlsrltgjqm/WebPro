// 전역 변수
const horses = [];
const strategies = ['도주', '선행', '선입', '추입'];
const track = document.getElementById('track');
const startScreen = document.getElementById('startScreen');
const gameList = document.getElementById('gameList');
const money = document.getElementById('money');
const carousel = document.querySelector('.carousel');
const gameCards = Array.from(document.querySelectorAll('.game-card'));
const game3 = document.getElementById('game3');
const soundIcon = document.getElementById('soundIcon');
const soundImage = document.getElementById('soundImage');
const startButton = document.getElementById('start-button');
const resultsScreen = document.getElementById('results');
const resultsList = document.getElementById('results-list');
const restartButton = document.getElementById('restart-button');
const bettingContainer = document.getElementById('betting-container');
const gameContainer = document.getElementById('game-container');
const horseImage = document.getElementById('horse-image');
const horseNumber = document.getElementById('horse-number');
const horseStrategy = document.getElementById('horse-strategy');
const horseOdds = document.getElementById('horse-odds');
const horseWinningRate = document.getElementById('horse-winning-rate');
const prevHorseButton = document.getElementById('prev-horse');
const nextHorseButton = document.getElementById('next-horse');
const bettingValueInput = document.getElementById('betting-value');
const bettingHorseInput = document.getElementById('betting-horse');
const placeBetButton = document.getElementById('place-bet');
const startRaceButton = document.getElementById('start-race');

let currentIndex = 0;
let soundOn = true;
let currentHorseIndex = 0;
let bettingAmount = 0;
let selectedHorse = null;
let totalRaces = 8;
let isbetting = false;

// 스타트 화면 클릭 시 게임 목록 화면으로 전환
startScreen.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    gameList.classList.remove('hidden');
});

// 카드 캐러셀 업데이트
function updateCarousel() {
  const totalCards = gameCards.length; // 카드 개수

  // 각 카드에 클래스 추가
  gameCards.forEach((card, index) => {
    card.classList.remove('active', 'left', 'right');
    if (index === currentIndex) {
      card.classList.add('active');
    } else if (index === (currentIndex - 1 + totalCards) % totalCards) {
      card.classList.add('left');
    } else if (index === (currentIndex + 1) % totalCards) {
      card.classList.add('right');
    }
  });
}

// 휠을 이용한 캐러셀 이동
carousel.addEventListener('wheel', (event) => {
  event.preventDefault();
  const delta = Math.sign(event.deltaY);
  currentIndex = (currentIndex + delta + gameCards.length) % gameCards.length; // 인덱스 업데이트
  updateCarousel(); 
});

// 사운드 아이콘 클릭 시 사운드 on/off
soundIcon.addEventListener('click', () => {
    soundOn = !soundOn;
    soundImage.src = soundOn ? 'https://img.icons8.com/ios/50/000000/high-volume--v1.png' : 'https://img.icons8.com/ios/50/000000/mute.png';
});

// 창 크기 조정 시 캐러셀 업데이트
window.addEventListener('resize', updateCarousel);

// 게임 3 클릭 시 게임 3 화면으로 전환
game3.addEventListener('click', () => {
    gameList.classList.add('hidden');
    bettingContainer.classList.remove('hidden');
});

// 초기 말 생성
function initHorses() {
    for (let i = 0; i < 8; i++) {
        const horse = document.createElement('div');
        horse.className = 'horse';
        horse.style.top = `${i * 35}px`; // 각 말을 트랙 위에 정렬
        horse.dataset.number = i + 1; // 말 번호
        horse.dataset.strategy = strategies[Math.floor(Math.random() * 4)]; // 전략 할당
        horse.dataset.position = 0; // 초기 위치
        horse.dataset.winning = 1; // 초기 승리 횟수
        horse.dataset.winningRate = calculateWinningRate(1, totalRaces); // 초기 승률
        horse.dataset.odds = calculateOdds(horse.dataset.winningRate); // 초기 배당률
        track.appendChild(horse);
        horses.push(horse);
    }
}

// 승률 계산
function calculateWinningRate(winning, totalRaces) {
    return totalRaces === 0 ? 0 : ((winning / totalRaces) * 100).toFixed(2);
}

// 배당률 계산
function calculateOdds(winningRate) {
    return (100 / winningRate).toFixed(2);
}

// 전략에 따른 속도 계산 (랜덤 요소 추가)
function calculateSpeed(strategy, progress, trackLength) {
    const scaleFactor = trackLength / 1340; // Scale factor based on the original track length of 1340px
    let baseSpeed;
    if (progress < 10) { // 초기 구간
        baseSpeed = strategy === '도주' ? 8 : strategy === '선행' ? 4.2 : strategy === '선입' ? 2.8 : 2;
    } else if (progress < 60) { // 중반 구간
        baseSpeed = 5;
    } else { // 후반 구간
        baseSpeed = strategy === '추입' ? 9.7 : strategy === '선입' ? 7.3 : strategy === '선행' ? 6 : 5;
    }
    return (baseSpeed + Math.random() * 2) * scaleFactor; // Scale the speed based on the track length
}

// 말 이동
function moveHorses() {
    let raceInProgress = true;

    const interval = setInterval(() => {
        horses.forEach(horse => {
            const updatedPosition = parseInt(horse.dataset.position);
            const trackLength = track.offsetWidth;
            const progress = (updatedPosition / trackLength) * 100; // 트랙의 몇 퍼센트만큼 왔나 계산
            const strategy = horse.dataset.strategy;
            const speed = calculateSpeed(strategy, progress, trackLength);

            // 위치 갱신
            horse.dataset.position = updatedPosition + speed;
            horse.style.left = `${updatedPosition + speed}px`;

            // 진행률 표시
            const progressDisplay = document.createElement('div');
            progressDisplay.className = 'progress-display';
            progressDisplay.textContent = `${Math.round(progress)}%`;
            horse.appendChild(progressDisplay);

            // 끝에 도달 시 종료
            if (updatedPosition + speed >= trackLength - 50) {
                raceInProgress = false;
                horse.dataset.winning = parseInt(horse.dataset.winning) + 1;
                clearInterval(interval);
                showResults();
            }
        });
    }, 100); // 0.1초마다 업데이트
}

// 결과 화면 표시
function showResults() {
    resultsScreen.classList.remove('hidden');
    resultsList.innerHTML = '';

    // 결과 정렬
    const results = horses 
        .map(horse => ({
            number: horse.dataset.number,
            position: parseInt(horse.dataset.position)
        }))
        .sort((a, b) => b.position - a.position); // 거리 기준 정렬

    // 결과 표시
    results.forEach((r, i) => {
        const li = document.createElement('li');
        li.textContent = `${i + 1}위: ${r.number}번마 (거리: ${r.position}px)`;
        resultsList.appendChild(li);
    });

    // 베팅 결과 확인
    if (isbetting) {
        if (selectedHorse === parseInt(results[0].number)) {
            money.textContent = parseInt(money.textContent) + bettingAmount * (parseInt(horses[selectedHorse - 1].dataset.odds) - 1);
            alert('축하합니다. 베팅에 성공하셨습니다.');
        } 
        else {
            money.textContent = parseInt(money.textContent) - bettingAmount;
            alert('베팅 실패! 다음 기회에 도전하세요.');
        }
        isbetting = false;
    }

    // 승리 횟수 업데이트 및 승률, 배당률 재계산
    const winningHorse = horses.find(horse => horse.dataset.number == results[0].number);
    winningHorse.dataset.winning = parseInt(winningHorse.dataset.winning) + 1;
    totalRaces += 1;
    horses.forEach(horse => {
        horse.dataset.winningRate = calculateWinningRate(horse.dataset.winning, totalRaces);
        horse.dataset.odds = calculateOdds(horse.dataset.winningRate);
    });
}

// 게임 초기화
function resetGame() {
    horses.forEach(horse => {
        horse.dataset.position = 0;
        horse.style.left = '0px';
    });
    resultsScreen.classList.add('hidden');
    gameContainer.classList.add('hidden');
    gameList.classList.remove('hidden');
}

// 말 정보 표시
function displayHorseInfo(index) {
    const horse = horses[index];
    horseNumber.textContent = `${horse.dataset.number}번마`; // 말 번호 표시
    horseImage.src = 'https://via.placeholder.com/100'; // 임시 이미지
    horseStrategy.textContent = `전략: ${horse.dataset.strategy}`;
    horseOdds.textContent = `배당률: ${horse.dataset.odds}`;
    horseWinningRate.textContent = `승률: ${horse.dataset.winningRate}%`;
}

// 이전 말 버튼 클릭 이벤트
prevHorseButton.addEventListener('click', () => {
    currentHorseIndex = (currentHorseIndex - 1 + horses.length) % horses.length;
    displayHorseInfo(currentHorseIndex);
});

// 다음 말 버튼 클릭 이벤트
nextHorseButton.addEventListener('click', () => {
    currentHorseIndex = (currentHorseIndex + 1) % horses.length;
    displayHorseInfo(currentHorseIndex);
});

// 베팅 버튼 클릭 이벤트
placeBetButton.addEventListener('click', () => {
    bettingAmount = parseInt(bettingValueInput.value);
    selectedHorse = parseInt(bettingHorseInput.value);
    if (isNaN(bettingAmount) || isNaN(selectedHorse) || bettingAmount <= 0 || parseInt(money.textContent)<bettingAmount || selectedHorse < 1 || selectedHorse > 8) {
        alert('베팅 금액과 말 번호를 올바르게 입력 해주세요.');
        return;
    }
    alert(`베팅 완료: ${bettingAmount}원, ${selectedHorse}번 말`);
    isbetting = true;
});

// 경기 시작 버튼 클릭 이벤트
startRaceButton.addEventListener('click', () => {
    bettingContainer.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    moveHorses();
});

// 이벤트 리스너
startButton.addEventListener('click', () => {
    resetGame();
    moveHorses();
});

// 재시작 버튼 클릭 이벤트
restartButton.addEventListener('click', () => {
    resetGame();
});

// 초기화
initHorses();
displayHorseInfo(currentHorseIndex);
updateCarousel();
