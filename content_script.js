/* This script uses predefined keywords to flag content in the meta element */

let originalContent = null;
function previewAction() {
    /* Previews the page for 10 seconds and trims the content */
    document.body.innerHTML = originalContent;
    const originalStyle = document.getElementById('eagle_ext_style_id');
    originalStyle.textContent = '';
    setTimeout(() => {
        const blockMessage = document.createElement('div');
        blockMessage.classList.add('eagle-ext-container')
        blockMessage.innerHTML = 
        `
        <div class="message">
            ⚠️ Warning: This website may contain pornographic content and has been blocked. ⚠️
        </div>
        `
        styleTextContent = 
        `
        body{
            background-color:  #103456;
            color: white;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .eagle-ext-container{
            border: 2px solid white;
            border-radius: 5px;
            width: 50vw;
            height: 50vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center
        }
        `
        document.body.innerHTML = ''; 
        document.body.appendChild(blockMessage);
        originalStyle.textContent = styleTextContent; 
    }, 5000)
}

function renderWarningPopup() {
    /* deletes the sites content and renders warning pop up */
    const bodyElement = document.querySelector('body');
    originalContent = bodyElement.innerHTML;
    bodyElement.innerHTML = '';
    const popUpContainer = document.createElement('div');
    popUpContainer.classList.add('eagle-ext-container')
    popUpContainer.innerHTML = `
        <div class='eagle-ext-message'>
            ⚠️ Warning: This website may contain pornographic content and has been restricted. ⚠️
        </div>
        <div class='eagle-ext-sub-container'>
            <div class='eagle-ext-preview'>
                <button>Preview</button>
            </div>
        </div>
    `
    const popUpStyle = document.createElement('style');
    popUpStyle.id = 'eagle_ext_style_id'
    popUpStyle.textContent = `
        body{
        background-color:  #103456;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
        }
        .eagle-ext-container{
        border: 2px solid white;
        border-radius: 5px;
        width: 50vw;
        height: 50vh;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center
        }
        .eagle-ext-sub-container{
        width: 100%;
        display:flex;
        justify-content: space-around;
        }
        `
    bodyElement.appendChild(popUpContainer);
    const head = document.querySelector('head');
    head.appendChild(popUpStyle);
    /* Adding event listners to block and preview buttons */
    const previewButton = document.querySelector('.eagle-ext-preview');
    previewButton.addEventListener('click', previewAction)

}
let flag = false;
let titleContent = null;
const metaDescriptionContent = [];
const metaRating = [];
const metaKeywords = [];
const restrictedKeywords= [
    'free porn', 'xvideos', 'porn', 'porno movies',
    'porn movies', 'tube videos', 'xxx', 'hot pussy',
    'sex videos', 'sexy girls', 'free sex', 'sex movies',
    'porno', 'sex'
]
/* getting meta nodes name-content values */
function analyzeMetaTags() {
    let metaElements = document.querySelectorAll('meta');
    metaElements = Array.from(metaElements);
    for(const metaNode of metaElements) {
        if (metaNode.hasAttribute('name')) {
            const name = metaNode.getAttribute('name');
            const nameContent = name.toLowerCase();
            if (nameContent === 'description' && metaNode.hasAttribute('content')) {
                const descriptionContent = metaNode.getAttribute('content').toLowerCase();
                metaDescriptionContent.push(descriptionContent);
            }
            else if (nameContent === 'rating' && metaNode.hasAttribute('content')) {
                const ratingContent = metaNode.getAttribute('content').toLowerCase();
                metaRating.push(ratingContent);
            }
            else if (nameContent === 'keywords' && metaNode.hasAttribute('content')) {
                const keywordsContent = metaNode.getAttribute('content').toLowerCase();
                metaKeywords.push(keywordsContent);
            }
        }
    }
    const titleNode = document.querySelector('head title');
    titleContent = titleNode.textContent;

    /* setting the flag variable */

    if(metaRating){
        for(const rating of metaRating) {
            if (rating.includes('rta')) {
                flag = true
                break; 
            };
        }
    }
    if (!flag) {
        for (const keyword of restrictedKeywords) {
            if(titleContent.includes(keyword)) {
                flag = true;
                break;
            }
            if(metaDescriptionContent.includes(keyword)) {
                flag = true;
                break;
            }
            if(metaKeywords.includes(keyword)) {
                flag = true;
                break;
            }
        }
    }

    /* action to take if the website is flagged */
    /* 1. send a message to the background script containing the value of the flag
    variable to block the nework request.*/


    /* A fallback action to modify the body of the website if it is flagged */
    
    if(flag) {
        renderWarningPopup();
        chrome.runtime.sendMessage({'message': 'hello'}, (response) => {
            console.log('response', response);
        })
    }
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', analyzeMetaTags())
}
else{
    analyzeMetaTags();
}