let containerGalerija = document.getElementById('containerGalerija')
let imageHolder = document.querySelector('.imageHolder')
let popUpImgHolder = document.querySelector('.popUpImgHolder')
let counterPopUpImg = 0
let loadedImages = 0
let nizUrlSlika = []
let indexTrenutneSlike = 0
let urlSledeceSlike
let galerijaFolder

containerGalerija.style.height = `${document.body.offsetHeight - document.body.offsetHeight * 7 /100}px`

popUpImgHolder.style.display = "none"

//////////////////////////////////////////////////////////////////
let targetClass
let targetDiv
var target = document.getElementById('popUpObserver');

var observer = new MutationObserver(function(mutations) {

    mutations.forEach(function(mutation) {
        // console.log(mutation.type);
        // console.log(mutation)
        // console.log(mutation.removedNodes.length)

        if(mutation.removedNodes.length == 0) {

        // console.log(mutation.addedNodes[0].nodeValue = "slikaVeca")
            if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                targetClass = mutation.addedNodes[0].nodeValue = "mobSlikaVeca"
            } else {
                targetClass = mutation.addedNodes[0].nodeValue = "slikaVeca"
            }                        
            targetDiv = document.querySelector(`.${targetClass}`)
            targetDiv.tabIndex = "-1"
            targetDiv.focus()

            targetDiv.addEventListener('keydown', event => {
                console.log(event.key)
                if(event.key === "ArrowRight") {
                    document.getElementById('btnRight').click()
                } else if (event.key === "ArrowLeft") {
                    document.getElementById('btnLeft').click()
                } else if (event.key === "Escape") {
                    document.getElementById('btnExit').click()
                }
            })
        }
    });
});

var config = {
// attributes: true,
childList: true,
// characterData: true
};

observer.observe(target, config);
// observer.disconnect()

////////////////////////////////////

let tumbDivKvadratura = 160*130
let counterUrlSlika = ((containerGalerija.offsetHeight * (containerGalerija.offsetWidth * 93 / 100)) / tumbDivKvadratura)
let imgsToLoad = Math.round(counterUrlSlika)

//console.log(containerGalerija.scrollHeight)
//console.log(containerGalerija.scrollTop)
//console.log(containerGalerija.clientHeight)
//(containerGalerija.scrollHeight - containerGalerija.scrollTop === containerGalerija.clientHeight) // Provera da li je scroll dosao do kraja

db.collection('galerijaKategorije')
.get()
.then(snapshot => {
    if(!snapshot.empty) {
        let allDocs = snapshot.docs
        allDocs.forEach(x => {
            let kategorije = x.data()
            
            nameCategory = kategorije.name.charAt(0).toUpperCase() + kategorije.name.slice(1)

            /*
            let tumbImg = document.createElement('IMG')
            let tumbSpan = document.createElement('SPAN')
            let tumbDiv = document.createElement('DIV')

            tumbDiv.setAttribute('class', 'tumbDiv')

            tumbSpan.innerHTML = nameCategory
            tumbImg.setAttribute('id', kategorije.id)
            tumbImg.setAttribute('class', 'holderImg')
            tumbImg.setAttribute('src', kategorije.tumbUrl)

            tumbDiv.appendChild(tumbImg)
            tumbDiv.appendChild(tumbSpan)
            imageHolder.appendChild(tumbDiv)
            */           

            let tumbDiv = document.createElement('DIV')
            let tumbSpan = document.createElement('SPAN')

            tumbDiv.setAttribute('class', 'tumbDiv')
            tumbSpan.innerHTML = nameCategory
            tumbSpan.setAttribute('class', 'spanTumbGalerija')
            tumbDiv.setAttribute('id', kategorije.id)
            tumbDiv.setAttribute('class', 'holderImg')
            tumbDiv.style.backgroundImage = `url("${kategorije.tumbUrl}")`

            console.log(kategorije.tumbUrl)
            tumbDiv.appendChild(tumbSpan)
            imageHolder.appendChild(tumbDiv)

        })
    }
})
.then(function() {
    let galerijaBtns = document.querySelectorAll('.holderImg')

        galerijaBtns.forEach(btn =>{
            btn.addEventListener('click', event => {
                                
                // console.log(event)
                // console.log(event.path[1].id)
                imageHolder.innerHTML = ""
                let path = event.path[1].id // promenjeno 0 -> 1
                // console.log(loadedImages)
                // console.log(imgsToLoad)
                galerija(path, loadedImages, imgsToLoad)

                containerGalerija.addEventListener('scroll', event => {
                    //console.log(containerGalerija.scrollHeight - containerGalerija.scrollTop)
                    //console.log(containerGalerija.scrollHeight)
                    //console.log(containerGalerija.scrollTop)
                    //console.log(containerGalerija.clientHeight)
                    
                    if((containerGalerija.scrollHeight - containerGalerija.scrollTop === containerGalerija.clientHeight)) {
                        loadedImages = imgsToLoad
                        imgsToLoad = imgsToLoad + Math.round(counterUrlSlika)
                        // console.log(loadedImages)
                        // console.log(imgsToLoad)
                        galerija(path,loadedImages, imgsToLoad)                                     
                    }
                })
            })
        })
})

