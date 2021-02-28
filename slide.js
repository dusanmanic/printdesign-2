let containerSlide = document.getElementById('containerSlide')
let slideImages = document.querySelector('.slideImages')
let uploadInput = document.querySelector('.uploadInput')
let inputForm = document.createElement('FORM')
let optionView = document.getElementById('kategorija')
let fileUpload = document.getElementById('fileUpload')
let btnsLoadSlideImages = document.querySelectorAll('.loadSlideImages')

// Upload fotografija na server
let selOpcija
function kategorija() {

    selOpcija = optionView.value
    fileUpload.classList.remove('removeLi')
    //console.log(selOpcija)    

    fileUpload.addEventListener('change', event => {
        let slika = event.target.files

        if(slika.length >= 0) {

            for(let i=0; i<slika.length; i++) {

                let spanName = document.createElement('SPAN')
                let spanProgress = document.createElement('SPAN')
                let slikaIme = event.target.files[i].name
                let datum = new Date();
                let datumUbacivanja = new Date ( datum );
                datumUbacivanja.setMinutes ( new Date().getMinutes() - i );            

                //console.log(datum)
                //console.log(datumUbacivanja)

                toStorage = storage.ref(`${selOpcija}/${slikaIme}`)
                let uploadTask = toStorage.put(slika[i])

                // Register three observers:
                // 1. 'state_changed' observer, called any time the state changes
                // 2. Error observer, called on failure
                // 3. Completion observer, called on successful completion
                uploadTask.on('state_changed', function(snapshot){
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                uploadInput.appendChild(spanName)              
                spanName.innerHTML = `${slika[i].name} `
                uploadInput.appendChild(spanProgress)
                spanProgress.innerHTML = `${Math.round(progress)}%<br>`
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
                }
                }, function(error) {
                // Handle unsuccessful uploads
                }, function() {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    console.log('File available at', downloadURL);

                    // let storageRef = storage.ref()
                    let dodaj = {
                        name: slikaIme,
                        downLink: downloadURL,
                        datum: datumUbacivanja
                    }

                    db.collection(`${selOpcija}`).doc(`${slikaIme}`).set(dodaj)
                    
                    let imgHolder = document.createElement('DIV')
                    let downImg = document.createElement('IMG')

                    downImg.setAttribute('src', downloadURL)
                    downImg.setAttribute('width', '100px')

                    slideImages.appendChild(imgHolder)
                    imgHolder.appendChild(downImg)

                    })
                
                });
            }
        }
    })


}

// Učitava slike sa servera (imgSlide(Desktop) ili imgSlideMob(Mobilni)
btnsLoadSlideImages.forEach(btn => {
    btn.addEventListener('click', event => {
        //console.log(event.target.id)

        slideImages.innerHTML = ""
        let storageRef = storage.ref()

        db.collection(`${event.target.id}`)
        .orderBy('datum', 'desc')
        .get()
        .then(snapshot => {
            if(!snapshot.empty) {
                let imgSlide = snapshot.docs
                imgSlide.forEach((imgs, y) => {
                    
                    let links = imgs.data()
                    tmpimg = new Image()
                    tmpimg.src = links.downLink
                    
                    let btnDel = document.createElement('button')
                    let imgHolder = document.createElement('DIV')
                    let downImg = document.createElement('IMG')
                    let br = document.createElement('BR')

                    downImg.setAttribute('src', tmpimg.src)
                    downImg.setAttribute('width', '100px')

                    slideImages.appendChild(imgHolder)
                    imgHolder.appendChild(downImg)
                    imgHolder.appendChild(br)

                    btnDel.innerHTML = "Obrisi"
                    btnDel.id = links.name
                    imgHolder.appendChild(btnDel)
                    
                    let slideID = event.target.id

                    btnDel.addEventListener('click', event => {
                        console.log(slideID)
                        let imeSlike = links.name
                        let deleteRef = storageRef.child(`${slideID}/${imeSlike}`)
                        db.collection(`${slideID}`).doc(`${imeSlike}`).delete()
                        
                        deleteRef.delete()
                        imgHolder.remove()
                        btnDel.remove()
                    })
                })
            }
        })
        .catch(error => {
            console.log(`Došlo je do greške: ${error}`)
        })
    })
})