console.log('Background script starting...');

const state = {
  targetLanguage: 'en' // 默认目标语言为英语
};

const initializeBackgroundScript = () => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Received message in background:', request);
    if (request.action === "translate") {
      handleTranslateRequest(request, sendResponse);
    } else if (request.action === "setTargetLanguage") {
      state.targetLanguage = request.language;
      console.log('Target language set to:', state.targetLanguage);
      sendResponse({success: true});
    } else if (request.action === "getTargetLanguage") {
      sendResponse({language: state.targetLanguage});
    }
    return true; // 保持消息通道开放以进行异步响应
  });

  // 添加错误处理
  chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
  });

  chrome.runtime.onSuspend.addListener(() => {
    console.log('Extension suspended');
  });

  // 添加全局错误处理
  window.onerror = (message, source, lineno, colno, error) => {
    console.error('Global error:', message, 'at', source, lineno, colno, error);
  };

  console.log('Background script fully loaded');
};

const handleTranslateRequest = async (request, sendResponse) => {
  console.log('Received translate request, calling translateText');
  const from = detectLanguage(request.text);
  const to = request.targetLanguage || state.targetLanguage;
  try {
    const translation = await translateText(request.text, from, to);
    console.log('Translation successful:', translation);
    sendResponse({success: true, translation: translation});
  } catch (error) {
    console.error('Translation error:', error);
    sendResponse({success: false, error: error.message});
  }
};

const detectLanguage = (text) => {
  return /^[\u4e00-\u9fa5]+$/.test(text) ? 'zh-CHS' : 'auto';
};

// 在初始化时从存储中加载目标语言
chrome.storage.sync.get('targetLanguage', (data) => {
  if (data.targetLanguage) {
    state.targetLanguage = data.targetLanguage;
    console.log('Loaded target language from storage:', state.targetLanguage);
  }
});

// 直接调用初始化函数
initializeBackgroundScript();