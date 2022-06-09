/*!
* Start Bootstrap - Creative v7.0.5 (https://startbootstrap.com/theme/creative)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-creative/blob/master/LICENSE)
*/
//
// Scripts

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBW_np_kMmft71aTLsvfRuiKykKRaL_4C8",
  authDomain: "milestone-mental-health-cdc93.firebaseapp.com",
  projectId: "milestone-mental-health-cdc93",
  storageBucket: "milestone-mental-health-cdc93.appspot.com",
  messagingSenderId: "826232805712",
  appId: "1:826232805712:web:fc8bb7b42363a704593455",
  measurementId: "G-0X73BB89EX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    $('.navbar-collapse a:not(.dropdown-toggle)').click(function(){
        $(".navbar-collapse").collapse('hide');
    });

    //AOS
    AOS.init();

    //Listen for form submit
    document.getElementById('contactForm').addEventListener('submit', submitForm);

    //Submit form
    function submitForm(e) {
        e.preventDefault();
        
        //Get values
        let name = getInputVal('name');
        let email = getInputVal('emailAddress');
        let phone = getInputVal('phoneNumber');
        let insurance = getInputVal('insurance');
        let message = getInputVal('message');

        //save message
        saveMessage(name, email, phone, insurance, message);
    }

    //Function to get form values
    function getInputVal(id) {
        return document.getElementById(id).value;
    }

    // Save message to firebase
    function saveMessage(name, email, phone, insurance, message) {
        const db = getDatabase();
        const messagesRef = ref(db, 'messages');

        set(messagesRef, {
            name: name,
            email: email,
            phone: phoneNumber,
            insurance: insurance,
            message: message
        });
    }

    
});
