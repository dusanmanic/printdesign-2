let containerGalerija = document.getElementById('containerGalerija')
let imageHolder = document.querySelector('.imageHolder')
let counterPopUpImg = 0
let nizUrlSlika = []

let tumbDivKvadratura = 160*130
counterUrlSlika = ((containerGalerija.offsetHeight * (containerGalerija.offsetWidth * 93 / 100)) / tumbDivKvadratura)
console.log(counterUrlSlika)


containerGalerija.addEventListener('scroll', event => {

    let scrollBottom = (containerGalerija.scrollHeight - containerGalerija.scrollTop === containerGalerija.clientHeight) // Provera da li je scroll dosao do kraja
    console.log(scrollBottom)
})


db.collection('galerijaKategorije')
.get()
.then(snapshot => {
    if(!snapshot.empty) {
        let allDocs = snapshot.docs
        allDocs.forEach(x => {
            let kategorije = x.data()
            
            nameCategory = kategorije.name.charAt(0).toUpperCase() + kategorije.name.slice(1)

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
        })
    }
})
.then(function() {
    let galerijaBtns = document.querySelectorAll('.holderImg')

    galerijaBtns.forEach(btn =>{
        
        btn.addEventListener('click', event => {
            console.log(event)
            console.log(event.path[0].id)
            imageHolder.innerHTML = ""
            let path = event.path[0].id
            
            db.collection(`${event.path[0].id}`)
            .orderBy('datum', 'desc')
            .get()
            .then(snapshot => {
                if(!snapshot.empty) {
                    let allDocs = snapshot.docs
                    allDocs.forEach(x => {
                        let slike = x.data()

                        let frameDiv = document.createElement('DIV')
                        let slikaImg = document.createElement('IMG')
                        let delBtnImg = document.createElement('BUTTON')
                        frameDiv.setAttribute('class', 'frameDiv')
                        delBtnImg.textContent = "obriši"
                        delBtnImg.setAttribute('class', 'delBtnImg')
                        slikaImg.setAttribute('class', 'slikaImg')
                        slikaImg.setAttribute('src', slike.downLink)
                        frameDiv.appendChild(slikaImg)
                        frameDiv.appendChild(delBtnImg)                        
                        imageHolder.appendChild(frameDiv)

                        //console.log(slike.downLink)

                        if(localStorage.getItem('curT') === null) {
                            delBtnImg.classList.add('removeLi')
                        } else {
                            delBtnImg.classList.remove('removeLi')
                        }

                        delBtnImg.addEventListener('click', event => {
                            db.collection(`${path}`).doc(`${slike.name}`).delete()

                            let deleteRef = storage.ref().child(`${path}/${slike.name}`)                            
                            deleteRef.delete()
                            frameDiv.remove()
                            console.log(slike.name)
                        })

                        slikaImg.addEventListener('click', event => {
                            counterPopUpImg++
                                console.log(event.target.currentSrc)

                                if(counterPopUpImg === 1) {
                                    console.log(counterPopUpImg)
                                    imageHolder.style.display = 'none'
                                    // let klikDiv = document.createElement('IMG')
                                    let klikImg = new Image()
                                    klikImg.src = event.target.currentSrc
                                    
                                    curWidth = klikImg.width
                                    console.log(curWidth)
                                    curHeight = klikImg.height
                                    console.log(curHeight)

                                    let popUpDiv = document.createElement('DIV')
                                    popUpDiv.setAttribute('class', 'popUpDiv')
                                    containerGalerija.appendChild(popUpDiv)
                                    // klikDiv.style.backgroundImage = `url('${event.target.currentSrc}')`
                                    
                                    popUpDiv.appendChild(klikImg)
                                    

                                    if(curWidth > curHeight) {

                                        if(window.innerWidth > window.innerHeight) {
                                            console.log('print')

                                            let visina = window.innerHeight - window.innerHeight * 7 / 100
                                            let sirinaSlike = visina * 1.5
                                            klikImg.setAttribute('height', `${visina}px`)
                                            klikImg.setAttribute('width', `${sirinaSlike}px`)
                                            klikImg.setAttribute('class', 'slikaVeca')

                                        } else if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ){

                                            let visinaSlike = screen.width / 1.5
                                            klikImg.setAttribute('height', `${visinaSlike}px`) 
                                            klikImg.setAttribute('class', 'mobSlikaVeca')

                                        } else {

                                            let visina = window.innerWidth - window.innerWidth * 7 / 100
                                            let sirinaSlike = visina / 1.5
                                            klikImg.setAttribute('height', `${visinaSlike}px`)
                                            klikImg.setAttribute('width', `${sirinaSlike}px`)
                                            klikImg.setAttribute('class', 'slikaVeca')
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

                                            klikImg.setAttribute('width', `${screen.width}px`) 
                                            klikImg.setAttribute('height', `${visinaSlike}px`) 
                                            klikImg.setAttribute('class', 'mobSlikaVeca')                                                                                                                      
                                        
                                        } else {
                                            
                                            let visina = window.innerHeight - window.innerHeight * 7 / 100
                                            let sirinaSlike = visina / 1.5
                                            klikImg.setAttribute('width', `${sirinaSlike}px`)
                                            klikImg.setAttribute('height', `${visina}px`)
                                            klikImg.setAttribute('class', 'slikaVeca')

                                        }
                                    }                            
                  
                                    klikImg.addEventListener('click', event => {
                                        counterPopUpImg++
                                        if(counterPopUpImg === 2) {
                                            // popUpDiv.innerText = ""
                                            // popUpDiv.style.display = 'none'
                                            popUpDiv.remove()
                                            imageHolder.style.display = ""
                                            counterPopUpImg = 0
                                        }   
                                    })
                                }
                        })
                        

                    })
                }
            })
        })
    })
})


/*
                        slikaImg.addEventListener('click', event => {
                            counterPopUpImg++
                                console.log(event.target.currentSrc)

                                if(counterPopUpImg === 1) {
                                    console.log(counterPopUpImg)
                                    imageHolder.style.display = 'none'
                                    // let klikDiv = document.createElement('IMG')
                                    let klikDiv = new Image()
                                    klikDiv.src = event.target.currentSrc
                                    
                                    curWidth = klikDiv.width
                                    console.log(curWidth)
                                    curHeight = klikDiv.height
                                    console.log(curHeight)

                                    let popUpDiv = document.createElement('DIV')
                                    popUpDiv.setAttribute('class', 'popUpDiv')
                                    containerGalerija.appendChild(popUpDiv)
                                    // klikDiv.style.backgroundImage = `url('${event.target.currentSrc}')`
                                    klikDiv.setAttribute('class', 'slikaVeca')
                                    popUpDiv.appendChild(klikDiv)
                  
                                    klikDiv.addEventListener('click', event => {
                                        counterPopUpImg++
                                        if(counterPopUpImg === 2) {
                                            // popUpDiv.innerText = ""
                                            // popUpDiv.style.display = 'none'
                                            popUpDiv.remove()
                                            imageHolder.style.display = ""
                                            counterPopUpImg = 0
                                        }   
                                    })
                                }
                        })
                        */