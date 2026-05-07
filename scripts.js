const convertButton = document.querySelector("#convert-button")
const currencySelect = document.querySelector("#currency-select-to")

async function convertValues() {
    const inputValue = document.querySelector("#input-value").value
    const realValueText = document.querySelector("#real-value-text")
    const targetValueText = document.querySelector("#target-currency-value")

    if (inputValue === "" || inputValue <= 0) return

    const url = "https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,GBP-BRL,JPY-BRL,CNY-BRL,BTC-BRL"

    try {
        const response = await fetch(url)
        const data = await response.json()

        const rates = {
            dolar: data.USDBRL.high,
            euro: data.EURBRL.high,
            libra: data.GBPBRL.high,
            iene: data.JPYBRL.high,
            yuan: data.CNYBRL.high,
            bitcoin: data.BTCBRL.high
        }

        realValueText.innerHTML = new Intl.NumberFormat("pt-BR", {
            style: "currency", currency: "BRL"
        }).format(inputValue)

        if (currencySelect.value === "dolar") {
            targetValueText.innerHTML = new Intl.NumberFormat("en-US", {
                style: "currency", currency: "USD"
            }).format(inputValue / rates.dolar)
        }
        if (currencySelect.value === "euro") {
            targetValueText.innerHTML = new Intl.NumberFormat("de-DE", {
                style: "currency", currency: "EUR"
            }).format(inputValue / rates.euro)
        }
        if (currencySelect.value === "libra") {
            targetValueText.innerHTML = new Intl.NumberFormat("en-GB", {
                style: "currency", currency: "GBP"
            }).format(inputValue / rates.libra)
        }
        if (currencySelect.value === "iene") {
            targetValueText.innerHTML = new Intl.NumberFormat("ja-JP", {
                style: "currency", currency: "JPY"
            }).format(inputValue / rates.iene)
        }
        if (currencySelect.value === "yuan") {
            targetValueText.innerHTML = new Intl.NumberFormat("zh-CN", {
                style: "currency", currency: "CNY"
            }).format(inputValue / rates.yuan)
        }
        if (currencySelect.value === "bitcoin") {
            targetValueText.innerHTML = "₿ " + (inputValue / (rates.bitcoin * 1000)).toFixed(7)
        }
    } catch (e) { alert("Erro na API") }
}

function changeCurrency() {
    const currencyName = document.getElementById("currency-name")
    const currencyImage = document.getElementById("currency-img")

    // NOVOS LINKS DE IMAGENS PÚBLICAS E ESTÁVEIS (FlagCDN e Flaticon públicos)
    const currencyData = {
        dolar: { name: "Dólar americano", img: "https://flagcdn.com/w80/us.png" },
        euro: { name: "Euro", img: "https://flagcdn.com/w80/eu.png" },
        libra: { name: "Libra Esterlina", img: "https://flagcdn.com/w80/gb.png" },
        iene: { name: "Iene Japonês", img: "https://flagcdn.com/w80/jp.png" },
        yuan: { name: "Yuan Chinês", img: "https://flagcdn.com/w80/cn.png" },
        bitcoin: { name: "Bitcoin", img: "https://cdn-icons-png.flaticon.com/512/5968/5968260.png" }
    }

    const selected = currencySelect.value
    currencyName.innerHTML = currencyData[selected].name
    currencyImage.src = currencyData[selected].img
    convertValues()
}

currencySelect.addEventListener("change", changeCurrency)
convertButton.addEventListener("click", convertValues)