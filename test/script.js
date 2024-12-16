// 전역 변수
const horses = [];
const strategies = ['도주', '선행', '선입', '추입'];
const track = document.getElementById('track');
const startScreen = document.getElementById('startScreen');
const gameList = document.getElementById('gameList');
const money = document.getElementById('money');
const carousel = document.querySelector('.carousel');
const gameCards = Array.from(document.querySelectorAll('.game-card'));
const game1 = document.getElementById('game1');
const game2 = document.getElementById('game2');
const game3 = document.getElementById('game3');

const optionIcon = document.getElementById('optionIcon');
const optionScreen = document.getElementById('optionScreen');
const closeOption = document.getElementById('closeOption');
const soundToggle = document.getElementById('soundToggle');
const volumeSlider = document.getElementById('volume');

const bulletcontainer = document.getElementById('bullet-container');
const reactioncontainer = document.getElementById('reaction-container');
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

const shopIcon = document.getElementById('shopIcon');
const shopScreen = document.getElementById('shopScreen');
const closeShop = document.getElementById('closeShop');
const spinButton = document.getElementById('spinButton');
const applyButton = document.getElementById('applyButton');
const slots = [document.getElementById('slot1'), document.getElementById('slot2'), document.getElementById('slot3')];
const moneyDisplay = document.getElementById('money');

const themeToggle = document.getElementById('themeToggle');
const rootElement = document.documentElement;

let currentIndex = 0;
let soundOn = true;
let currentHorseIndex = 0;
let bettingAmount = 0;
let selectedHorse = null;
let totalRaces = 8;
let isbetting = false;
let appliedColor = '#FFFFFF'; // 기본 색상
let themebg = 'black';

// 반응속도 게임 관련 변수
let reactionTimes = [];
let startTime = 0;
let round = 0;
const totalRounds = 5;

const messageEl = document.getElementById('reaction-message');
const reactionContainer = document.getElementById('reaction-container');
const resultEl = document.getElementById('reaction-speed');
const actionButtonEl = document.getElementById('reaction-button');

function showTarget() {
  const delay = Math.random() * 2000 + 1000; // Random delay between 1-3 seconds
  setTimeout(() => {
    startTime = Date.now();
    reactionContainer.style.backgroundColor = 'lightgrey'; // 화면 색상 변경
    messageEl.textContent = 'Click!';
  }, delay);
}

function startGame() {
  reactionTimes = [];
  round = 0;
  resultEl.style.display = 'none';
  actionButtonEl.style.display = 'none';
  nextRound();
}

function nextRound() {
  if (round < totalRounds) {
    round++;
    messageEl.textContent = `Round ${round}: Get ready...`;
    reactionContainer.style.backgroundColor = themebg; // 기본 색상으로 변경
    showTarget();
  } else {
    endGame();
  }
}

function handleTargetClick() {
  if (reactionContainer.style.backgroundColor === 'lightgrey') {
    const reactionTime = Date.now() - startTime;
    reactionTimes.push(reactionTime);
    messageEl.textContent = `Reaction time: ${reactionTime} ms`;
    reactionContainer.style.backgroundColor = themebg; // 기본 색상으로 변경
    setTimeout(nextRound, 1000);
  }
}

function endGame() {
  const averageTime = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
  messageEl.textContent = `평균 반응 속도: ${averageTime.toFixed(2)} ms`;
  if (averageTime < 270) {
    money.textContent = parseInt(money.textContent) + 1000;
    resultEl.textContent = `얻은 돈: 1000`;
  } else {
    money.textContent = parseInt(money.textContent) + 500;
    resultEl.textContent = `얻은 돈: 500`;
  }

  resultEl.style.display = 'block';
  actionButtonEl.style.display = 'block';
}

reactionContainer.addEventListener('click', handleTargetClick);
actionButtonEl.addEventListener('click', () => {
  startGame();
  reactionContainer.classList.add('hidden');
  gameList.classList.remove('hidden');
});

// 게임 시작 버튼 클릭 시 startGame() 실행
document.getElementById('game2').addEventListener('click', () => {
    gameList.classList.add('hidden');
    reactionContainer.classList.remove('hidden');
    messageEl.textContent = '로딩중...';
    setTimeout(startGame, 3000); // 3초 후에 게임 시작
  });

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

