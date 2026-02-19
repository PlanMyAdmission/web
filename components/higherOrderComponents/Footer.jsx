import React from 'react';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import Link from 'next/link';
const Footer = () => {
  const year = new Date();
  let currentYear = year.getFullYear();
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
            >
              <InstagramIcon
                fontSize="large"
                className="mr-3 cursor-pointer opacity-50 hover:opacity-100"
              />
            </a>
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
                className="mr-3 cursor-pointer   opacity-50 hover:opacity-100"
              />
            </a>
            <a href="https://twitter.com/planmyadmission" target={'_blank'}>
              <TwitterIcon
                fontSize="large"
                className="mr-3 cursor-pointer   opacity-50 hover:opacity-100"
              />
            </a>
          </div>
        </div>
        <div className="lg:col-span-2 grid grid-cols-2 sm:flex sm:grid-none gap-5  md:justify-evenly justify-between md:mt-6 md:text-right text-left">
          {}
          {}
          <div className="">
            <h6 className="font-bold uppercase">Important links</h6>
            <ul className="cursor-pointer font-medium">
              <li className="py-2 text-sm">
                <Link href="/pricing">Pricing</Link>
              </li>
              <li className="py-2 text-sm">
                <Link href="/how-it-works">How It Works</Link>
              </li>
              <li className="py-2 text-sm">
                <Link href="/terms&conditions">Terms and conditions</Link>
              </li>
              <li className="py-2 text-sm">
                <Link href="/privacy-policy">Privacy Policy</Link>
              </li>
            </ul>
          </div>
          <div className="">
            <h6 className="font-bold uppercase">Contact Details</h6>
            <ul className="cursor-pointer font-medium">
              <li className="py-2 text-sm">About</li>
              <li className="py-2 text-sm">
                <Link href="/blogs">Blog</Link>
              </li>
              {}
            </ul>
          </div>
          <div className="">
            <h6 className="font-bold uppercase">Others</h6>
            <ul className="cursor-pointer font-medium">
              <li className="py-2 text-sm">
                <Link href="/explore">Explore University</Link>
              </li>
              <li className="py-2 text-sm">
                <Link href="/explore">Courses</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <hr className="md:max-w-7xl w-full text-main mx-auto" />
      <p className="text-sm self-center text-center text-main p-5">
        © {`${currentYear} `}
        <a
          href="https://planmyadmission.netlify.app"
          className="hover:underline"
        >
          planmyadmission™
        </a>
        . All Rights Reserved.
      </p>
    </footer>
  );
};
export default Footer;
