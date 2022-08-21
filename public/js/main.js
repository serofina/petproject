(function ($) {
  "use strict";

  // Dropdown on mouse hover
  $(document).ready(function () {
    function toggleNavbarMethod() {
      if ($(window).width() > 992) {
        $(".navbar .dropdown")
          .on("mouseover", function () {
            $(".dropdown-toggle", this).trigger("click");
          })
          .on("mouseout", function () {
            $(".dropdown-toggle", this).trigger("click").blur();
          });
      } else {
        $(".navbar .dropdown").off("mouseover").off("mouseout");
      }
    }
    toggleNavbarMethod();
    $(window).resize(toggleNavbarMethod);
  });

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
    return false;
  });

  // Date and time picker
  $("#date").datetimepicker({
    format: "L",
  });
  $("#time").datetimepicker({
    format: "LT",
  });

  // Testimonials carousel
  $(".testimonial-carousel").owlCarousel({
    center: true,
    autoplay: true,
    smartSpeed: 2000,
    dots: true,
    loop: true,
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 1,
      },
      768: {
        items: 2,
      },
      992: {
        items: 3,
      },
    },
  });
})(jQuery);

// Opening Hours

var currentDate = new Date();
var weekday = [];
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

var currentDay = weekday[currentDate.getDay()];

var currentTimeHours = currentDate.getHours();
currentTimeHours =
  currentTimeHours < 10 ? "0" + currentTimeHours : currentTimeHours;
var currentTimeMinutes = currentDate.getMinutes();
var timeNow = currentTimeHours + "" + currentTimeMinutes;

var currentDayID = "#" + currentDay; //gets todays weekday and turns it into id
$(currentDayID).toggleClass("today"); //this works at hightlighting today

var openTimeSplit = $(currentDayID).children(".opens").text().split(":");

var openTimeHours = openTimeSplit[0];
openTimeHours = openTimeHours < 10 ? "0" + openTimeHours : openTimeHours;

var openTimeMinutes = openTimeSplit[1];
var openTimex = openTimeSplit[0] + openTimeSplit[1];

var closeTimeSplit = $(currentDayID).children(".closes").text().split(":");

var closeTimeHours = closeTimeSplit[0];
closeTimeHours = closeTimeHours < 10 ? "0" + closeTimeHours : closeTimeHours;

var closeTimeMinutes = closeTimeSplit[1];
var closeTimex = closeTimeSplit[0] + closeTimeSplit[1];

if (timeNow >= openTimex && timeNow <= closeTimex) {
  $(".openorclosed").toggleClass("open");
} else {
  $(".openorclosed").toggleClass("closed");
}
// End Opening Hours


// begin send email function

const sendMail = ((email, subject, message) => {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  console.log(email, subject);

  let raw = JSON.stringify({
    "email": email,
    "subject": subject,
    "message": message
  });

  let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("/api/mailto", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));

});

//end send email  function

//send an email
const form_email = document.querySelector("#send-email");

if (form_email) {
  form_email.addEventListener("submit", (event) => {
    event.preventDefault();

    console.log('event', event);


    const email = document.querySelector("#email-address").value;
    const subject = document.querySelector("#email-subject").value;
    const message = document.querySelector("#email-message").value;


    sendMail(email, subject, message);

  })
}


//end send email


//begin add user to mailing list


const form_newsletter = document.querySelector("#newsletter-add");

if (form_newsletter) {
  form_newsletter.addEventListener("submit", (event) => {
    event.preventDefault();


    const name = document.querySelector("#newsletter-name").value;
    const email = document.querySelector("#newsletter-email").value;
    console.log(name, email);

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
      "name": name,
      "email": email
    });

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("/api/newsletterAddMember", requestOptions)
      .then(response => response.text())
      .then(result => {
        if (result) {
          alert("Thank You for registering for our news letter.")
        } else {
          alert("Sorry there was a problem, Please try again of contact our staff at email@pethotel.com.")
        };
      })
      .catch(error => console.log('error', error));



    form_newsletter.reset();

  });
}

//end add user to mailing list

//send out news-letter emails


const newsletter_email = document.querySelector("#send-newsletter");

if (newsletter_email) {
  newsletter_email.addEventListener("submit", (event) => {
    event.preventDefault();

    console.log('event', event);


    
    const subject = document.querySelector("#newsletter-subject").value;
    const message = document.querySelector("#newsletter-message").value;

    let requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    
    fetch("/api/newsletterSubmit", requestOptions)
      .then(response => response.json())
      .then(body => {
        body.result.forEach(element => {
          const script = `Hello ${element.name}, \n\n Thanks you for subscribing to our newsletter \n\n ${message}`
          sendMail(element.email, subject, script);
        });
      
      })
      .catch(error => console.log('error', error));

      newsletter_email.reset();      
  })
}




//end send news-letter emails

//send a booking email request

const bookingrequest = document.querySelector("#booking-form");

if (bookingrequest) {
  bookingrequest.addEventListener("submit", (event) => {
    event.preventDefault();
    
    const name = document.querySelector("#booking-name").value;
    const email = document.querySelector("#booking-email").value;
    const date = document.querySelector("#booking-date").value;
    const time = document.querySelector("#booking-time").value;
    const service = document.querySelector("#booking-service").value;
    
    const bookingemail = "booking@pethotel.com";
    const subject = `BOOKING REQUEST ${name} ${email} ${date} ${time} ${service};`
    const message = `${name} would like to book ${service} on ${date} at ${time}. \n\n His contact is ${email}`;
   
    sendMail(bookingemail, subject, message);
    alert("Your request has been set to our staff. If you have any questions, please contact us at 619-555-1234 or info@pet-hotel.com.")
    bookingrequest.reset();      
  })
}