// 창 크기 조정 시 캐러셀 업데이트
window.addEventListener('resize', updateCarousel);

// 게임 1 클릭 시 탄막 게임 화면으로 전환
game1.addEventListener('click', () => {
    gameList.classList.add('hidden');
    bulletcontainer.classList.remove('hidden');
    player.color = appliedColor; // 저장된 색상 적용
    gameLoop();
});

// 게임 2 클릭 시 반응속도 게임 화면으로 전환
game2.addEventListener('click', () => {
    gameList.classList.add('hidden');
    reactioncontainer.classList.remove('hidden');
});

// 게임 3 클릭 시 경마 게임 화면으로 전환
game3.addEventListener('click', () => {
    gameList.classList.add('hidden');
    bettingContainer.classList.remove('hidden');
    horses.forEach((horse) => {
        if (parseInt(horse.dataset.number) === selectedHorse) {
            horse.style.backgroundColor = appliedColor; // 저장된 색상 적용
        } else {
            horse.style.backgroundColor = 'brown'; // 기본 색상
        }
    });
});

// 옵션 화면 열기
optionIcon.addEventListener('click', () => {
    optionScreen.classList.remove('hidden');
});

// 옵션 화면 닫기
closeOption.addEventListener('click', () => {
    optionScreen.classList.add('hidden');
});

// 타이틀로 버튼 클릭 시 시작 화면으로 이동
document.getElementById('titleButton').addEventListener('click', () => {
    optionScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    gameList.classList.add('hidden');
    // 필요한 경우 다른 화면도 숨김 처리
    document.getElementById('bullet-container').classList.add('hidden');
    document.getElementById('reaction-container').classList.add('hidden');
    document.getElementById('betting-container').classList.add('hidden');
    document.getElementById('game-container').classList.add('hidden');
    document.getElementById('shopScreen').classList.add('hidden');
});

// 상점 화면 열기
shopIcon.addEventListener('click', () => {
    shopScreen.classList.remove('hidden');
});

// 상점 화면 닫기
closeShop.addEventListener('click', () => {
    shopScreen.classList.add('hidden');
});

// 슬롯머신 스핀
spinButton.addEventListener('click', () => {
    let money = parseInt(moneyDisplay.textContent, 10);
    if (money < 2000) {
        showAlert('돈이 부족합니다!');
        return;
    }

    money -= 2000;
    moneyDisplay.textContent = money;

    const hexValues = [];
    const spinDuration = 2000; // 스핀 지속 시간 (밀리초)
    const spinInterval = 100; // 색상 변경 간격 (밀리초)
    let elapsedTime = 0;

    const spinAnimation = setInterval(() => {
        for (let i = 0; i < slots.length; i++) {
            const randomValue = Math.floor(Math.random() * 256);
            const hexValue = randomValue.toString(16).padStart(2, '0');
            hexValues[i] = hexValue;
            slots[i].textContent = hexValue;
        }

        const currentColor = `#${hexValues.join('')}`;
        slots.forEach(slot => {
            slot.style.backgroundColor = currentColor;
        });

        elapsedTime += spinInterval;
        if (elapsedTime >= spinDuration) {
            clearInterval(spinAnimation);
            applyColorToGame(currentColor);
        }
    }, spinInterval);
});

// 슬롯머신 색상 적용
applyButton.addEventListener('click', () => {
    const hexValues = slots.map(slot => slot.textContent);
    const finalColor = `#${hexValues.join('')}`;
    applyColorToGame(finalColor);
    shopScreen.classList.add('hidden');
});

