items = [
    {
        name: 'Fishing Rod',
        value: 'fr',
        alias: ['fishing-rod', 'fishingrod'],
        price: 1000,
        sellPrice: 75,
        sellAble: false,
        useAble: true,
        craftAble: false,
        maxAmount: 1,
        emoji: '🎣',
        quantity: 0,
        description: 'A fishing rod',
        type: 'fishingrod',
    },
    {
        name: 'Fish Bait',
        value: 'fb',
        alias: ['fish-bait', 'fishbait'],
        price: 50,
        sellPrice: 25,
        sellAble: true,
        useAble: true,
        craftAble: false,
        maxAmount: 999,
        emoji: '🪱',
        quantity: 0,
        description: 'A fish bait',
        type: 'bait',
    },
]

craftItems = [
    {
        name: 'Wooden Pickaxe',
        value: 'wp',
        alias: ['wooden-pickaxe', 'woodenpickaxe'],
        sellPrice: 75,
        sellAble: false,
        useAble: true,
        craftAble: true,
        maxAmount: 1,
        emoji: ' ',
        quantity: 0,
        description: 'A wooden pickaxe',
        type: 'pickaxe',
        stats: {
            power: 1,
            durability: 50,
            range: 1
        },
        craftItems: [
            {
                name: 'Wood',
                value: 'wood',
                amount: 5,
                type: 'wooden'
            },
            {
                name: 'Stick',
                value: 'stick',
                amount: 2,
                type: 'wooden'
            }
        ],
    },
    {
        name: 'Stone Pickaxe',
        value: 'sp',
        alias: ['stone-pickaxe', 'stonepickaxe'],
        sellPrice: 100,
        sellAble: false,
        useAble: true,
        craftAble: true,
        maxAmount: 1,
        emoji: ' ',
        quantity: 0,
        description: 'A stone pickaxe',
        type: 'pickaxe',
        stats: {
            power: 2,
            durability: 100,
            range: 1
        },
        craftItems: [
            {
                name: 'Stone',
                value: 'stone',
                amount: 5,
                type: 'ores'
            },
            {
                name: 'Stick',
                value: 'stick',
                amount: 2,
                type: 'wooden'
            }
        ],
    },
    {
        name: 'Wooden Axe',
        value: 'wa',
        alias: ['wooden-axe', 'woodenaxe'],
        sellPrice: 75,
        sellAble: false,
        useAble: true,
        craftAble: true,
        maxAmount: 1,
        emoji: ' ',
        quantity: 0,
        description: 'A wooden axe',
        type: 'axe',
        stats: {
            power: 1,
            durability: 50,
            range: 1
        },
        craftItems: [
            {
                name: 'Wood',
                value: 'wood',
                amount: 5,
                type: 'wooden'
            },
            {
                name: 'Stick',
                value: 'stick',
                amount: 2,
                type: 'wooden'
            }
        ],
    },
    {
        name: 'Oak Stick',
        value: 'st',
        alias: ['stick'],
        sellPrice: 75,
        sellAble: false,
        useAble: true,
        craftAble: true,
        maxAmount: 100,
        emoji: ' ',
        quantity: 0,
        description: 'An Oak stick',
        craftItems: [
            {
                name: 'Oak Wood',
                value: 'oak',
                amount: 2,
                type: 'wooden'
            },
        ],
    }
]

// Mining Resources

ores = [
    {
        name: 'Stone',
        value: 'stone',
        emoji: ' ',
        rarity: 1,
        minAmount: 1,
        maxAmount: 3,
        minPrice: 10,
        maxPrice: 20,
        description: 'A stone',
    },
    {
        name: 'Coal',
        value: 'coal',
        emoji: ' ',
        rarity: 1,
        minAmount: 1,
        maxAmount: 3,
        minPrice: 20,
        maxPrice: 30,
        description: 'A coal',
    }
]

const woods = [
    {
        name: 'Oak wood',
        value: 'oak',
        emoji: ' ',
        rarity: 1,
        minAmount: 1,
        maxAmount: 3,
        minPrice: 10,
        maxPrice: 20,
        description: 'Oak wood'
    },
    {
        name: 'Pine wood',
        value: 'pine',
        emoji: ' ',
        rarity: 1,
        minAmount: 1,
        maxAmount: 3,
        minPrice: 15,
        maxPrice: 25,
        description: 'Pine wood'
    }
]
module.exports = { items, craftItems, ores, woods };

// Test ITems
// items = [
//     {
//         name: 'Apple',
//         value: 'a',
//         price: 100,
//         sellPrice: 75,
//         sellAble: true,
//         useAble: true,
//         maxAmount: 10,
//         emoji: '🍎',
//         quantity: 0,
//         description: 'An apple',
//     },
//     {
//         name: 'Banana',
//         value: 'b',
//         price: 200,
//         sellPrice: 175,
//         sellAble: true,
//         useAble: true,
//         maxAmount: 10,
//         emoji: '🍌',
//         quantity: 0,
//         description: 'A banana',
//     },
//     {
//         name: 'Grapes',
//         value: 'g',
//         price: 300,
//         sellPrice: 275,
//         sellAble: true,
//         useAble: true,
//         maxAmount: 10,
//         emoji: '🍇',
//         quantity: 0,
//         description: 'A grape',
//     }
// ];