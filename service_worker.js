/*This module handles all background processes */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(`content message ${message}`);
    sendResponse({reply: 'hi i am service worker'});
    console.log(`I am sender: ${sender}`)
})