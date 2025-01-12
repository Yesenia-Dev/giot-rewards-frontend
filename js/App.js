import * as components from "./components.js";
import * as helper from "./helper.js";
import * as api from "./api.js";

const body = document.querySelector(".body");

let carouselWorker = new Worker("/js/carousel_worker.js");

let currentImage = 1;

let inputSubmitIdentifier;
let inputSubmitPrev;
let inputSubmitLogin;

// Componenetes de inicio
addEventListener('DOMContentLoaded', () => {

    toStartView();
    // Evento que envía ID
    

    // En este punto, se validó el ID

});

function toStartView() {

    //helper.clearBody();
    helper.showComponent(body,components.header());
    //helper.showComponent(body, components.home())
    helper.showComponent(body,components.carousel());
    helper.showComponent(body,components.loginIdentifier());

    

    inputSubmitIdentifier = document.querySelector(".input_submit_identifier");
    helper.defineListener(inputSubmitIdentifier,'click', async ()=> {

        // Revisamos si existe el indentificador

        const identifierJSON = JSON.stringify(
            {
            "identifier": parseInt(document.querySelector('.input_login').value)
            });


        // Envía un JSON a la ruta especificada
        //a
        const responseData = await api.postData(identifierJSON,'/login/identifier').catch(()=> console.log("Error en la petición"));

        if(responseData != null) {

            const hasCredential = Object.values(responseData)[0];
            
            if(hasCredential) {
                toPasswordView(document.querySelector('.input_login').value);
            } else {
                document.querySelector(".input_login").value = "";
                alert("El identificador no está registrado :(");
            }
        }
    });
}

async function toPasswordView(identifier) {

    const identifierJSON = JSON.stringify(
        {
        "identifier": parseInt(identifier)
        });


    const responseData = await api.postData(identifierJSON,'/login/password');
    const hasPassword = Object.values(responseData)[0];

    let labelInnerHTML = hasPassword ? "Por favor,ingresa tu contraseña..." : "Por favor,define tu contraseña...";

    helper.clearBody();
    helper.showComponent(body, components.header());
    helper.showComponent(body, components.loginPassword());
    helper.modifyInnerHTML(document.querySelector(".section_password"),"label_password",labelInnerHTML);

    console.log(components.loginPassword().getElementsByClassName("label_password"));

    inputSubmitPrev = document.querySelector('.input_submit_prev');
    inputSubmitLogin = document.querySelector('.input_submit_login');

    if(inputSubmitPrev != null ) {
        helper.defineListener(inputSubmitPrev,"click",toStartView);
    }
    if(inputSubmitLogin != null ) {
        helper.defineListener(inputSubmitLogin,"click",async ()=> {

            const validationJSON = JSON.stringify(
                {
                "identifier": parseInt(identifier),
                "password": document.querySelector('.input_password').value
                });
        
                const responseData = await api.postData(validationJSON,'/login/validation');

                const validated = responseData.validated;

                console.log(validated);

                if(validated) {
                    toHomeView(responseData);
                } else {
                    document.querySelector(".input_password").value = "";
                    alert("El identificador no está registrado :(");
                }

        });
    }








    // document.querySelector('.label_password').innerHTML = "DEPENDE DE LA PETICIÓN";
    
}

async function toHomeView(validationData) {

    window.history.pushState('home','Title','/home');

    helper.clearBody();
    helper.showComponent(body, components.header());
    helper.showComponent(body, components.home());
    helper.modifyInnerHTML(document.querySelector(".section_home"),"h2_home",`Hola, ${validationData.user.firstname}`);
}



carouselWorker.onmessage = (ev) => {
    const carouselContainer = document.querySelector(".carousel_container")

    if(carouselContainer != null) {

        if(currentImage == 4) {
            carouselContainer.scroll({
                behavior:"smooth",
                top:0,
                left: 0
            })
            currentImage = 1;
        } else {
            carouselContainer.scrollBy({
                behavior:"smooth",
                top:0,
                left: carouselContainer.offsetWidth
            })
            currentImage++;
        }
    }
}
    /* const identifierJSON = JSON.stringify(
            {
                "identifier":parseInt(identifier)
            })


    
    
    
    console.log(components.loginPassword().getElementsByClassName("label_password"));



    inputSubmitPrev = document.querySelector('.input_submit-prev');
    inputSubmitLogin = document.querySelector('.input_submit-login');

    if(inputSubmitPrev == null ) {
        return false;
    }
    defineListener(inputSubmitPrev,"click",toStartView);
    if(inputSubmitPrev == null ) {
        return false;
    }
    defineListener(inputSubmitLogin,"click",toHomeView);
}
*/

