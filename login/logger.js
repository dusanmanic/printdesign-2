let login = document.getElementById('login')
let logOut = document.getElementById('logout')
let signin = document.getElementById('signin')
let panel = document.getElementById('panel')
let loginDiv = document.querySelector('.loginDiv')

let rand = function() {
    return Math.random().toString(36).substr(2); // remove `0.`
};

let token = function() {
    return rand() + rand() + rand(); // to make it longer
};

btnCheck()

function btnCheck() {

    let logBtn = localStorage.getItem('btns')

    if(logBtn === "true") {
        login.classList.add("removeLi")
        signin.classList.add("removeLi")
        logOut.classList.remove("removeLi")
        panel.classList.remove("removeLi")
    } else {
        logOut.classList.add("removeLi")
        panel.classList.add("removeLi")
        login.classList.remove("removeLi")
        signin.classList.remove("removeLi") 

    }
}

function logging() {
    let user = document.getElementById('username')
    let pass = document.getElementById('password')
    let p = document.querySelector('p')
    let userToken
    userToken = token()
    
    localStorage.setItem('curentUser', user.value)
    localStorage.setItem('curT', userToken)
    
    db.collection('login_info')
    .get()
    .then(snapshot => {
        if(!snapshot.empty) {
            let login_info = snapshot.docs
            login_info.forEach(user => {
                let userInfo = user.data()
                if(localStorage.getItem('curentUser') === userInfo.information.user) {
                    if(pass.value === userInfo.information.pass) {
                        loginDiv.innerHTML = ""
                        loginDiv.appendChild(p)
                        p.innerHTML = 'Uspesno ste se logovali !'
                        let datum = new Date();
                        let update = {
                            logged_in: firebase.firestore.Timestamp.fromDate(datum),
                            log: true,
                            token: userToken
                        }
                        
                        db.collection('login_info').doc(`${userInfo.information.user}`).update(update)
                        
                        setTimeout(() => {
                            window.location.href = "../adminpanel.html"
                            localStorage.setItem('btns', true)

                        }, 1500)
                    } else {
                        p.innerHTML = 'Username ili password <br> nije tačan'
                    }
                } 
            })
        }
    })
    .catch(error => {
        console.log(`Došlo je do greške: ${error}`)
    });
}

function btnsShowHide() {
    counterShowHide++
    if(counterShowHide === 1) {
        counterShowHide = 0
        document.querySelector('.headBtns').style.display = "flex"
        document.querySelector('.responseBtn').style.display = "none"

    }
}
// Ubaciti u skriptu
//checker()