// 색상 적용 함수
function applyColorToGame(color) {
    appliedColor = color; // 색상 저장

    // 베팅한 말의 색상을 변경하는 로직
    horses.forEach((horse) => {
        if (parseInt(horse.dataset.number) === selectedHorse) {
            horse.style.backgroundColor = color;
        } else {
            horse.style.backgroundColor = 'brown'; // 기본 색상
        }
    });

    // 탄막 게임의 플레이어 색상을 변경하는 로직
    player.color = color;
}

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
            showAlert('축하합니다. 베팅에 성공하셨습니다.');
        } 
        else {
            money.textContent = parseInt(money.textContent) - bettingAmount;
            showAlert('베팅 실패! 다음 기회에 도전하세요.');
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

    // 모든 말의 색상을 기본 색상으로 되돌림
    horses.forEach((horse) => {
        horse.style.backgroundColor = 'brown'; // 기본 색상
    });

    resultsScreen.classList.remove('hidden');
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
    horseImage.src = `horse${horse.dataset.number}.jpeg`; // 말 이미지 설정
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
    const bettingValue = parseInt(bettingValueInput.value, 10);
    const bettingHorse = parseInt(bettingHorseInput.value, 10);

    if (isNaN(bettingValue) || isNaN(bettingHorse) || bettingValue <= 0 || bettingHorse < 1 || bettingHorse > horses.length) {
        showAlert('유효한 베팅 금액과 말 번호를 입력하세요.');
        return;
    }

    if (bettingValue > parseInt(money.textContent, 10)) {
        showAlert('돈이 부족합니다.');
        return;
    }

    selectedHorse = bettingHorse;
    bettingAmount = bettingValue;
    isbetting = true;

    // 베팅한 말의 색상을 변경
    horses.forEach((horse) => {
        if (parseInt(horse.dataset.number) === selectedHorse) {
            horse.style.backgroundColor = appliedColor; // 저장된 색상 적용
        }
    });

    showAlert(`말 번호 ${selectedHorse}에 ${bettingAmount}원을 베팅했습니다.`);
});

// 경기 시작 버튼 클릭 이벤트
startRaceButton.addEventListener('click', () => {
    if (!isbetting) {
        showAlert('먼저 베팅을 해주세요.');
        return;
    }

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

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScore = document.getElementById('finalScore');
const restartbutton = document.getElementById('restartButton');

// 캔버스 크기 설정
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 게임 상태 변수
let player = { x: canvas.width / 2, y: canvas.height - 50, width: 20, height: 20, color: 'white' };
let enemies = [];
let isGameOver = false;
let score = 0;

// 플레이어 움직임
let keys = {};
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

// 플레이어 업데이트
function updatePlayer() {
    if (keys['ArrowLeft'] && player.x > 0) player.x -= 5;
    if (keys['ArrowRight'] && player.x + player.width < canvas.width) player.x += 5;
}

// 적 업데이트
function updateEnemies() {
    const spawnRate = Math.min(0.05 + score * 0.0001, 0.5); // 점수가 높아질수록 적 생성 빈도 증가
    const enemySpeed = 2 + score * 0.01; // 점수가 높아질수록 적 속도 증가

    if (Math.random() < spawnRate) {
        enemies.push({ x: Math.random() * canvas.width, y: 0, width: 20, height: 20, color: 'green', speed: enemySpeed });
    }
    enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;
        if (enemy.y > canvas.height) enemies.splice(index, 1);
    });
}

// 충돌 감지
function detectCollisions() {
    enemies.forEach((enemy, eIndex) => {
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            isGameOver = true;
            showGameOver();
        }
    });
}

// 게임 오버 메시지 표시
function showGameOver() {
    finalScore.textContent = `Get money: ${score}`;
    money.textContent = parseInt(money.textContent) + score;
    gameOverScreen.classList.remove('hidden');
}

// 그리기 함수
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    enemies.forEach((enemy) => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });

    // 점수 표시
    ctx.fillStyle = 'white';
    ctx.font = '24px serif';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

// 게임 루프
function gameLoop() {
    if (isGameOver) return;
    updatePlayer();
    updateEnemies();
    detectCollisions();
    draw();
    score++;
    requestAnimationFrame(gameLoop);
}

// 게임 재시작
restartbutton.addEventListener('click', () => {
    gameOverScreen.classList.add('hidden');
    player = { x: canvas.width / 2, y: canvas.height - 50, width: 20, height: 20, color: 'white' };
    enemies = [];
    isGameOver = false;
    score = 0;

    bulletcontainer.classList.add('hidden');
    gameList.classList.remove('hidden');
});

