import axios from "axios";
import readline from 'readline';

import { config } from './config.js';

let maxPriceFilter = 0;
let modelFilter = '';
let backdropFilter = '';
let lastProcessedGiftId = null;
let processedListings = new Set();
let isFirstRun = true;

const sendTelegramNotification = async (message) => {
    const { botToken, chatId } = config.telegram;

    if (!botToken || !chatId || botToken === 'ВАШ_ТОКЕН_БОТА') {
        console.error('>> ОШИБКА: Токен бота или ID чата не настроены в файле config.js!');
        return;
    }
    const TELEGRAM_API = `https://api.telegram.org/bot${botToken}/sendMessage`;
    try {
        await axios.post(TELEGRAM_API, {
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML',
        });
    } catch (error) {
        let errorMessage = '>> Ошибка при отправке уведомления в Telegram: ';
        if (error.response) {
            errorMessage += `Статус ${error.response.status}, Ответ: ${error.response.data.description}`;
        } else if (error.request) {
            errorMessage += 'Ответ от сервера Telegram не получен.';
        } else {
            errorMessage += error.message;
        }
        console.error(errorMessage);
    }
};

const getGifts = async () => {
    try {
        const response = await axios({
            method: 'post',
            maxBodyLength: Infinity,
            url: config.api.url,
            headers: config.api.headers,
            data: {
                "page": 1,
                "limit": 30,
                "sort": "{\"message_post_time\":-1,\"gift_id\":-1}",
                "filter": "{\"price\":{\"$exists\":true},\"buyer\":{\"$exists\":false},\"asset\":\"TON\"}",
                "ref": 0,
                "price_range": null,
                "user_auth": config.api.userAuth
            }
        });
        return response.data;
    } catch (error) {
        let errorMessage = '>> Ошибка при получении данных: ';
        if (error.response) {
            errorMessage += `Сервер ответил с ошибкой ${error.response.status}. Возможно, ваш userAuth устарел.`;
        } else if (error.request) {
            errorMessage += 'Не удалось подключиться к API.';
        } else {
            errorMessage += error.message;
        }
        console.error(errorMessage);
        throw error;
    }
};

const createDetailedMessage = (gift) => {
    const directLink = `https://t.me/tonnel_network_bot/gift?startapp=${gift.gift_id}`;
    const messageParts = [
        `<b>🎁 НОВЫЙ ПОДАРОК НАЙДЕН!</b>\n`,
        `<b>📝 Название:</b> ${gift.name || 'Не указано'}`,
        `<b>🏷️ Модель:</b> ${gift.model || 'Не указана'}`,
        `<b>🎨 Фон:</b> ${gift.backdrop || 'Не указан'}`,
        `<b>#️⃣ ID подарка:</b> <code>${gift.gift_id}</code>`,
        `<b>#️⃣ Номер подарка:</b> <code>${gift.gift_num || 'Не указан'}</code>`,
        `<b>💰 Цена:</b> ${gift.price || 'Не указана'} ${gift.asset || ''}\n`,
        `<b>🛒 <a href="${directLink}">КУПИТЬ СЕЙЧАС</a></b>`
    ];
    const activeFilters = [];
    if (maxPriceFilter > 0) activeFilters.push(`цена до ${maxPriceFilter} TON`);
    if (modelFilter) activeFilters.push(`модель "${modelFilter}"`);
    if (backdropFilter) activeFilters.push(`фон "${backdropFilter}"`);
    if (activeFilters.length > 0) {
        messageParts.push(`\n<i>🔍 Сработавшие фильтры: ${activeFilters.join(', ')}</i>`);
    }
    return messageParts.join('\n');
};

