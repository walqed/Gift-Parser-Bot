export const config = {
    
    telegram: {
        botToken: '8432043463:AAHHJ_pLmv-pmWQJj9PG-11_ja7xB4sCzfs', //Поменяйте на токен вашего бота
        chatId: '7953256777', //Поменяйте на ваш chatId
    },

    
    api: {
        url: 'https://rs-gifts.tonnel.network/api/pageGifts',
        
        // Поменяйте userAuth на ваш актуальный
        userAuth: "user=%7B%22id%22%3A7953256777%2C%22first_name%22%3A%22%29%29%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22scofildddd%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2Fn5FzA7--IlwhFfHGSgz0cQL568cnBfBaoMiSQKmo3LMt-9c_PFjA_QcAnow2U50D.svg%22%7D&chat_instance=1528599834266422050&chat_type=sender&auth_date=1756289365&signature=Bu3Z8bWXPOEG7Hnff0aXDWE3AaSMpMtW8xLVAlCNoi9ISsQghdLxB04uK6PM4QVyAaJMtksbmM3OrrYGonFvCQ&hash=2a7e2ec2c3340b446d49af7fe687fa2a0199facd85d90aeef521ee4d9518af41",
        
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