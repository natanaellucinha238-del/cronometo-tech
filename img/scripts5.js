const gameRules = {
    pedra: { emoji: '✊', defeats: 'tesoura' },
    papel: { emoji: '✋', defeats: 'pedra' },
    tesoura: { emoji: '✌️', defeats: 'papel' }
};

const buttons = document.querySelectorAll('.control-card');
const playerPreview = document.getElementById('player-preview');
const computerPreview = document.getElementById('computer-preview');
const resultMessage = document.getElementById('result-message');
const playerScoreDisplay = document.getElementById('player-score');
const computerScoreDisplay = document.getElementById('computer-score');

let playerScore = 0;
let computerScore = 0;

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const playerChoice = button.getAttribute('data-choice');
        executeRound(playerChoice);
    });
});

function executeRound(playerChoice) {
    // 1. Escolha da CPU
    const options = Object.keys(gameRules);
    const computerChoice = options[Math.floor(Math.random() * options.length)];

    // 2. Reseta classes de animações antigas para poder rodar de novo
    playerPreview.classList.remove('pop-animation', 'winner-glow', 'loser-glow');
    computerPreview.classList.remove('pop-animation', 'winner-glow', 'loser-glow');
    void playerPreview.offsetWidth; // Truque para resetar animação CSS no navegador
    void computerPreview.offsetWidth;

    // 3. Define os Emojis e ativa animação de impacto ("Pop")
    playerPreview.textContent = gameRules[playerChoice].emoji;
    computerPreview.textContent = gameRules[computerChoice].emoji;
    playerPreview.classList.add('pop-animation');
    computerPreview.classList.add('pop-animation');

    // 4. Limpa classes de cores de status anteriores
    resultMessage.className = '';

    // 5. Avaliação do Resultado da Rodada
    if (playerChoice === computerChoice) {
        resultMessage.textContent = "EMPATE TÉCNICO";
        resultMessage.classList.add('text-draw');
    } 
    else if (gameRules[playerChoice].defeats === computerChoice) {
        resultMessage.textContent = "VITÓRIA EXCELENTE!";
        resultMessage.classList.add('text-win');
        playerPreview.classList.add('winner-glow');
        computerPreview.classList.add('loser-glow');
        
        playerScore++;
        playerScoreDisplay.textContent = playerScore;
    } 
    else {
        resultMessage.textContent = "DERROTA NA ARENA";
        resultMessage.classList.add('text-lose');
        playerPreview.classList.add('loser-glow');
        computerPreview.classList.add('winner-glow');
        
        computerScore++;
        computerScoreDisplay.textContent = computerScore;
    }
}