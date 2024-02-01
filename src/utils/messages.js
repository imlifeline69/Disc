// Messages for the RPG game

const emotes = {
    react: "<a:gaynod:1190346081133936782>",
    currency: "",
    deny: "<a:NO:1193614076023144619>",
    approve: "<a:Yes:1193614234400084068>",
    accept: "<a:Yes:1193614234400084068>",
    what: "<:whatwhat:1039206140296302592>"
}

const noPickaxe = emotes.deny + " | you dont have a pickaxe equiped or you dont have one! You need to craft one first!";
const noAxe = emotes.deny + " | you dont have an axe! You need to craft one first!";
const noCoins = emotes.deny + " | you dont have enough coins to buy this item!";

const itemNotInInventory = emotes.deny + " | you do not have that item in ur inventory, either check the shop or craft it";
const noItemInShop = emotes.deny + " | this item is not in the shop!";

const itemNotInData = emotes.deny + " | this item does not exist, please make sure you provided the right item value!"

const noItemGiven = emotes.deny + " | Please provide an item value!";

const noItemToCraft = emotes.deny + " | you dont have the items to craft this item!";
const noCraftItem = emotes.deny + " | this item is not craftable!";
const noCraftItemInShop = emotes.deny + " | this item is not in the shop!";

const equipedItem = emotes.approve + " | you have equiped the ";
const itemNotUseable = emotes.deny + " | that item is not useable!";

const craftITemsNotFound = emotes.deny + " | the craft items for this item seems corrupt, please try a diff item!"

module.exports = {emotes, noPickaxe, noAxe, noCoins, itemNotInInventory, itemNotInData, noItemInShop, noItemGiven, noItemToCraft, noCraftItem, noCraftItemInShop, equipedItem, itemNotUseable, craftITemsNotFound };