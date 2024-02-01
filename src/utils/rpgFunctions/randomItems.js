const { randomInt } = require('./randomInt.js')
const { ores, woods } = require('../items.js')


const randomOre = (pickaxeStats) => {
    let oreArray = ores.filter(o => o.rarity <= pickaxeStats.range);
    let ore = oreArray[Math.floor(Math.random() * oreArray.length)];
    return ore;
}

const randomWood = (axeStats) => {
    let woodArray = woods.filter(w => w.rarity <= axeStats.range);
    let wood = woodArray[Math.floor(Math.random() * woodArray.length)];
    return wood;
}

const randomAmount = (item) => {
    return randomInt(item.minAmount, item.maxAmount);
}

const randomPrice = (item) => {
    return randomInt(item.minPrice, item.maxPrice);
}


module.exports = { randomOre, randomWood, randomAmount, randomPrice }