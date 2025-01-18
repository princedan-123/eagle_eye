/* This script uses predefined keywords to flag content in the meta element */

console.log('I am executing')
let flag = true;
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

document.addEventListener('DOMContentLoaded', function() {
    console.log('event already fired!!!')
    let metaElements = document.querySelectorAll('meta');
    metaElements = Array.from(metaElements);
    for(const metaNode of metaElements) {
        if (metaNode.hasAttribute('name')) {
            console.log(`metaNode: ${metaNode}`);
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
    console.log(`debugging titleContent ${titleContent}`);

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
        const bodyElement = document.querySelector('body');
        bodyElement.innerHTML = '';
        const warningMessage = document.createElement('section');
        warningMessage.style.cssText = `
            background-color: #103456;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            position: fixed;
            top: 0px;
            left: 0px;
            z-index: 999;
            width:100vw;
            height:100vh;
            `
        warningMessage.textContent = 'This website may contain pornographic content(s)';
        bodyElement.appendChild(warningMessage);
    }
    console.log('flag status', flag);
    console.log(`metaDescriptionContent: ${metaDescriptionContent}`);
    console.log(`metaKeywords: ${metaKeywords}`);
    console.log(`metaRating: ${metaRating}`);
    console.log(`titleContent: ${titleContent}`);
    console.log('I am still in execution!!!')
})
console.log('I have finished executing!!')