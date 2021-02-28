let containerProdaja = document.getElementById('containerProdaja')

function tester() {
    let testDiv = document.createElement('DIV')
    containerProdaja.appendChild(testDiv)

}

var observer = new MutationObserver(function(mutations) {

mutations.forEach(function(mutation) {
    console.log(mutation.type);
    console.log(mutation)
});
});

var config = {
attributes: true,
childList: true,
characterData: true
};

observer.observe(containerProdaja, config);
// observer.disconnect()