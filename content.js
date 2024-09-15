(() => {
    console.log('Content script starting...');

    const lastMousePosition = { x: 0, y: 0 };
    let translationBoxVisible = false;

    const handleError = (error, context) => {
        console.error(`Error in ${context}:`, error);
        console.error('Stack trace:', error.stack);
    };

    window.addEventListener('error', (event) => {
        handleError(event.error, 'Global error');
    });

    window.addEventListener('unhandledrejection', (event) => {
        handleError(event.reason, 'Unhandled promise rejection');
    });

    const safeAddEventListener = (element, event, handler) => {
        element.addEventListener(event, (e) => {
            if (!e || !chrome.runtime || !chrome.runtime.id) return;
            try {
                handler(e);
            } catch (error) {
                handleError(error, `${event} handler`);
            }
        });
    };

    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    const handleMouseMove = debounce((e) => {
        if (e && typeof e.clientX === 'number' && typeof e.clientY === 'number') {
            Object.assign(lastMousePosition, { x: e.clientX, y: e.clientY });
        }
    }, 100);

    const handleMouseUp = (e) => {
        if (!e || e.target === undefined) return;

        Object.assign(lastMousePosition, { x: e.clientX, y: e.clientY });

        const translationBox = document.getElementById('quick-translator-box');
        if (translationBox && e.target && translationBox.contains(e.target)) return;

        if (translationBoxVisible) {
            removeTranslationBox();
            return;
        }

        requestAnimationFrame(() => {
            try {
                const selectedText = window.getSelection().toString().trim();
                if (selectedText) {
                    console.log('Selected text:', selectedText);
                    translateText(selectedText);
                }
            } catch (error) {
                handleError(error, 'getting selected text');
            }
        });
    };

    const removeTranslationBox = () => {
        const existingBox = document.getElementById('quick-translator-box');
        if (existingBox) {
            document.body.removeChild(existingBox);
            translationBoxVisible = false;
        }
    };

    const translateText = (text) => {
        console.log('translateText function called with:', text);
        if (!chrome.runtime || !chrome.runtime.id) {
            handleError(new Error('Extension context is invalid'), 'translateText');
            showTranslation('扩展上下文无效，请重新加载扩展。');
            return;
        }

        chrome.runtime.sendMessage({ action: "translate", text }, (response) => {
            if (chrome.runtime.lastError) {
                handleError(chrome.runtime.lastError, 'Chrome runtime');
                showTranslation(`扩展出错，请重新加载。错误信息：${chrome.runtime.lastError.message}`);
            } else if (response && response.success) {
                console.log('Translation successful:', response.translation);
                showTranslation(response.translation);
            } else {
                handleError(new Error(response ? response.error : 'Unknown error'), 'Translation');
                showTranslation(response ? response.error : '翻译失败，请重试。');
            }
        });
    };

    const showTranslation = (translatedText) => {
        try {
            removeTranslationBox();

            const translationBox = document.createElement('div');
            translationBox.id = 'quick-translator-box';
            translationBox.innerHTML = `
                <div class="qt-header">
                    翻译结果
                    <select id="qt-target-language" class="qt-settings">
                        <option value="en">英语</option>
                        <option value="fr">法语</option>
                        <option value="de">德语</option>
                        <option value="ja">日语</option>
                        <option value="zh-CHS">中文</option>
                    </select>
                </div>
                <div class="qt-content">${translatedText}</div>
            `;
            
            Object.assign(translationBox.style, {
                position: 'fixed',
                top: `${lastMousePosition.y + 10}px`,
                left: `${lastMousePosition.x + 10}px`,
                background: 'white',
                border: '1px solid #ccc',
                borderRadius: '5px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                padding: '10px',
                zIndex: '1000000',
                fontFamily: 'Arial, sans-serif',
                maxWidth: '300px',
                minWidth: '200px'
            });

            const style = document.createElement('style');
            style.textContent = `
                #quick-translator-box .qt-header {
                    font-weight: bold;
                    margin-bottom: 5px;
                    color: #333;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 5px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                #quick-translator-box .qt-content {
                    color: #666;
                    font-size: 14px;
                    line-height: 1.4;
                }
                #quick-translator-box .qt-settings {
                    font-size: 12px;
                    padding: 2px;
                }
            `;
            document.head.appendChild(style);

            document.body.appendChild(translationBox);
            translationBoxVisible = true;

            translationBox.addEventListener('contextmenu', (e) => e.preventDefault());

            const languageSelect = document.getElementById('qt-target-language');
            languageSelect.addEventListener('change', function() {
                chrome.runtime.sendMessage({
                    action: "setTargetLanguage",
                    language: this.value
                }, (response) => {
                    if (response.success) {
                        console.log('Target language updated');
                    } else {
                        handleError(new Error('Failed to update target language'), 'setTargetLanguage');
                    }
                });
            });

            chrome.runtime.sendMessage({action: "getTargetLanguage"}, (response) => {
                languageSelect.value = response.language;
            });

        } catch (error) {
            handleError(error, 'showing translation');
        }
    };

    safeAddEventListener(document, 'mousemove', handleMouseMove);
    safeAddEventListener(document, 'mouseup', handleMouseUp);

    console.log('Content script fully loaded');
})();