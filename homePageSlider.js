let containerLandingPage = document.getElementById('containerLandingPage')
let slideHolder = document.createElement('DIV')
containerLandingPage.appendChild(slideHolder)
slideHolder.classList.add('slideHolder')
slideHolder.classList.add('containerResponse')
slideHolder.style.width = '100vw'

console.log(document.body.offsetHeight)

containerLandingPage.style.height = `${document.body.offsetHeight - document.body.offsetHeight * 7 /100}px`

let desktopOrMobileView
let niz = []
let brojacNiz = 0

if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // console.log('mobilni')
    desktopOrMobileView = 'imgSlideMob'
} else {
    // console.log('desktop')
    desktopOrMobileView = 'imgSlide'
}
db.collection(`${desktopOrMobileView}`)
.orderBy('datum', 'desc')
.get()
.then(snapshot => {
    if(!snapshot.empty) {
        let imgSlide = snapshot.docs
        imgSlide.forEach((imgs, y) => {
            let tmpimg = new Image()
            let links = imgs.data()
            //console.log(links.downLink, y)       
            tmpimg.src = `${links.downLink}`
            niz.push(tmpimg)              
            // console.log(niz)
        })
    }
}).then(function slider(){
    // console.log(niz)

    desktopSlider(brojacNiz)

    function desktopSlider (value) {      

        for(let i=0; i<niz.length; i++) {
            if(i != 0) {
                value++
            }            
            // console.log(value)  
            setTimeout(() => {                    
                slideHolder.style.backgroundImage = `url('${niz[i].src}')`
            },3300 * value)
        }

        if(value <= 20) {
            let prenesi = value + 1
            desktopSlider(prenesi)   
            // console.log('STOP')
        }
        // console.log('izaslo')
    }

})
.catch(error => {
    console.log(`Došlo je do greške: ${error}`)
})