// end send a booking request

//start contact us 


const contactus = document.querySelector("#contact-form");

if (contactus) {
  contactus.addEventListener("submit", (event) => {
    event.preventDefault();
    
    const name = document.querySelector("#contact-name").value;
    const email = document.querySelector("#contact-email").value;
    const subjectcontact = document.querySelector("#contact-subject").value;
    const messagecontact = document.querySelector("#contact-message").value;

    
    const contactemail = "contact@pethotel.com";
    const subject = `CONTACT REQUEST ${name}, ${email}, ${subjectcontact};`
    const message = `${name} would like more information on ${subjectcontact}\n\n ${messagecontact}. \n\n His contact is: \n${email}`;
   
    sendMail(contactemail, subject, message);
    alert("Your request has been set to our staff. If you have any questions, please contact us at 619-555-1234.")
    contactus.reset();      
  })
}
//end contact us

//REGISTER
const registration = document.querySelector("#registration-form");

if (registration) {
  registration.addEventListener("submit", (event) => {
    event.preventDefault();
    
    const name = document.querySelector("#registration-fullname").value;
    const email = document.querySelector("#registration-email").value;
    const password = document.querySelector("#registration-pass").value;
    const RPassword = document.querySelector("#registration-repeat").value;

    let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

      if(password===RPassword && password.length>5){
          let raw = JSON.stringify({
            "name": name,
            "email": email,
            "password": password
          });

          let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
          };

          fetch("/api/register", requestOptions)
            .then(response => response.json())
            .then(result => {
              console.log("********result",result);
              if (result.success) {
                window.location.replace("/login");
              } else {
                alert('Unable to create an account. Please try again.');
              }
            })
            .catch(error => console.error('error', error));
            registration.reset(); 
      }else{
          alert("Passwords do not match or needs to be longer than 5") 
      }
  })
}
//END REGISTER

//go to customer form after sign in

const customerHomePage = ()=> {


  const token = (localStorage.getItem('accessToken'));
  // console.log(token);


  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  let requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  
  fetch("/auth", requestOptions)
    .then(response => response.json())
    .then(result => {
      if (result.authenticated){
        window.location.pathname = ("/customerform");
      }
    })
    .catch(error => console.log('error', error));
 
 
}
//end go to customer form

//sign in

const sigin = document.querySelector("#login-form");
if (sigin) {
  sigin.addEventListener("submit", (event) => {
    event.preventDefault();
    
    const email = document.querySelector("#signin-email").value;
    const password = document.querySelector("#signin-password").value;

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    let raw = JSON.stringify({
      "email": email,
      "password": password
    });
    
    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch("/api/signin", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          console.log(result.accessToken);
          localStorage.setItem('accessToken', result.accessToken);
          customerHomePage();
         }else{
          window.location = "/login";
          alert("Login Not found!")
        }
      })
      .catch(error => console.log('error', error));
      // sigin.reset(); 
    
  })
}

//end sign in

//get customer information DOES not trigger event

const customerform = document.querySelector("#customerForm");

if (customerform) {
  customerform.addEventListener('load', (event) => {
    event.preventDefault();
    console.log('loaded');

    //create all the varaibles incase they don't come back from the server
  const firstName = document.querySelector("#inputFirstName").value;
  const lastName = document.querySelector("#inputLastName").value;
  const phone = document.querySelector("#inputTelephoneNumber").value;
  const email= document.querySelector("#inputEmail").value;
  const address = document.querySelector("#inputAddress").value;
  const address2 = document.querySelector("inputAddress2").value;
  const city = document.querySelector("#sinputCity").value;
  const state = document.querySelector("#signin-password").value;
  const emergencyContact = document.querySelector("#signin-email").value;
  const emergencyPhone = document.querySelector("#signin-password").value;

    
  const token = (localStorage.getItem('accessToken'));
  
  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  let requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch("api/customerinformation", requestOptions)
    .then(response => response.json())
    .then(result => {
        firstName = result.firstName;
        console.log(firstName);
    })
    .catch(error => console.log('error', error));
        // customerform.reset(); 
      
    })
}


//end update customer information


//get customer information DOES not trigger event

if (customerform) {
  customerform.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log('loaded');

    //create all the varaibles incase they don't come back from the server
  
  const firstName = document.querySelector("#inputFirstName").value;
  const lastName = document.querySelector("#inputLastName").value;
  const phone = document.querySelector("#inputTelephoneNumber").value;
  const email= document.querySelector("#inputEmail").value;
  const address = document.querySelector("#inputAddress").value;
  const address2 = document.querySelector("#inputAddress2").value;
  const city = document.querySelector("#inputCity").value;
  const state = document.querySelector("#inputState").value;
  const zip = document.querySelector("#inputZip").value;
  const emergencyContact = document.querySelector("#inputEmergencyContact").value;
  const emergencyPhone = document.querySelector("#inputEmergencyTelephoneNumber").value;
    
  const token = (localStorage.getItem('accessToken'));
  
  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");


      let raw = JSON.stringify({
        "firstName": firstName,
        "lastName": lastName,
        "phone": phone,
        "address": address,
        "address2": address2,
        "city": city,
        "state": state,
        "zip": zip,
        "emergencyContact": emergencyContact,
        "emergencyPhone": emergencyPhone
      });

      let requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch("/api/customerform", requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.success) alert("Thank yu for updating your information")
        })
        .catch(error => console.log('error', error));
      // customerform.reset(); 
      
    })
}


//end update customer information