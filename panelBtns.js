let heder = document.querySelector('header')
let headBtns = document.querySelector('.headBtns')
let responseButton = document.querySelector('.responseButton')
let btnsDiv = document.createElement('DIV')
let btnsUl = document.createElement('UL')

heder.parentNode.insertBefore(btnsDiv, heder.nextSibling) // Ubacuje element btnsDiv posle heder elementa

btnsDiv.classList.add('hoverDiv')
btnsUl.classList.add('hoverBtns')
btnsDiv.appendChild(btnsUl)

let nizBtns = ['POČETNA', 'slide','galerija', 'prodaja', 'video', 'saradnici', 'reference']
let nizHref = ['index', 'slide', 'galerijaPanel', 'prodajaPanel', 'videoPanel', 'saradniciPanel', 'referencePanel']
let counterShowHide = 0

for(let i=0; i<nizBtns.length; i++) {
    
    let btnLi = document.createElement('LI')

    btnLi.innerHTML = `<button class="headerBtns" onclick="location.href = '${nizHref[i]}.html';">${nizBtns[i]}</button>`

    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        btnsUl.appendChild(btnLi)

    } else {
        headBtns.appendChild(btnLi) 
    }
   
}

let responseLi = document.createElement('LI')
responseLi.innerHTML = `<button class="responseBtn" id="menuBtn">MENU</button>`
responseButton.appendChild(responseLi)

// console.log(window.innerWidth)

let w = window.innerWidth

if(w < 455) {
    //console.log('jeste')
    //console.log(counterShowHide)
    heder.addEventListener('click', event => {
        //console.log(event)
        // console.log(event.path[0].id)
        let btnId = event.path[0].id
        //console.log(window.innerHeight)
        //console.log(window.innerWidth)
        if(btnId.includes('menuBtn')) {
            counterShowHide++

            if(counterShowHide === 1) {   
                //console.log(counterShowHide)             
                // document.querySelector('.hoverBtns').style.display = "flex" 
                document.querySelector('.hoverDiv').style.marginTop = "0px"    
            } else if (counterShowHide === 2)  {
                //console.log(counterShowHide)
                // document.querySelector('.hoverBtns').style.display = "none"
                document.querySelector('.hoverDiv').style.marginTop = "-280px"
                counterShowHide = 0
            }       
    
        }
            
    })
}