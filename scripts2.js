function generateNumber() {
    // 1. Captura os valores dos inputs e converte para números inteiros
    const min = Math.ceil(document.querySelector(".input-min").value);
    const max = Math.floor(document.querySelector(".input-max").value);

    // 2. Validação simples: verifica se os campos estão vazios ou se o min é maior que o max
    if (min >= max) {
        alert("O valor mínimo deve ser MENOR que o valor máximo!");
    } else {
        // 3. A fórmula mágica do sorteio:
        // Math.random() gera um número entre 0 e 1
        // Multiplicamos pela diferença e somamos o mínimo para ajustar o intervalo
        const result = Math.floor(Math.random() * (max - min + 1)) + min;

        // 4. Exibe o resultado (você pode trocar o alert por um elemento no HTML depois)
        alert("O número sorteado foi: " + result);
    }
}





