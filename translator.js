console.log('Translator script loading...');

if (typeof CryptoJS === 'undefined') {
    console.error('CryptoJS is not defined. Make sure crypto-js.min.js is loaded correctly.');
} else {
    console.log('CryptoJS is defined and available');
}

function translateText(text, from, to) {
    console.log('translateText called with:', { text, from, to });
    const appKey = '13a431dfcc12c491';
    const key = 'TqGX88YM1KNh60peUGFeDN3NZ70InVmY';
    const salt = new Date().getTime();
    const curtime = Math.round(new Date().getTime() / 1000);
    const str1 = appKey + truncate(text) + salt + curtime + key;
    const sign = CryptoJS.SHA256(str1).toString(CryptoJS.enc.Hex);

    console.log('Prepared API request parameters:', { appKey, salt, curtime, sign });

    const url = 'https://openapi.youdao.com/api';
    const params = new URLSearchParams({
        q: text,
        appKey: appKey,
        salt: salt,
        from: from,
        to: to,
        sign: sign,
        signType: 'v3',
        curtime: curtime,
    });

    console.log('Sending API request to:', url);
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
    })
    .then(response => {
        console.log('API response status:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('API response data:', data);
        if (data.translation && data.translation.length > 0) {
            return data.translation[0];
        } else {
            throw new Error(data.errorCode || '翻译失败');
        }
    })
    .catch(error => {
        console.error('Translation API error:', error);
        throw error;
    });
}

function truncate(q) {
    var len = q.length;
    if(len <= 20) return q;
    return q.substring(0, 10) + len + q.substring(len-10, len);
}

// 导出函数以供background.js使用
window.translateText = translateText;

console.log('Translator script fully loaded');