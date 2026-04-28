'use client';

import Image from 'next/image';

import React from 'react';
import Header from '@/components/common/Header';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import JoinUsForm from '@/components/home/JoinUsForm.jsx';
import {
  supportEmail,
  supportPhone,
  whatsappSupportUrl,
} from '@/lib/publicLinks.js';

const contactus = '/images/about/contactus.svg';
const officeAddress =
  'PlanMyAdmission - Horizon, Datta Mandir Road, Bhandup West, Mumbai - 400078';
const officeMapUrl =
  'https://www.google.com/maps/search/?api=1&query=Atul+Projects+Horizon+Bhandup+West+Mumbai';
const supportPhoneHref = supportPhone.replace(/\s+/g, '');
const socialLinks = [
  {
    href: 'https://instagram.com/planmyadmission?igshid=OGQ5ZDc2ODk2ZA',
    label: 'Instagram',
    Icon: InstagramIcon,
  },
  {
    href: 'https://www.facebook.com/profile.php?id=61552697291311',
    label: 'Facebook',
    Icon: FacebookIcon,
  },
  {
    href: 'https://www.youtube.com/channel/UCU5motLLs6TlH79FbnLBANg',
    label: 'YouTube',
    Icon: YouTubeIcon,
  },
];
const quickActions = [
  {
    label: 'Email us',
    value: supportEmail,
    href: `mailto:${supportEmail}`,
    Icon: EmailOutlinedIcon,
  },
  {
    label: 'Call us',
    value: supportPhone,
    href: `tel:${supportPhoneHref}`,
    Icon: PhoneInTalkOutlinedIcon,
  },
  {
    label: 'WhatsApp',
    value: 'Chat with our team',
    href: whatsappSupportUrl,
    Icon: WhatsAppIcon,
    external: true,
  },
  {
    label: 'Visit office',
    value: 'Open Google Maps',
    href: officeMapUrl,
    Icon: LocationOnOutlinedIcon,
    external: true,
  },
];

const Contact = () => {
  return (
    <main className="pb-10 md:pb-14">
      <Header heading={'Contact Us'} />
      <section className="max-w-7xl mx-auto px-5 md:px-6 grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="rounded-[32px] bg-light px-6 py-8 md:px-8 md:py-10">
          <div className="grid gap-8 md:grid-cols-[0.95fr_1.05fr] md:items-center">
            <div className="flex justify-center">
              <Image
                unoptimized
                src={contactus}
                alt="Contact Plan My Admission"
                className="w-full max-w-[360px] h-auto"
                width={500}
                height={500}
              />
            </div>

            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-main/80">
                Let&apos;s Talk
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#4b2740] md:text-4xl">
                Start planning your overseas admission with a real counsellor.
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#5f4a5a] md:text-base">
                Whether you are shortlisting universities, planning your tests,
                or preparing for applications, our team can help you turn the
                next step into a concrete plan.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {quickActions.map(({ label, value, href, Icon, external }) => (
                  <a
                    key={label}
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    className="rounded-2xl border border-main/15 bg-white px-4 py-4 transition hover:-translate-y-0.5 hover:border-main/40"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-main/10 text-main">
                        <Icon fontSize="small" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[#4b2740]">
                          {label}
                        </p>
                        <p className="text-sm text-[#6f5566]">{value}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-main/15 bg-white p-4 shadow-sm md:p-6">
          <p className="text-sm uppercase tracking-[0.18em] text-main/80">
            Free Consultation
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[#4b2740] md:text-3xl">
            Tell us where you want to study.
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#5f4a5a]">
            Share your details and our team will reach out to guide you on
            universities, applications, and the next best move for your profile.
          </p>
          <div className="mt-6">
            <JoinUsForm className="w-full mb-0" sourcePage="contact_page" />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 md:px-6 mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[32px] bg-light px-6 py-8 md:px-8">
          <h2 className="text-3xl font-semibold text-[#4b2740]">
            Contact Details
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#5f4a5a] md:text-base">
            Thank you for considering PlanMyAdmission as your trusted partner
            for your overseas education journey. Our team combines expert human
            guidance with AI-assisted workflows so you can make confident
            decisions faster.
          </p>

          <div className="mt-8 space-y-5">
            <DetailRow
              label="Email"
              value={supportEmail}
              href={`mailto:${supportEmail}`}
            />
            <DetailRow
              label="Phone"
              value={supportPhone}
              href={`tel:${supportPhoneHref}`}
            />
            <DetailRow
              label="Location"
              value={officeAddress}
              href={officeMapUrl}
              external
            />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4 text-main">
            {socialLinks.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="rounded-full border border-main/20 bg-white p-3 transition hover:-translate-y-0.5 hover:border-main/40"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] bg-gradient-to-br from-main to-[#ff8ab3] px-6 py-8 text-white md:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
              <LocationOnOutlinedIcon />
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/80">
                Mumbai Office
              </p>
              <p className="text-sm text-white/85">
                Prefer an in-person consultation? Visit the team in Bhandup.
              </p>
            </div>
          </div>

          <h2 className="mt-8 text-3xl font-semibold leading-tight">
            Meet us offline and move faster on your shortlist, applications, and
            next steps.
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/85 md:text-base">
            Bring your profile, target countries, or current application
            questions and we will help you structure the next phase clearly.
          </p>

          <div className="mt-6 rounded-[24px] border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/80">
              Address
            </p>
            <p className="mt-2 text-lg font-medium leading-7">
              {officeAddress}
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a
              href={officeMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-main transition hover:bg-[#fff3f8]"
            >
              Open in Google Maps
              <OpenInNewIcon fontSize="small" />
            </a>
            <a
              href={whatsappSupportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              WhatsApp the Team
              <WhatsAppIcon fontSize="small" />
            </a>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <InfoChip label="Shortlisting" />
            <InfoChip label="Applications" />
            <InfoChip label="Visa & SOP" />
          </div>
        </div>
      </section>
    </main>
  );
};

const DetailRow = ({ label, value, href, external = false }) => {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-4">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-main/80">
        {label}
      </p>
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className="mt-2 inline-flex text-sm leading-6 text-[#4b2740] transition hover:text-main"
      >
        {value}
      </a>
    </div>
  );
};

const InfoChip = ({ label }) => {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-center text-sm font-medium text-white backdrop-blur-sm">
      {label}
    </div>
  );
};

export default Contact;