function galerija(folderSlike, counterImgs, counterLoadedImgs) {
    
    galerijaFolder = folderSlike

    db.collection(`${folderSlike}`)
    .orderBy('datum', 'desc')
    .get()
    .then(snapshot => {
        if(!snapshot.empty) {
            let allDocs = snapshot.docs
            allDocs.forEach((x, y )=> {
                let slike = x.data()

                let frameDiv = document.createElement('DIV')
                let slikaImg = document.createElement('IMG')
                let delBtnImg = document.createElement('BUTTON')

                if(y >= counterImgs && counterImgs <= counterLoadedImgs) {
                    frameDiv.setAttribute('class', `frameDiv`)
                    delBtnImg.textContent = "obriši"
                    delBtnImg.setAttribute('class', 'delBtnImg')
                    slikaImg.setAttribute('class', 'slikaImg')
                    slikaImg.setAttribute('src', slike.downLink)
                    frameDiv.appendChild(slikaImg)
                    frameDiv.appendChild(delBtnImg)                        
                    imageHolder.appendChild(frameDiv)
                    counterImgs++
                }

                if(localStorage.getItem('curT') === null) {
                    delBtnImg.classList.add('removeLi')
                } else {
                    delBtnImg.classList.remove('removeLi')
                }

                delBtnImg.addEventListener('click', event => {
                    db.collection(`${urlSlike}`).doc(`${slike.name}`).delete()

                    let deleteRef = storage.ref().child(`${urlSlike}/${slike.name}`)                            
                    deleteRef.delete()
                    frameDiv.remove()
                    // console.log(slike.name)
                })

                slikaImg.addEventListener('click', event => {
                    counterPopUpImg++
                
                    if(counterPopUpImg === 1) {
                        console.log(counterPopUpImg)
                        imageHolder.style.display = 'none'
                        popUpImgHolder.style.display = 'flex'

                        createFullScreenImg(event.target.currentSrc)                            
                    }                      
                })
            })
        }
    })
}

