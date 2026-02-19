import Image from 'next/image';

import React from 'react';
import Header from '@components/higherOrderComponents/Header';
const contactus = '/images/about-us/contactus.svg';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import JoinUsForm from '@/components/home/JoinUsForm.jsx';
const Contact = () => {
  return (
    <div>
      <Header heading={'Contact Us'} />
      <div className="grid md:grid-cols-2 items-center justify-center mx-w-7xl mx-auto">
        {}
        <div className="-mt-24 flex items-center justify-center">
          <Image
            unoptimized
            src={contactus}
            alt="contactus"
            className="w-[500px] h-auto"
            width={500}
            height={500}
          />
        </div>

        {}

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

      {}

      <div className="grid md:grid-cols-2 grid-cols-1 gap-10  max-w-7xl mx-auto bg-light rounded-lg  md:mb-20 mb-10  ">
        <div className="md:space-x-10 px-5">
          <h1 className="sm:text-5xl text-3xl font-bold sm:px-10 py-5">
            Contact Details
          </h1>
          <p className="py-5">
            Thank you for considering Planmyadmission as your trusted partner
            for your overseas education journey. Our team of dedicated
            professionals is here to provide you with unparalleled support and
            guidance to help you achieve your dream of studying abroad.<br></br>
            We understand that the decision to study in a foreign country can be
            overwhelming and we are here to make the process easier for you. Our
            AI/ML solution is designed to personalize your experience and
            provide you with tailored recommendations based on your academic
            background and preferences.
          </p>
          <label className="font-bold py-2">Email</label>
          <p className="md:pb-5 pb-2">support@planmyadmission.com</p>
          <label className="font-bold py-2">Phone</label>
          <p className="md:pb-5 pb-2">+91 8828099194</p>
          <label className="font-bold py-2">Location</label>
          <p className="pb-5">
            PlanMyAdmission - Horizon, Datta Mandir Road, Bhandup West, Mumbai -
            400078
            <br />
            {}
          </p>
          {}
          <div className="pb-10 flex cursor-pointer justify-start md:w-[75%] mt-3 text-main">
            <a
              href="https://instagram.com/planmyadmission?igshid=OGQ5ZDc2ODk2ZA"
              target={'_blank'}
            >
              <InstagramIcon
                fontSize="large"
                className="mr-3 cursor-pointer  opacity-50 hover:opacity-100"
              />
            </a>

            {}
            <a
              href="https://www.facebook.com/profile.php?id=61552697291311"
              target={'_blank'}
            >
              <FacebookIcon
                fontSize="large"
                className="mr-3 cursor-pointer  opacity-50 hover:opacity-100"
              />
            </a>
            <a
              href="https://www.youtube.com/channel/UCU5motLLs6TlH79FbnLBANg"
              target={'_blank'}
            >
              <YouTubeIcon
                fontSize="large"
                className="mr-3 cursor-pointer  opacity-50 hover:opacity-100"
              />
            </a>
          </div>
        </div>
        <Form />
      </div>
    </div>
  );
};
const Form = () => {
  let style =
    'outline-none focus:outline-none bg-light px-2 py-2 my-2 form-control rounded-sm focus:border focus:border-main transition ease-in-out duration-900 form-control';
  let check_for = "after:absolute after:text-main after:content-['*']";
  return (
    <div className="relative ">
      <div
        className="flex  flex-col md:w-2/3 w-[90vw] border border-main rounded-xl md:px-8 px-3 py-5 md:-translate-y-[200px] bg-white mx-auto"
        target="_blank"
        action="https://formsubmit.co/7d15bde2f29f8a6c5a261986268d68a7"
        method="POST"
      >
        <JoinUsForm className={' w-[100%]'} />
      </div>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.9193094843877!2d72.93874407598106!3d19.15500904948591!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b8615c9625ed%3A0x3c4edf53b3cb7ec4!2sAtul%20projects%20horizon!5e0!3m2!1sen!2sin!4v1759326710531!5m2!1sen!2sin"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="hidden md:block absolute w-full bottom-10 h-[250px] px-5"
      ></iframe>
      {}
    </div>
  );
};
export default Contact;