// 게임 재시작
restartButton.addEventListener('click', () => {
    gameOverScreen.classList.add('hidden');
    enemies = [];
    isGameOver = false;
    score = 0;

    bulletcontainer.classList.add('hidden');
    gameList.classList.remove('hidden');
});

function showTarget() {
  const delay = Math.random() * 2000 + 1000; // Random delay between 1-3 seconds
  setTimeout(() => {
    startTime = Date.now();
    reactionContainer.style.backgroundColor = 'lightgrey'; // 화면 색상 변경
    messageEl.textContent = 'Click!';
  }, delay);
}

function startGame() {
  reactionTimes = [];
  round = 0;
  resultEl.style.display = 'none';
  actionButtonEl.style.display = 'none';
  nextRound();
}

function nextRound() {
  if (round < totalRounds) {
    round++;
    messageEl.textContent = `Round ${round}: Get ready...`;
    reactionContainer.style.backgroundColor = themebg; // 기본 색상으로 변경
    showTarget();
  } else {
    endGame();
  }
}

function handleTargetClick() {
  if (reactionContainer.style.backgroundColor === 'lightgrey') {
    const reactionTime = Date.now() - startTime;
    reactionTimes.push(reactionTime);
    messageEl.textContent = `Reaction time: ${reactionTime} ms`;
    reactionContainer.style.backgroundColor = themebg; // 기본 색상으로 변경
    setTimeout(nextRound, 1000);
  }
}

function endGame() {
  const averageTime = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
  messageEl.textContent = `평균 반응 속도: ${averageTime.toFixed(2)} ms`;
  if (averageTime < 270) {
    money.textContent = parseInt(money.textContent) + 1000;
    resultEl.textContent = `얻은 돈: 1000`;
  } else {
    money.textContent = parseInt(money.textContent) + 500;
    resultEl.textContent = `얻은 돈: 500`;
  }

  resultEl.style.display = 'block';
  actionButtonEl.style.display = 'block';
}

reactionContainer.addEventListener('click', handleTargetClick);
actionButtonEl.addEventListener('click', () => {
  startGame();
  reactionContainer.classList.add('hidden');
  gameList.classList.remove('hidden');
});

// 사용자 정의 알림 메시지 창 제어 함수
function showAlert(message) {
    const alertBox = document.getElementById('alertBox');
    const alertMessage = document.getElementById('alertMessage');
    const alertButton = document.getElementById('alertButton');

    alertMessage.textContent = message;
    alertBox.classList.remove('hidden');

    alertButton.onclick = () => {
        alertBox.classList.add('hidden');
    };
}

// 기존 alert 함수 대체
function alert(message) {
    showAlert(message);
}

// 옵션 메뉴 토글 함수
function toggleOptionMenu() {
    if (optionScreen.classList.contains('hidden')) {
        optionScreen.classList.remove('hidden');
    } else {
        optionScreen.classList.add('hidden');
    }
}

// ESC 키 이벤트 리스너 추가
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        toggleOptionMenu();
    }
});

themeToggle.addEventListener('click', () => {
    if (rootElement.classList.contains('light-theme')) {
        rootElement.classList.remove('light-theme');
        rootElement.classList.add('dark-theme');
        themeToggle.textContent = 'Light';
        themebg = 'black';
        shopIcon.querySelector('img').src = '상점_dark.png'; // dark 모드 이미지
    } else {
        rootElement.classList.remove('dark-theme');
        rootElement.classList.add('light-theme');
        themeToggle.textContent = 'Dark';
        themebg = 'white';
        shopIcon.querySelector('img').src = '상점_light.png'; // light 모드 이미지
    }
});

// 초기 테마 설정
rootElement.classList.add('dark-theme');

// 도움말 화면 열기
document.getElementById('helpIcon').addEventListener('click', () => {
    document.getElementById('helpScreen').classList.remove('hidden');
});

// 도움말 화면 닫기
document.getElementById('closeHelp').addEventListener('click', () => {
    document.getElementById('helpScreen').classList.add('hidden');
});