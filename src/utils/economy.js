const economyConfig = {
    dailyAmount: 100,
    workAmount: [50, 200],
    workCooldown: 10000,
    weeklyAmount: 5000,
}

const work = [
    'a programmer',
    'a doctor',
    'a teacher',
    'a lawyer',
    'a police',
    'a nurse',
    'a chef',
    'a pilot',
    'a dentist',
    'a mechanic',
    'a farmer',
    'a scientist',
    'a soldier',
    'a singer',
    'a dancer',
    'a model',
    'a designer',
    'a writer',
    'a journalist',
    'a photographer',
    'a painter',
    'a musician',
    'a driver',
    'a cleaner',
    'a cashier',
    'a waiter',
    'a waitress',
    'a receptionist',
    'a secretary',
    'a businessman',
    'a businesswoman',
    'a cashie'
]

const workRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomWorker = () => {
    return work[Math.floor(Math.random() * work.length)];
}

const workMessage = (workReward, work) => {
    let workMessages = [
        `You worked as ${work} and yarned **${workReward}** coins!`,
        `Working as ${work} earned you **${workReward}** coins!`,
        `Imagine working as ${work} and earning **${workReward}** coins!`,
        `You just completed a task as **${work}** and earned **${workReward} coins**!`,
        `Congratulations! You worked as **${work}** and earned **${workReward} coins**!`,
        `You've been working hard as **${work}** and earned **${workReward} coins**!`
    ];
    return workMessages[Math.floor(Math.random() * workMessages.length)];
}
module.exports = { economyConfig, workRandom, workMessage, randomWorker }