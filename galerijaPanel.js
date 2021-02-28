let kategorijeDiv = document.querySelector('.kategorijeDiv')
let kategorijaInput = document.getElementById('kategorijaInput')
let delCounter = 0
let diffCounter = 0
let uploadKategorija

db.collection('galerijaKategorije')
.get()
.then(snapshot => {
    if(!snapshot.empty) {
        let allDocs = snapshot.docs
        allDocs.forEach(x => {
            let kategorije = x.data()
            // let kategorijeID = x.id
            
            let nameCategory = kategorije.name.charAt(0).toUpperCase() + kategorije.name.slice(1)
            let btnsDiv = document.createElement('DIV')
            let btnKategorija = document.createElement('BUTTON')
            let btnDel = document.createElement('BUTTON')

            btnDel.textContent = "del"
            btnDel.setAttribute('class', 'delDugmici removeLi')
            btnsDiv.setAttribute('id', kategorije.id)
            btnKategorija.setAttribute('class', 'katDugmici')
            btnKategorija.textContent = nameCategory

            btnsDiv.appendChild(btnDel)
            btnsDiv.appendChild(btnKategorija)
            kategorijeDiv.appendChild(btnsDiv)

        })
    }
})
.then(function(){
    let btns = document.querySelectorAll('.delDugmici')

    btns.forEach(btn => {
        btn.addEventListener('click', event => {
            let btnDiv = document.querySelector(`#${event.path[1].id}`)
            console.log(event.path[1].id)
            db.collection(`${event.path[1].id}`)
            .get()
            .then(snapshot => {
                if(!snapshot.empty) {
                    let allDocs = snapshot.docs
                    allDocs.forEach(x => {
                        let kategorijeId = x.id
                        db.collection(`${event.path[1].id}`).doc(`${kategorijeId}`).delete()
                        console.log(kategorijeId)                      
                    })
                }
            })
            
            db.collection('galerijaKategorije').doc(`${event.path[1].id}`).delete()
            btnDiv.remove() 
           
        })
    })
})
.then(function(){    
    let katBtns = document.querySelectorAll('.katDugmici')

    katBtns.forEach(btn => {
        btn.addEventListener('click', event => {
            let progressBar = document.querySelector('.progressBar')
            diffCounter++

            if(diffCounter == 1) {
                let uploadDiv = document.querySelector(`#${event.path[1].id}`)
                console.log('print')
                console.log(event.path[1].id)
    
                let dropInput = document.createElement('INPUT')
    
                dropInput.setAttribute('type', 'file')
                dropInput.setAttribute('class', 'uploadGalery')
                dropInput.setAttribute('id', `#${event.path[1].id}`)
                dropInput.multiple = true
                uploadDiv.appendChild(dropInput)

                dropInput.addEventListener('change', event => {
            
                    let slika = event.target.files
                
                    if(slika.length >= 0) {
                
                        for(let i=0; i<slika.length; i++) {
                
                            let spanName = document.createElement('SPAN')
                            let spanProgress = document.createElement('SPAN')
            
                            let slikaIme = event.target.files[i].name
            
                            let datum = new Date();
                            let datumUbacivanja = new Date ( datum );
                            datumUbacivanja.setMinutes ( new Date().getMinutes() - i );            
                
                            console.log(datum)
                            console.log(datumUbacivanja)
                
                            toStorage = storage.ref(`${event.path[1].id}/${slikaIme}`)
                            let uploadTask = toStorage.put(slika[i])
                
                            // Register three observers:
                            // 1. 'state_changed' observer, called any time the state changes
                            // 2. Error observer, called on failure
                            // 3. Completion observer, called on successful completion
                            uploadTask.on('state_changed', function(snapshot){
                            // Observe state change events such as progress, pause, and resume
                            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                            progressBar.appendChild(spanName)              
                            spanName.innerHTML = `${slika[i].name} `
                            progressBar.appendChild(spanProgress)
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
                
                                db.collection(`${event.path[1].id}`).doc(`${slikaIme}`).set(dodaj)       
                                
                                let tumb = {
                                    tumbUrl: downloadURL
                                }

                                db.collection('galerijaKategorije').doc(`${event.path[1].id}`).update(tumb)  
                                })
                            
                            });
                        }
                    }
                })

            } else {
                let delInput = document.querySelector('.uploadGalery')
                delInput.remove()
                diffCounter = 0
            }

        })
    })
})
.catch(error => {
    console.log(`Došlo je do greške: ${error}`)
});

function showHideDelBtn() {
    delCounter++

    if(delCounter == 1) {
        let btns = document.querySelectorAll('.delDugmici')
        btns.forEach(x => {
            x.classList.remove('removeLi')
        })
    } else {
        let btns = document.querySelectorAll('.delDugmici')
        btns.forEach(x => {
            x.classList.add('removeLi')
            delCounter = 0
        })
    }
}

function dodajGaleriju (){
    let imeKategorije 
    let id

    if(kategorijaInput.value[0] === kategorijaInput.value[0].toUpperCase() ) {
        imeKategorije = kategorijaInput.value.charAt(0).toLowerCase() + kategorijaInput.value.slice(1)
        id = imeKategorije
        console.log('ima veliko slovo')
        console.log('kategorija 1')

    } else {
        imeKategorije = kategorijaInput.value
    }
    
    if (imeKategorije.indexOf(' ') >= 0) {
        id = imeKategorije.replace(/\s/g, '')
        console.log('kategorija 3')
    } else {
        id = imeKategorije
        console.log('kategorija 4')
    } 

    let dodaj = {
        name: imeKategorije,
        id: id
    }
    db.collection('galerijaKategorije').doc(`${id}`).set(dodaj)

    setTimeout(() => {
        location.reload()
    },1500)

}