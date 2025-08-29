export const config = {
    
    telegram: {
        botToken: '', //Поменяйте на токен вашего бота
        chatId: '', //Поменяйте на ваш chatId
    },

    
    api: {
        url: 'https://rs-gifts.tonnel.network/api/pageGifts',
        
        // Поменяйте userAuth на ваш актуальный
        userAuth: "",
        
        headers: { 
            'accept': '*/*', 
            'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7', 
            'cache-control': 'no-cache', 
            'content-type': 'application/json', 
            'origin': 'https://marketplace.tonnel.network', 
            'pragma': 'no-cache', 
            'priority': 'u=1, i', 
            'referer': 'https://marketplace.tonnel.network/', 
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'
        }
    },

    
    app: {
        pollingInterval: 3 * 1000, // Интервал проверки в миллисекундах (3 секунды)
    }
};