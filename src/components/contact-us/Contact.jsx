import React from "react";
import Header from "../../higherOrderComponents/Header";
import contactus from "../../assets/about-us/contactus.svg";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from '@mui/icons-material/Facebook';
import { Helmet } from "react-helmet";

const Contact = () => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Contact - Plan My Admission</title>
      </Helmet>
      <Header heading={"Contact Us"} />
      <div className="grid md:grid-cols-2 items-center justify-center mx-w-7xl mx-auto">
        {/* <div className="md:mb-2 -mt-24 md:w-1/3 relative md:left-40 mx-auto md:mx-0 "> */}
        <div className="-mt-24 flex items-center justify-center">
          <img src={contactus} alt="contactus" className="" width={"500px"} />
        </div>

        {/* dummy code but necessary for image loading */}

        <div className="hidden md:block select-none text-white">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio ut illo
          fuga voluptatum quidem eveniet ipsa ratione at ad maxime? Nesciunt
          quaerat voluptatum ducimus ipsam quasi officiis inventore asperiores
          harum at fugiat eligendi, impedit unde deserunt eveniet tenetur
          maiores hic deleniti blanditiis ipsa nostrum dolorum ut debitis itaque
          amet! Perspiciatis! Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Odio ut illo fuga voluptatum quidem eveniet ipsa ratione at ad
          maxime? Nesciunt quaerat voluptatum ducimus ipsam quasi officiis
          inventore asperiores harum at fugiat eligendi, impedit unde deserunt
          eveniet tenetur maiores hic deleniti blanditiis ipsa nostrum dolorum
          ut debitis itaque amet! Perspiciatis! maxime? Nesciunt quaerat
          voluptatum ducimus ipsam quasi officiis inventore asperiores harum at
          fugiat eligendi, impedit unde deserunt eveniet tenetur maiores hic
          deleniti blanditiis ipsa nostrum dolorum ut debitis itaque amet!
          Perspiciatis!
        </div>
      </div>

      {/* <div className="max-w-7xl md:mx-auto flex md:flex-row -mt-20 justify-center items-center  gap-5">
        <div className="-mt-8 md:w-1/3">
          <img src={contactus} alt="" className="" />
        </div>
        <div className="hidden md:block md:w-1/2 md:px-10 text-white"></div>
      </div> */}

      <div className="grid md:grid-cols-2 grid-cols-1 gap-10  max-w-7xl mx-auto bg-light rounded-lg  md:mb-20 mb-10  ">
        <div className="md:space-x-10 px-5">
          <h1 className="sm:text-5xl text-3xl font-bold sm:px-10 py-5">
            Contact Details
          </h1>
          <p className="py-5">
            Thank you for considering Planmyadmission as your trusted partner for your overseas education journey. Our team of dedicated professionals is here to provide you with unparalleled support and guidance to help you achieve your dream of studying abroad.<br></br>
            We understand that the decision to study in a foreign country can be overwhelming and we are here to make the process easier for you. Our AI/ML solution is designed to personalize your experience and provide you with tailored recommendations based on your academic background and preferences.

          </p>
          <label className="font-bold py-2">Email</label>
          <p className="md:pb-5 pb-2">planmyadmission.com@gmail.com</p>
          <label className="font-bold py-2">Phone</label>
          <p className="md:pb-5 pb-2">+91 9372349731</p>
          <label className="font-bold py-2">Location</label>
          <p className="pb-5">
            PlanMyAdmission - Samarth Garden, Datta Mandir Road, Bhandup 400078
            <br />
            {/* <span className="text-main">View it on Google Map</span> */}
          </p>
          {/* <p>
            We would love to hear from you and answer any questions you may have. Please feel free to reach out to us through our contact form, email, or phone. Our team will be happy to assist you in any way possible. Let us be a part of your exciting journey towards a successful international education. We look forward to hearing from you soon.
          </p> */}
          <div className="pb-10 flex cursor-pointer justify-start md:w-[75%] mt-3 text-main">
            <a href="https://instagram.com/planmyadmission?igshid=OGQ5ZDc2ODk2ZA" target={"_blank"}>
              <InstagramIcon fontSize="large" className="mr-3 cursor-pointer  opacity-50 hover:opacity-100" /></a>

            {/* <LinkedInIcon fontSize="large" className="mr-3 cursor-pointer" /> */}
            <a href="https://www.facebook.com/profile.php?id=61552697291311" target={"_blank"}>
              <FacebookIcon
                fontSize="large"
                className="mr-3 cursor-pointer  opacity-50 hover:opacity-100"
              /></a>
            <a href="https://www.youtube.com/channel/UCU5motLLs6TlH79FbnLBANg" target={"_blank"}>
              <YouTubeIcon fontSize="large" className="mr-3 cursor-pointer  opacity-50 hover:opacity-100" /></a>
          </div>
        </div>
        <Form />
      </div>
    </div>
  );
};