function createFullScreenImg(urlSlike) {
    console.log(imgsToLoad)

    let newImg = new Image()
    newImg.src = urlSlike
    
    curWidth = newImg.width
    // console.log(curWidth)
    curHeight = newImg.height
    // console.log(curHeight)

    let klikImg = document.createElement('DIV')
    klikImg.style.backgroundImage = `url('${urlSlike}')`

    let btnRight = document.createElement('IMG')
    btnRight.setAttribute('class', 'navBtns')
    btnRight.setAttribute('id', 'btnRight')
    btnRight.setAttribute('src', 'imgs/imgRight.png')

    let btnLeft = document.createElement('IMG')
    btnLeft.setAttribute('class', 'navBtns')
    btnLeft.setAttribute('id', 'btnLeft')
    btnLeft.setAttribute('src', 'imgs/imgLeft.png')

    let btnExit = document.createElement('IMG')
    btnExit.setAttribute('class', 'navBtns')
    btnExit.setAttribute('id', 'btnExit')
    btnExit.setAttribute('src', 'imgs/imgExit.png')

    klikImg.appendChild(btnLeft)
    klikImg.appendChild(btnExit)
    klikImg.appendChild(btnRight)
    popUpImgHolder.appendChild(klikImg)

    btnsNav = document.querySelectorAll('.navBtns')
    btnsNav.forEach(btn => {
        btn.addEventListener('click', event => {
            // console.log(event.target.id)
                if(event.target.id === 'btnRight') {
                    console.log(event)
                    popUpImgHolder.innerHTML = ""
                    urlNextImage(galerijaFolder, urlSlike, event.target.id)
                }
                if(event.target.id === 'btnLeft') {
                    popUpImgHolder.innerHTML = ""
                    urlNextImage(galerijaFolder, urlSlike, event.target.id)
                }
                if(event.target.id === 'btnExit') {
                    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                        document.querySelector('.mobSlikaVeca').remove()
                        imageHolder.style.display = "flex"
                        counterPopUpImg = 0
                    } else {
                        document.querySelector('.slikaVeca').remove()
                        imageHolder.style.display = "flex"
                        counterPopUpImg = 0
                    }
                    
            }
            
        })
    })
    
    if(curWidth > curHeight) {
        if(window.innerWidth > window.innerHeight) {
            let visina = window.innerHeight - window.innerHeight * 7 / 100
            let sirinaSlike = visina * 1.5
            klikImg.style.height = (`${visina}px`)
            klikImg.style.width = (`${sirinaSlike}px`)
            klikImg.classList.add('slikaVeca')
            popUpImgHolder.style.margin = "auto"
        } else if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ){
            let visinaSlike = screen.width / 1.5
            console.log(screen.width)
            console.log(visinaSlike)
            klikImg.style.width = (`${screen.width}px`)
            klikImg.style.height = (`${visinaSlike}px`)             
            klikImg.classList.add('mobSlikaVeca')
            popUpImgHolder.style.margin = "auto"

        } else {
            let visina = window.innerWidth - window.innerWidth * 7 / 100
            let sirinaSlike = visina / 1.5
            klikImg.style.height = (`${visinaSlike}px`)
            klikImg.style.width = (`${sirinaSlike}px`)
            klikImg.classList.add('slikaVeca')
            popUpImgHolder.style.margin = "auto"

        }
    } else {
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ){
            // let visina = screen.width - screen.width * 20 / 100
            // let visinaSlike = visina / 1.5
            let visinaSlike = screen.width * 1.5
            // console.log(`${screen.width}px`)
            // console.log(`${screen.height}px`)
            // console.log(`${containerGalerija.offsetWidth}px`)
            // console.log(`${containerGalerija.clientWidth}px`)
            // console.log(`${containerGalerija.offsetHeight}px`)
            // console.log(`${containerGalerija.clientHeight}px`)
            klikImg.style.width = (`${screen.width}px`) 
            klikImg.style.height = (`${visinaSlike}px`) 
            klikImg.classList.add('mobSlikaVeca')
            popUpImgHolder.style.marginTop = "0px"
    } else {            
            let visina = window.innerHeight - window.innerHeight * 7 / 100
            let sirinaSlike = visina / 1.5
            klikImg.style.width = (`${sirinaSlike}px`)
            klikImg.style.height = (`${visina}px`)
            klikImg.classList.add('slikaVeca')
            popUpImgHolder.style.marginTop = "0px"
        }
    }  
}



function urlNextImage(folder, url, idSlike) {

    let nizUrlSlika = []
    db.collection(`${folder}`)
    .orderBy('datum', 'desc')
    .get()
    .then(snapshot => {
        if(!snapshot.empty) {
            let allDocs = snapshot.docs
            allDocs.forEach((x, y )=> {
                let slike = x.data()
                nizUrlSlika.push(slike.downLink)                   
            })
        }
    })
    .then(function() {
        nizUrlSlika.forEach((x, y) => {
                    if(x === url && idSlike === 'btnRight') {
                        indexTrenutneSlike = y + 1                
                    }
                    if (x === url && idSlike === 'btnLeft') {
                        indexTrenutneSlike = y - 1                         
                    }
        })

        if(indexTrenutneSlike === nizUrlSlika.length && idSlike === 'btnRight') {            
            indexTrenutneSlike = 0
        }
        if(indexTrenutneSlike < 0 && idSlike === 'btnLeft') {
            indexTrenutneSlike = nizUrlSlika.length - 1
        }
        createFullScreenImg(nizUrlSlika[indexTrenutneSlike])
    })
}

