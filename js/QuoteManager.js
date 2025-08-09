const QuoteManager = (() => {
    const QUOTES = [ "The secret of your future is hidden in your daily routine.", "The sun is a daily reminder that we too can rise again from the darkness.", "With the new day comes new strength and new thoughts.", "Your morning sets up the success of your day.", "Success is the sum of small efforts, repeated day in and day out." ];
    
    const DOM = {
        subtitle: document.getElementById('subtitle'),
    };

    const getTodayString = () => new Date().toISOString().split('T')[0];

    const handle = () => {
        const appData = DataManager.getAppData();
        const todayStr = getTodayString();
        if (appData.lastQuoteDate !== todayStr) {
            appData.currentQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
            appData.lastQuoteDate = todayStr;
            DataManager.save();
        }
        if (DOM.subtitle) DOM.subtitle.textContent = appData.currentQuote;
    };

    return { init: handle };
})();