const mainLogic = async () => {
    try {
        const responseData = await getGifts();
        const currentGifts = Array.isArray(responseData) ? responseData : (responseData?.data?.gifts || []);
        
        if (currentGifts.length === 0) return;

        if (isFirstRun) {
            currentGifts.forEach(gift => processedListings.add(`${gift.gift_id}-${gift.price}`));
            lastProcessedGiftId = currentGifts[0].gift_id;
            isFirstRun = false; 
            let startupMessage = '✅ Бот успешно запущен. Активные фильтры:';
            const activeFilters = [];
            if (maxPriceFilter > 0) activeFilters.push(`цена до ${maxPriceFilter} TON`);
            if (modelFilter) activeFilters.push(`модель "${modelFilter}"`);
            if (backdropFilter) activeFilters.push(`фон "${backdropFilter}"`);
            if (activeFilters.length > 0) {
                startupMessage += `\n- ${activeFilters.join('\n- ')}`;
            } else {
                startupMessage = '✅ Бот успешно запущен. Отслеживаю все новые подарки.';
            }
            await sendTelegramNotification(startupMessage);
            return;
        }
        
        const lastKnownIndex = currentGifts.findIndex(gift => gift.gift_id === lastProcessedGiftId);
        let candidateGifts = (lastKnownIndex === -1) ? currentGifts : currentGifts.slice(0, lastKnownIndex);
        
        const newGifts = candidateGifts.filter(gift => !processedListings.has(`${gift.gift_id}-${gift.price}`));
        
        if (newGifts.length === 0) {
             lastProcessedGiftId = currentGifts[0].gift_id;
             return;
        }
        
        newGifts.forEach(gift => processedListings.add(`${gift.gift_id}-${gift.price}`));
        
        const giftsToNotify = newGifts.filter(gift => {
            const priceMatch = (maxPriceFilter === 0 || gift.price <= maxPriceFilter);
            const modelMatch = !modelFilter || (gift.model && gift.model.toLowerCase().includes(modelFilter));
            const backdropMatch = !backdropFilter || (gift.backdrop && gift.backdrop.toLowerCase().includes(backdropFilter));
            return priceMatch && modelMatch && backdropMatch;
        });

        if (giftsToNotify.length > 0) {
            for (const gift of giftsToNotify) {
                await sendTelegramNotification(createDetailedMessage(gift));
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        lastProcessedGiftId = currentGifts[0].gift_id;
        
        if (processedListings.size > 2000) {
            const listingsArray = Array.from(processedListings);
            processedListings.clear();
            listingsArray.slice(-1000).forEach(id => processedListings.add(id));
        }

    } catch (error) {
        console.error(">> ❌ Ошибка в главном цикле:", error.message);
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
};

async function startBot() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const askQuestion = (query) => new Promise(resolve => rl.question(query, resolve));

    try {
        const priceInput = await askQuestion('Введите максимальную цену (TON, Enter - все): ');
        const parsedPrice = parseFloat(priceInput.trim());
        if (!isNaN(parsedPrice) && parsedPrice > 0) {
            maxPriceFilter = parsedPrice;
            console.log(`✅ Фильтр по цене: до ${maxPriceFilter} TON`);
        } else {
            console.log('✅ Фильтр по цене не используется');
        }

        const modelInput = await askQuestion('Введите модель для поиска (Enter - все): ');
        modelFilter = modelInput.trim().toLowerCase();
        if (modelFilter) {
            console.log(`✅ Фильтр по модели: "${modelFilter}"`);
        } else {
            console.log('✅ Фильтр по модели не используется');
        }

        const backdropInput = await askQuestion('Введите фон для поиска (Enter - все): ');
        backdropFilter = backdropInput.trim().toLowerCase();
        if (backdropFilter) {
            console.log(`✅ Фильтр по фону: "${backdropFilter}"`);
        } else {
            console.log('✅ Фильтр по фону не используется');
        }
        
        console.log("\n>> 🚀 Запускаю мониторинг подарков...");
        await mainLogic(); 
        setInterval(mainLogic, config.app.pollingInterval);
        
    } catch (error) {
        console.error('>> ❌ Ошибка при настройке:', error);
    } finally {
        rl.close();
    }
}

startBot().catch(error => {
    console.error('>> ❌ Критическая ошибка при запуске:', error);
    process.exit(1);
});