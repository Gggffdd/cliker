// Состояние игры
let coins = 0;
let perClick = 1;
let level = 1;
let lastDailyReward = 0;
let currentDay = 0;
let criticalHits = 0;
let totalCoins = 0;
let lastSave = Date.now();
let language = 'ru';
let usedPromoCodes = [];
let tapMultiplier = 1;
let telegramStars = 0;
let tgWebApp = null;

let quests = {
    telegram: { completed: false, reward: 500 },
    chat: { completed: false, reward: 1000 }
};

// Система энергии
let energy = 1000;
let maxEnergy = 1000;

// Улучшения
let upgrades = {
    click: { level: 0, cost: 1500, effect: 0 },
    auto: { level: 0, cost: 15000, effect: 0 },
    critical: { level: 0, cost: 7500, effect: 0 }
};

let autoClickerInterval;

// Промокоды
const promoCodes = {
    "GOLDENSTART": { coins: 1000, message: {ru: "Стартовый бонус: +1000 монет!", en: "Starting bonus: +1000 coins!"} },
    "CLICKER": { perClick: 1, message: {ru: "Бонус: +1 монета за клик!", en: "Bonus: +1 coin per click!"} },
    "CRYPTO": { coins: 5000, message: {ru: "Крипто бонус: +5000 монет!", en: "Crypto bonus: +5000 coins!"} }
};

// Локализация
const translations = {
    ru: {
        coins: "Монеты",
        perClick: "За клик",
        level: "Уровень",
        stars: "Звёзды",
        questsTitle: "Система заданий",
        questsDesc: "Выполняйте задания, чтобы получать бонусы",
        quest1: "Подписка на Telegram",
        quest1Desc: "Подпишитесь на наш канал и получите бонусные монеты",
        quest2: "Вход в чат",
        quest2Desc: "Присоединитесь к нашему чату и получите бонус",
        joinTelegram: "Присоединиться",
        joinChat: "Войти в чат",
        dailyTitle: "Ежедневные награды",
        dailyDesc: "Заходите ежедневно, чтобы получать награды!",
        dailyAvailable: "Сегодняшняя награда доступна!",
        claimDaily: "Получить награду",
        tabClicker: "Кликер",
        tabQuests: "Задания",
        tabUpgrades: "Улучшения",
        tabBonuses: "Бонусы",
        tabPremium: "Звёзды",
        settingsTitle: "Настройки",
        languageLabel: "Язык:",
        promoLabel: "Промокод:",
        activatePromo: "Активировать промокод",
        resetGame: "Сбросить игру",
        gameSaved: "Игра сохранена!",
        claimed: "Выполнено",
        telegramSuccess: "Вы получили бонус за подписку!",
        chatSuccess: "Вы получили бонус за вход в чат!",
        upgradesTitle: "Улучшения",
        upgradesDesc: "Улучшайте свои возможности для увеличения дохода",
        upgrade1: "Улучшение клика",
        upgrade1Desc: "Увеличивает количество монет за каждый клик",
        upgrade2: "Автокликер",
        upgrade2Desc: "Автоматически кликает за вас каждую секунду",
        upgrade3: "Критический удар",
        upgrade3Desc: "Шанс получить двойные монеты за клик",
        buyUpgrade: "Купить улучшение",
        upgradeSuccess: "Улучшение куплено!",
        notEnoughCoins: "Недостаточно монет!",
        notEnoughStars: "Недостаточно звёзд!",
        criticalHit: "КРИТИЧЕСКИЙ УДАР!",
        autoClickerActive: "Автокликер активирован!",
        noEnergy: "Недостаточно энергии!",
        energyRestored: "Энергия восстановлена!",
        premiumShop: "Магазин Звёзд",
        premiumDesc: "Покупайте уникальные предметы за звёзды из Telegram",
        item1: "Множитель тапа x2",
        item1Desc: "Удваивает доход за каждый клик навсегда",
        item2: "Золотой пакет",
        item2Desc: "+50 000 монет для вашей игры",
        item3: "Бриллиантовая энергия",
        item3Desc: "Бесконечная энергия на 24 часа",
        item4: "Бустер кликов",
        item4Desc: "+10 монет за клик на 12 часов",
        item5: "Защита от потерь",
        item5Desc: "Сохранение прогресса при сбросе",
        item6: "Профессиональный кликер",
        item6Desc: "+5 автокликеров навсегда",
        buy: "Купить",
        purchaseSuccess: "Покупка успешно завершена!",
        tgStarsError: "Ошибка получения звёзд из Telegram",
        starsUpdated: "Баланс звёзд обновлён!"
    },
    en: {
        coins: "Coins",
        perClick: "Per click",
        level: "Level",
        stars: "Stars",
        questsTitle: "Quest system",
        questsDesc: "Complete quests to get bonuses",
        quest1: "Subscribe to Telegram",
        quest1Desc: "Subscribe to our channel and get bonus coins",
        quest2: "Join the chat",
        quest2Desc: "Join our chat and get a bonus",
        joinTelegram: "Join",
        joinChat: "Join Chat",
        dailyTitle: "Daily Rewards",
        dailyDesc: "Come daily to get rewards!",
        dailyAvailable: "Today's reward is available!",
        claimDaily: "Claim Reward",
        tabClicker: "Clicker",
        tabQuests: "Quests",
        tabUpgrades: "Upgrades",
        tabBonuses: "Bonuses",
        tabPremium: "Stars",
        settingsTitle: "Settings",
        languageLabel: "Language:",
        promoLabel: "Promo Code:",
        activatePromo: "Activate Promo Code",
        resetGame: "Reset Game",
        gameSaved: "Game saved!",
        claimed: "Claimed",
        telegramSuccess: "You got bonus for subscription!",
        chatSuccess: "You got bonus for joining chat!",
        upgradesTitle: "Upgrades",
        upgradesDesc: "Upgrade your abilities to increase income",
        upgrade1: "Click Upgrade",
        upgrade1Desc: "Increases coins per click",
        upgrade2: "Auto Clicker",
        upgrade2Desc: "Automatically clicks for you every second",
        upgrade3: "Critical Hit",
        upgrade3Desc: "Chance to get double coins per click",
        buyUpgrade: "Buy Upgrade",
        upgradeSuccess: "Upgrade purchased!",
        notEnoughCoins: "Not enough coins!",
        notEnoughStars: "Not enough stars!",
        criticalHit: "CRITICAL HIT!",
        autoClickerActive: "Auto clicker activated!",
        noEnergy: "Not enough energy!",
        energyRestored: "Energy restored!",
        premiumShop: "Stars Shop",
        premiumDesc: "Buy unique items with Telegram Stars",
        item1: "Tap multiplier x2",
        item1Desc: "Doubles income per click forever",
        item2: "Gold Pack",
        item2Desc: "+50,000 coins for your game",
        item3: "Diamond Energy",
        item3Desc: "Unlimited energy for 24 hours",
        item4: "Click Booster",
        item4Desc: "+10 coins per click for 12 hours",
        item5: "Loss Protection",
        item5Desc: "Save progress on reset",
        item6: "Auto Clicker Pro",
        item6Desc: "+5 auto clickers forever",
        buy: "Buy",
        purchaseSuccess: "Purchase completed successfully!",
        tgStarsError: "Error getting stars from Telegram",
        starsUpdated: "Stars balance updated!"
    }
};

