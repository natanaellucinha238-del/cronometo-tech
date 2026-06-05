const display = document.getElementById('display');
const upperDisplay = document.getElementById('upper-display');
const modeIndicator = document.getElementById('mode-indicator');
const historyList = document.getElementById('history-list');
const historyPanel = document.getElementById('history-panel');

let currentInput = '0';
let equation = '';
let isCalculated = false;
let isRadMode = false; 
let history = [];

function updateDisplay() {
    display.innerText = currentInput;
    upperDisplay.innerText = equation;
}

// Mapeamento de funções de cliques
document.querySelector('.buttons-grid').addEventListener('click', (e) => {
    const target = e.target;
    if (!target.matches('button')) return;

    if (target.dataset.num) {
        pushNum(target.dataset.num);
    } else if (target.dataset.op) {
        pushOp(target.dataset.op);
    } else if (target.dataset.constant) {
        pushConstant(target.dataset.constant);
    } else if (target.dataset.action) {
        const action = target.dataset.action;
        if (action === 'clear') clearAll();
        if (action === 'delete') deleteLast();
        if (action === 'calculate') calculate();
        if (action === 'toggle-mode') toggleMode();
        if (action === 'toggle-history') toggleHistory();
    }
});

function toggleMode() {
    isRadMode = !isRadMode;
    modeIndicator.innerText = isRadMode ? 'RAD' : 'DEG';
    document.getElementById('btn-mode').innerText = isRadMode ? 'DEG' : 'RAD';
}

function pushNum(num) {
    if (isCalculated) {
        currentInput = '';
        isCalculated = false;
    }
    if (currentInput === '0' && num !== '.') {
        currentInput = num;
    } else {
        if (num === '.' && currentInput.includes('.')) return;
        currentInput += num;
    }
    updateDisplay();
}

function pushConstant(constant) {
    if (isCalculated) {
        currentInput = '';
        isCalculated = false;
    }
    if (constant === 'pi') currentInput += Math.PI.toFixed(6);
    if (constant === 'e') currentInput += Math.E.toFixed(6);
    updateDisplay();
}

function pushOp(op) {
    if (isCalculated) isCalculated = false;

    switch(op) {
        case '+':
        case '-':
        case '*':
        case '/':
            equation += currentInput + ' ' + op + ' ';
            currentInput = '0';
            break;
        case '^':
            equation += currentInput + ' ** ';
            currentInput = '0';
            break;
        case 'sin':
        case 'cos':
        case 'tan':
            equation += op + (isRadMode ? '_rad(' : '_deg(') + currentInput + ')';
            currentInput = '0';
            break;
        case 'log':
        case 'ln':
        case 'sqrt':
            equation += op + '(' + currentInput + ')';
            currentInput = '0';
            break;
        case 'fact':
            equation += 'fact(' + currentInput + ')';
            currentInput = '0';
            break;
    }
    updateDisplay();
}

function clearAll() {
    currentInput = '0';
    equation = '';
    isCalculated = false;
    updateDisplay();
}

function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function fact(num) {
    if (num < 0 || !Number.isInteger(Number(num))) return NaN;
    if (num === 0 || num === 1) return 1;
    let result = 1;
    for (let i = num; i > 1; i--) result *= i;
    return result;
}

const degToRad = (deg) => (deg * Math.PI) / 180;
const sinDeg = (deg) => Math.sin(degToRad(deg));
const cosDeg = (deg) => Math.cos(degToRad(deg));
const tanDeg = (deg) => Math.tan(degToRad(deg));

function calculate() {
    if (currentInput !== '0' && currentInput !== '') {
        equation += currentInput;
    }

    let originalEquation = equation;

    let finalFormula = equation
        .replace(/sin_rad\(/g, 'Math.sin(')
        .replace(/cos_rad\(/g, 'Math.cos(')
        .replace(/tan_rad\(/g, 'Math.tan(')
        .replace(/sin_deg\(/g, 'sinDeg(')
        .replace(/cos_deg\(/g, 'cosDeg(')
        .replace(/tan_deg\(/g, 'tanDeg(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/sqrt\(/g, 'Math.sqrt(');

    try {
        if (finalFormula.trim() === '') return;

        let result = eval(finalFormula);

        if (isNaN(result) || !isFinite(result)) {
            currentInput = 'Erro';
        } else {
            currentInput = Number(result.toFixed(8)).toString();
            addHistoryItem(originalEquation, currentInput);
        }
        
        equation = '';
        isCalculated = true;
    } catch (error) {
        currentInput = 'Erro de Sintaxe';
        equation = '';
        isCalculated = true;
    }
    updateDisplay();
}

function toggleHistory() {
    historyPanel.classList.toggle('hidden');
}

function addHistoryItem(expr, res) {
    let cleanExpr = expr.replace(/_deg/g, '').replace(/_rad/g, '').replace(/\*\*/g, '^');
    
    history.unshift({ expr: cleanExpr, res: res });

    historyList.innerHTML = '';
    history.forEach((item) => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `<div class="history-expr">${item.expr} =</div><div class="history-res">${item.res}</div>`;
        div.onclick = () => {
            currentInput = item.res;
            isCalculated = false;
            updateDisplay();
        };
        historyList.appendChild(div);
    });
}

document.getElementById('clear-history').addEventListener('click', () => {
    history = [];
    historyList.innerHTML = '<p class="empty-msg">Nenhum cálculo recente</p>';
});

// Atalhos do Teclado Físico
document.addEventListener('keydown', (event) => {
    const key = event.key;

    if (!isNaN(key)) pushNum(key);
    if (key === '.') pushNum('.');
    if (key === '+') pushOp('+');
    if (key === '-') pushOp('-');
    if (key === '*') pushOp('*');
    if (key === '/') pushOp('/');
    if (key === '^') pushOp('^');
    if (key === '(') pushNum('(');
    if (key === ')') pushNum(')');
    
    if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    }
    if (key === 'Backspace') deleteLast();
    if (key === 'Escape') clearAll();
});