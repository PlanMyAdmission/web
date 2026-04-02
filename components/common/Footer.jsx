import React from 'react';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import Link from 'next/link';

const footerSections = [
  {
    title: 'Important Links',
    items: [
      { href: '/pricing', label: 'Pricing' },
      { href: '/how-it-works', label: 'How It Works' },
      { href: '/blogs', label: 'Blogs' },
      { href: '/contact', label: 'Contact Us' },
    ],
  },
  {
    title: 'Company',
    items: [
      { href: '/about', label: 'About Us' },
      { href: '/privacy-policy', label: 'Privacy Policy' },
      { href: '/terms-and-conditions', label: 'Terms and Conditions' },
    ],
  },
  {
    title: 'Tools',
    items: [
      { href: '/explore', label: 'Explore Universities' },
      { href: '/ai-university-matchmaker', label: 'AI University Matchmaker' },
      { href: '/essay-review', label: 'AI SOP & Essay Reviewer' },
      { href: '/recommendations', label: 'Recommendations' },
    ],
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="">
      <div className="max-w-7xl mx-auto py-8 px-8 grid lg:grid-cols-3  gap-8 text-main border-t-4 border-main">
        <div>
          <h1 className="w-full text-4xl font-bold">Plan My Admission</h1>
          <p className="py-4">
            Start your study abroad journey and Let our expert Plan & Secure
            your admission
          </p>
          <div className="flex cursor-pointer justify-start md:w-[75%] mt-3">
            <a
              href="https://instagram.com/planmyadmission?igshid=OGQ5ZDc2ODk2ZA"
              target={'_blank'}
              rel="noopener noreferrer"
            >
              <InstagramIcon
                fontSize="large"
                className="mr-3 cursor-pointer opacity-50 hover:opacity-100"
              />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61552697291311"
              target={'_blank'}
              rel="noopener noreferrer"
            >
              <FacebookIcon
                fontSize="large"
                className="mr-3 cursor-pointer  opacity-50 hover:opacity-100"
              />
            </a>
            <a
              href="https://www.youtube.com/channel/UCU5motLLs6TlH79FbnLBANg"
              target={'_blank'}
              rel="noopener noreferrer"
            >
              <YouTubeIcon
                fontSize="large"
                className="mr-3 cursor-pointer   opacity-50 hover:opacity-100"
              />
            </a>
            <a
              href="https://twitter.com/planmyadmission"
              target={'_blank'}
              rel="noopener noreferrer"
            >
              <TwitterIcon
                fontSize="large"
                className="mr-3 cursor-pointer   opacity-50 hover:opacity-100"
              />
            </a>
          </div>
        </div>
        <div className="lg:col-span-2 grid grid-cols-2 gap-5 sm:flex sm:flex-wrap md:justify-evenly justify-between md:mt-6 md:text-right text-left">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h6 className="font-bold uppercase">{section.title}</h6>
              <ul className="cursor-pointer font-medium">
                {section.items.map((item) => (
                  <li key={item.href} className="py-2 text-sm">
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <hr className="md:max-w-7xl w-full text-main mx-auto" />
      <p className="text-sm self-center text-center text-main p-5">
        © {`${currentYear} `}
        <a href="https://planmyadmission.com" className="hover:underline">
          planmyadmission™
        </a>
        . All Rights Reserved.
      </p>
    </footer>
  );
};
export default Footer;