// Создание крипто-частиц
export function createParticles() {
    const cryptoParticles = document.getElementById('crypto-particles');
    cryptoParticles.innerHTML = '';
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.width = `${Math.random() * 10 + 5}px`;
        particle.style.height = particle.style.width;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particle.style.backgroundColor = `rgba(${Math.floor(Math.random() * 100) + 100}, ${Math.floor(Math.random() * 200)}, 255, ${Math.random() * 0.5 + 0.3})`;
        cryptoParticles.appendChild(particle);
    }
}

// Основные функции игры
export function initGame() {
    createParticles();
    initEventListeners();
    loadGame();
    updateQuestButtons();
}

export function initTelegramWebApp() {
    try {
        tgWebApp = window.Telegram.WebApp;
        
        tgWebApp.MainButton
            .setText(language === 'ru' ? 'Купить звёзды' : 'Buy Stars')
            .show()
            .onClick(() => {
                tgWebApp.openInvoice('https://t.me/gifteverydayyy', (status) => {
                    if (status === 'paid') {
                        updateStarsBalance();
                        showNotification(translations[language].purchaseSuccess);
                    }
                });
            });
        
        updateStarsBalance();
        
    } catch (e) {
        console.error('Telegram Web App not available:', e);
        document.getElementById('tg-stars-balance').textContent = translations[language].tgStarsError;
    }
}

// Экспортируем основные функции для использования в других модулях
export { 
    coins, 
    perClick, 
    upgrades, 
    telegramStars,
    handleCoinClick, 
    buyUpgrade, 
    claimDailyBonus,
    activatePromo,
    completeQuest,
    buyItem
};

// Остальные функции (loadGame, handleCoinClick, и т.д.) остаются такими же как в вашем исходном коде
// ... (все остальные функции из вашего скрипта)
