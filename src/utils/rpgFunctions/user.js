const { Database } = require('quickmongo');
const { craftItems } = require('../items.js');
const db = new Database(process.env.MONGO_URL);
db.connect();

const getUser = async (userID) => {
    let usr = `user_${userID}`;
    let user = await db.get(usr);

    if (!user) {
        await db.set(usr, { balance: 0, bank: 0, inventory: [], });
        user = await db.get(usr);
    }
    return user;
};

const getInventory = async (userID) => {
    let usr = `user_${userID}`;
    let user = await db.get(usr);

    if (!user) {
        await db.set(usr, { balance: 0, bank: 0, inventory: [], });
        user = await db.get(usr);
    }
    let inventory = user.inventory ? user.inventory : [];
    return inventory;
};

const getSettings = async (userID) => {
    let usr = `user_${userID}`;
    let user = await db.get(usr);

    if (!user) {
        await db.set(usr, { balance: 0, bank: 0, inventory: [], });
        user = await db.get(usr);
    }
    let settings = user.settings ? user.settings : { messageType: 'embed', color: '6f6fff' };
    return settings;
};

const getPickaxe = async (userID) => {
    let usr = `user_${userID}`;
    let user = await db.get(usr);

    if (!user) {
        await db.set(usr, { balance: 0, bank: 0, inventory: [], });
        user = await db.get(usr);
    }
    let pickaxe = user.current.pickaxe;
    return pickaxe;
};

const getOres = async (userID) => {
    let usr = `user_${userID}`;
    let user = await db.get(usr);

    if (!user) {
        await db.set(usr, { balance: 0, bank: 0, inventory: [], });
        user = await db.get(usr);
    }
    let ores = user.ores ? user.ores : [];
    return ores;
};

const getOre = async (userID, oreV) => {
    let usr = `user_${userID}`;
    let user = await db.get(usr);

    if (!user) {
        await db.set(usr, { balance: 0, bank: 0, inventory: [], });
        user = await db.get(usr);
    }
    let ores = user.ores ? user.ores : [];
    let ore = ores.find(o => o.value === oreV.value);
    return ore;
};

const getCraftItems = async (item) => {
    let craftITEMS = item.craftItems;
    if (craftITEMS) {
        return craftITEMS
    } else {
        return null
    }
};

const getCraftItem = async (craftItemV) => {
    let craftItemsV = craftItems ? craftItems : [];
    let craftItem = craftItemsV.find(c => c.value === craftItemV);
    return craftItem;
};

const getCraftItemAmount = async (craftItemV) => {
    let craftItemsV = craftItems ? craftItems : [];
    let craftItem = craftItemsV.find(c => c.value === craftItemV.value);
    return craftItem.amount;
};

const getCraftItemName = async (craftItemV) => {
    let craftItemsV = craftItems ? craftItems : [];
    let craftItem = craftItemsV.find(c => c.value === craftItemV.value);
    return craftItem.name;
};

const getCraftItemValue = async (craftItemV) => {
    let craftItemsV = craftItems ? craftItems : [];
    let craftItem = craftItemsV.find(c => c.value === craftItemV.value);
    return craftItem.value;
};

const checkInventory = async (inv, item) => {
    let inventory = inv ? inv : [];
    let invToCheck;
    if (item.type === 'wooden') {
        invToCheck = inventory.wooden
        if(!invToCheck) return null;
    } else if (item.type === 'ores') {
        invToCheck = inventory.ores
        if (!invToCheck) return null;
    }
    
    checkedItem = invToCheck.find(i => i.value === item.value)
    return checkedItem
};
const checkInventoryQuantity = async (inv, item) => {
    let inventory = inv ? inv : [];
    let invToCheck;
    if (item.type === 'wooden') {
        invToCheck = inventory.wooden
        if(!invToCheck) return null;
    } else if (item.type === 'ores') {
        invToCheck = inventory.ores
        if (!invToCheck) return null;
    }
    
    checkedItem = invToCheck.find(i => i.value === item.value)
    return checkedItem
    // Need to make this check quantity

};

const checkIfCraftAble = async (item) => {
    craftAble = item.craftAble;
    return craftAble;
}
const getItem = async (itemValue, type) => {
    if (type === 'craft') {
        let items = craftItems;
        let item = items.find(i => i.value === itemValue);
        return item;
    }
}

const deductInvQuantity = async (user, item, amount) => {
    let inv = await db.get(`user_${user}.inventory`)
    if(item.type === "wooden") {
        itemData = inv.wooden.find(it => it.value === item.value)
    } else if (item.type === "ores") {
        itemData = inv.ores.find(it => it.value === item.value)
    }
    if (itemData.quantity < amount ) return;
    if ((itemData.quantity - amount) < 0) {
        itemData.quantity = 0
    } else {
        itemData.quantity -= amount
    }
    await db.set(`user_${user}.inventory`, inv)
}


module.exports = { getUser, getInventory, getSettings, getPickaxe, getOres, getOre, getItem, getCraftItems, getCraftItem, getCraftItemAmount, getCraftItemName, getCraftItemValue, checkInventory, checkIfCraftAble, deductInvQuantity , checkInventoryQuantity}