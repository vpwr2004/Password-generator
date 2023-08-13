let inputSlider=document.querySelector("[data-lengthSlider]");
let lengthDisplay=document.querySelector("[data-lengthNumber]");

const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const symbolsCheck=document.querySelector("#symbols");
const numbersCheck=document.querySelector("#numbers");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols='~`!@#$%^&*()_-=+<>?/;:{[}]|';
let password="";

let passwordLength=10;

let checkCount=0;
handleSlider();
setIndicator("#ccc");
// set strength circle color to grey 

// set pass length 
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"% 100%"

}

function setIndicator(color) {
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}


function getRndInteger(min,max) {
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97,123));
}
 

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbols() {
    let randNum=getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}


function calcStrength() {
    let hasUpper= false;
    let hasLower= false;
    let hasNum= false;
    let hasSym= false;

    if(uppercaseCheck.checked) hasUpper= true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum= true;
    if(symbolsCheck.checked) hasSym= true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8)
        setIndicator("#0f0");
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=6)
        setIndicator("#ff0");
    else    
        setIndicator("#f00");
}

// copy function
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="failed";
    }
    // to make copy text visible
    copyMsg.classList.add("active");

    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}

// function handelCheckBoxChange(){
//     checkCount=0;
//     allCheckBox.forEach((checkbox)=>{
//         if(checkbox.checked)
//             checkCount++;
//     })
//     // special condition  
//     if(passwordLength<checkCount){
//         passwordLength=checkCount;
//         handleSlider();
//     }
// }

// allCheckBox.forEach((checkBox)=>{
//     checkBox.addEventListener('change',handelCheckBoxChange())
// })
// console.log(checkCount);

uppercaseCheck.addEventListener('change',()=>{
    if(uppercaseCheck.checked)
        checkCount++;
});
lowercaseCheck.addEventListener('change',()=>{
    if(lowercaseCheck.checked)
        checkCount++;
});
numbersCheck.addEventListener('change',()=>{
    if(numbersCheck.checked)
        checkCount++;
});
symbolsCheck.addEventListener('change',()=>{
    if(symbolsCheck.checked)
        checkCount++;
});



inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})
   
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
        copyContent();
})


generateBtn.addEventListener('click',()=>{
    // none of the checkbox are selected
    if(checkCount<=0) 
        return;
    if(passwordLength< checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
    // finding new password

    // remove old password

    password='';

    // find which checkboxex are checked 

    
    let funArr=[];
    if(uppercaseCheck.checked)
        funArr.push(generateUpperCase);
    if(lowercaseCheck.checked)
        funArr.push(generateLowerCase);
    if(numbersCheck.checked)
        funArr.push(generateRandomNumber);
    if(symbolsCheck.checked)
        funArr.push(generateSymbols);
    // compulsory addition 
    for(let i=0; i<funArr.length; i++){
        password+=funArr[i]();

    }
    for(let i=funArr.length; i<passwordLength; i++){
        let randIdx=getRndInteger(0,funArr.length);
        password+=funArr[randIdx]();
    }
    // suffle the password 
    password=sufflePassword(Array.from(password));
    // show password 
    passwordDisplay.value=password;
    // cal strength 
    calcStrength();

});


function sufflePassword(array) {
    // fisher yates method 
    for(let i=array.length-1; i>=0; i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}

