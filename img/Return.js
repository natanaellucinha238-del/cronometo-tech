const cart = [10,244,99, 2, 20, 33, 250]
let finalValue = 0

function calculateDiscount(price, discount) {
    const result = (price * discount) / 100
    return result

}

cart.forEach( value => {
    finalValue += value

});











