const app = document.createElement('div');
app.id = 'freshman-ai-root';
document.body.appendChild(app);

// Load your React bundle (main.js or whatever your build output is called)
const script = document.createElement('script');
script.src = chrome.runtime.getURL('main.js');
document.body.appendChild(script);