const Form = () => {
  let style =
    "outline-none focus:outline-none bg-light px-2 py-2 my-2 form-control rounded-sm focus:border focus:border-main transition ease-in-out duration-900 form-control";
  let check_for = "after:absolute after:text-main after:content-['*']";
  return (
    <div className="relative ">
      <form className="flex  flex-col md:w-2/3 w-[90vw] border border-main rounded-xl md:px-8 px-3 py-5 md:-translate-y-[320px] bg-white mx-auto" target="_blank" action="https://formsubmit.co/7d15bde2f29f8a6c5a261986268d68a7" method="POST">
        <label htmlFor="Full Name" className={check_for}>
          Full Name
        </label>
        <input type="text" className={style} name="name" required></input>
        <label htmlFor="email" className={check_for}>
          Email
        </label>
        <input type="email" name="email" className={style} requried></input>
        <label htmlFor="Full Name">Phone Number</label>
        <input
          type="tel"
          name="tel"
          className={style}
          requried
          pattern="^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$"
        ></input>
        <label htmlFor="Full Name" className={check_for}>
          Subject
        </label>
        <input type="text" name="subject" className={style} requried></input>
        <label className={check_for}>Message</label>
        <textarea className={style} requried rows="5" name="message" ></textarea>
        <button
          type="submit"
          className="bg-main py-2 my-4 rounded-sm text-white"
        >
          Submit
        </button>
      </form>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.8763366259523!2d72.93846841112874!3d19.156889681989608!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b86721f841d7%3A0x8a2f54f532ea5fa9!2sSwami%20Smarth!5e0!3m2!1sen!2sin!4v1698586185308!5m2!1sen!2sin"
        // style="border:0;"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="hidden md:block absolute w-full bottom-10 h-[250px] px-5"
      ></iframe>
    </div>
  );
};

export default Contact;

// <div className="max-w-7xl mx-auto rounded-lg bg-light flex justify-center items-center my-20">
// <div className=" md:w-1040px p-10 justify-between">
//   <div className="flex-1">
//     {" "}
//     <h1 className="font-bold text-[45px] mb-5">Contact Details</h1>
//     <p>
//       Lorem ipsum dolor sit amet consectetur adipisicing elit.
//       Voluptatibus itaque eligendi accusantium dignissimos ipsum
//       voluptates totam suscipit quis officiis a pariatur distinctio,
//       libero tempora facere deleniti quasi! Consequuntur, rem odit!
//     </p>
//     <h1 className="font-bold mt-4">Email</h1>
//     <p>info@planmyadmission.com</p>
//     <h1 className="font-bold mt-2 ">Phone</h1>
//     <p>+91 9876543218</p>
//     <h1 className="font-bold mt-2">Location</h1>
//     <p>
//       Mumbai, India: 504, Quantum Towers, Rambaug Lane, Behind SBI Bank,
//       Off SV Road, Malad West, Mumbai, Maharashtra- 400064
//     </p>
//     <a href="" className="text-main">
//       View on Google Maps
//     </a>
//     <p>
//       U.S.A: 33 Boston Post Road,W Suite 600, Marlborough MA, USA -
//       01752
//     </p>
//   </div>
//   <Card />
// </div>
// </div>

// Chaudhary_deep@yahoo.com
