document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('targetLanguage');
  const saveButton = document.getElementById('save');

  // 加载当前设置
  chrome.runtime.sendMessage({action: "getTargetLanguage"}, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Error getting target language:', chrome.runtime.lastError);
      return;
    }
    select.value = response.language;
  });

  saveButton.addEventListener('click', () => {
    const newLanguage = select.value;
    chrome.storage.sync.set({targetLanguage: newLanguage}, () => {
      if (chrome.runtime.lastError) {
        console.error('Error saving language to storage:', chrome.runtime.lastError);
        alert('保存设置失败');
        return;
      }
      console.log('Language saved:', newLanguage);
      chrome.runtime.sendMessage({action: "setTargetLanguage", language: newLanguage}, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error setting target language:', chrome.runtime.lastError);
          alert('保存设置失败');
        } else if (response && response.success) {
          alert('设置已保存');
        } else {
          alert('保存设置失败');
        }
      });
    });
  });
});