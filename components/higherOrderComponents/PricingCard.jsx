'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { openExternalWindow } from '@lib/clientUtils.js';
import {
  portalSignupUrl,
  supportEmail,
  supportPhone,
  whatsappSupportUrl,
} from '@lib/publicLinks.js';
const Card = (plan) => {
  const [showModal, setShowModal] = useState(false);
  const handleEnrollClick = () => {
    if (plan.price === 0) {
      window.location.href = portalSignupUrl;
      return;
    }
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto mx-4 sm:mx-0">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">Enroll Now!</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Scan QR Code to Pay
                </h3>
                <div className="flex justify-center mb-4">
                  <QRCodeSVG
                    value={`upi://pay?pa=mswipe.1430060225000556@mswipesbm&pn=MSWIPE&tr=&am=${plan.price}&cu=INR&tn=Test%20Payment`}
                    alt="Payment QR Code"
                    className="w-40 h-40 sm:w-48 sm:h-48 object-contain border-2 border-gray-200 rounded-lg"
                  />
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Scan this QR code with your preferred payment app
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-lg font-semibold text-gray-800">
                    Amount: ₹{plan.price}
                  </p>
                  <p className="text-sm text-gray-600">{plan.title}</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <svg
                      className="w-5 h-5 text-main flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span className="text-gray-700 text-sm sm:text-base break-all">
                      {supportEmail}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg
                      className="w-5 h-5 text-main flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span className="text-gray-700 text-sm sm:text-base">
                      {supportPhone}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg
                      className="w-5 h-5 text-main flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700 text-sm sm:text-base">
                      WhatsApp: {supportPhone}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  Need Help?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Our support team is available Mon to Fri 9 AM to 6 PM to
                  assist you with the enrollment process.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => openExternalWindow(`mailto:${supportEmail}`)}
                    className="flex-1 bg-main text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Email Support
                  </button>
                  <button
                    onClick={() => openExternalWindow(whatsappSupportUrl)}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white shadow-lg rounded-3xl flex flex-col">
        <div
          key={plan.title}
          className={`${plan.forInstitutions ? 'border-b-2 border-main md:mx-auto' : 'bg-light shadow-lg rounded-2xl  '} m-4 text-center `}
        >
          <h3 className="text-5xl font-bold py-2 text-main">{plan.title}</h3>
          <h3 className="text-4xl font-bold py-2 ">
            ₹{plan.price}
            <span className="text-[15px] text-grey">{plan.frequency}</span>
          </h3>
          <p className="py-4 font-bold">{plan.description}</p>
        </div>

        <ul className="mt-6 space-y-4 px-8 flex-1">
          {plan.features.map((feature) => {
            return (
              <li key={feature} className="leading-6 flex">
                <svg
                  className="w-5 h-5 shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 14.967 14.967"
                >
                  <path
                    id="icons8-check-all"
                    d="M3.627,2A1.611,1.611,0,0,0,2,3.627v8.785a1.611,1.611,0,0,0,1.627,1.627h8.785a1.611,1.611,0,0,0,1.627-1.627V4.542l-.651.712v7.158a.959.959,0,0,1-.976.976H3.627a.959.959,0,0,1-.976-.976V3.627a.959.959,0,0,1,.976-.976h8.592l.549-.62c-.13,0-.226-.031-.356-.031Zm9.517,1.088L7.511,9.351,4.817,6.962l-.427.488,2.928,2.6.244.214.214-.244,5.857-6.507Zm1.546,1.84v.651h.651a.959.959,0,0,1,.976.976V15.34a.959.959,0,0,1-.976.976H6.555a.959.959,0,0,1-.976-.976V14.69H4.928v.651a1.611,1.611,0,0,0,1.627,1.627H15.34a1.611,1.611,0,0,0,1.627-1.627V6.555A1.611,1.611,0,0,0,15.34,4.928Z"
                    transform="translate(-2 -2)"
                    fill="currentColor"
                  />
                </svg>
                <span className="ml-3">{feature}</span>
              </li>
            );
          })}
        </ul>
        {plan.price != 0 && (
          <p className="text-xs text-red-500 mt-4 px-8">
            * Refund requests must be made within 7 days of payment and will be
            processed at the discretion of PlanMyAdmission.
          </p>
        )}
        {plan.forInstitutions === true ? (
          <button
            className={
              'mt-8 mb-5 block border border-main rounded-full mx-6 py-2 px-3 text-center font-semibold cursor-not-allowed'
            }
            disabled={true}
            onClick={handleEnrollClick}
          >
            {plan.cta}
          </button>
        ) : (
          <button
            className={
              'mt-8 mb-5 block border border-main rounded-full mx-6 py-2 px-3 text-center hover:text-white hover:bg-main font-semibold'
            }
            onClick={handleEnrollClick}
          >
            {plan.cta}
          </button>
        )}
      </div>
    </>
  );
};
export default Card;
