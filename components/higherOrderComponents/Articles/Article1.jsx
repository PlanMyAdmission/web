'use client';

import Image from 'next/image';

import React from 'react';
import Header from '@/components/higherOrderComponents/Header.jsx';
const article = '/images/articles/article1.png';
const article2 = '/images/articles/article2.png';
const article3 = '/images/articles/article3.png';
const article4 = '/images/articles/article4.png';
import { useRouter } from 'next/navigation';
const Article1 = () => {
  const router = useRouter();
  return (
    <>
      <div className="max-w-5xl mx-auto bg-light mx-auto px-5 p-10 rounded-xl my-5 mt-20 grid grid-cols-1 sm:grid-cols-2 justify-center items-center gap-7">
        <Image
          unoptimized
          width={1200}
          height={800}
          sizes="100vw"
          src={article}
          alt=""
          className="w-6/7 rounded-xl col-span-1 items-center justify-center"
        />
        <div className="col-span-1 text-4xl font-bold">
          <p>
            Navigating the American Campus | A Student&apos;s Guide to Living in
            the USA
          </p>
          <p className="text-sm mt-5">
            Blog By: <b>Plan My Admission</b>
          </p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto bg-transparent mx-auto my-3 mt-16 grid grid-cols-3 gap-2">
        <div className="w-full mx-auto bg-transparent mx-auto justify-center gap-2 p-5 col-span-3 md:col-span-2 flex flex-col">
          <p className="text-2xl">
            Venturing into the United States for higher education is not just a
            journey through academia; it&apos;s an exploration of diverse
            cultures, a rendezvous with new friendships, and an immersion into a
            lifestyle shaped by opportunity and innovation. In this guide,
            we&apos;ll walk you through the essentials of student life in the
            USA, offering insights and tips for making the most of your time in
            this land of possibilities.
          </p>
          <div className="w-full mx-auto bg-light rounded-xl mt-5 mx-auto justify-center gap-1 p-5 col-span-2 flex flex-col">
            <p className="text-2xl font-bold">Table of Contents</p>
            <p className="text-lg text-main ">1. Academic Landscape</p>
            <p className="text-lg text-main ">2. Cultural Diversity</p>
            <p className="text-lg text-main ">
              3. Accommodation and Living Arrangements
            </p>
            <p className="text-lg text-main ">4. Financial Considerations</p>
            <p className="text-lg text-main ">5. Healthcare System</p>
            <p className="text-lg text-main ">6. Transportation</p>
          </div>
          <p className="text-2xl font-bold mt-6">Academic Landscape</p>
          <p className="font-bold text-xl mt-3 pl-1">
            Diverse Education System
          </p>

          <p className="text-md pl-1">
            The American education system is renowned for its flexibility and
            breadth. From liberal arts colleges to research-intensive
            universities, students have a plethora of institutions to choose
            from. The emphasis is often on fostering critical thinking,
            collaboration, and independent research, preparing students for a
            dynamic and evolving global landscape.
          </p>

          <p className="font-bold text-xl mt-3 pl-1">
            Active Learning Environment
          </p>

          <p className="text-md pl-1">
            The American classroom is not just a space for lectures; it&apos;s a
            forum for active engagement. Professors encourage students to
            participate in discussions, express their opinions, and challenge
            conventional ideas. Group projects, presentations, and hands-on
            experiences are integral components of the American education
            experience.
          </p>

          <p className="text-2xl font-bold mt-6">Cultural Diversity</p>
          <p className="font-bold text-xl mt-3 pl-1">Melting Pot of Cultures</p>

          <p className="text-md pl-1">
            One of the defining features of living in the USA is its cultural
            diversity. Each state, city, and even university campus contributes
            to this rich tapestry. You&apos;ll encounter people from various
            backgrounds, ethnicities, and walks of life. Embrace this diversity,
            as it will not only enrich your education but also broaden your
            perspectives on a global scale.
          </p>

          <p className="font-bold text-xl mt-3 pl-1">Social Etiquette</p>

          <p className="text-md pl-1">
            Americans are generally open, friendly, and value direct
            communication. Engaging in small talk with strangers is common, and
            politeness is highly regarded. Understanding these social norms will
            help you integrate smoothly into your new environment. Don&apos;t be
            afraid to initiate conversations and make connections with your
            fellow students.
          </p>

          <p className="text-2xl font-bold mt-6">
            Accommodation and Living Arrangements
          </p>
          <p className="font-bold text-xl mt-3 pl-1">On-Campus Housing</p>

          <p className="text-md pl-1">
            Many universities offer on-campus housing options, providing
            convenience and a sense of community. Living on campus allows you to
            be in close proximity to academic buildings, social activities, and
            campus resources. It&apos;s a great way to immerse yourself in the
            university experience, especially during your first year.
          </p>

          <p className="font-bold text-xl mt-3 pl-1">Off-Campus Apartments</p>

          <p className="text-md pl-1">
            If you prefer more independence, off-campus housing is a popular
            choice. Renting an apartment gives you the flexibility to explore
            the local community and experience life beyond the campus. Be sure
            to research neighborhoods, consider transportation options, and
            factor in commute times to your classes.
          </p>

          <p className="text-2xl font-bold mt-6">Financial Considerations</p>
          <p className="font-bold text-xl mt-3 pl-1">Cost of Living</p>

          <p className="text-md pl-1">
            The cost of living varies across the country. Urban areas tend to
            have higher living expenses, including housing, groceries, and
            transportation. Consider your budget carefully and explore
            cost-saving strategies, such as purchasing used textbooks, cooking
            at home, and taking advantage of student discounts.
          </p>

          <p className="font-bold text-xl mt-3 pl-1">Part-Time Employment</p>

          <p className="text-md pl-1">
            Many international students work part-time during their studies to
            gain experience and supplement their income. Check the regulations
            for international students working in the USA and explore on-campus
            job opportunities, internships, or work-study programs offered by
            the university.
          </p>

          <p className="text-2xl font-bold mt-6">Healthcare System</p>
          <p className="font-bold text-xl mt-3 pl-1">Health Insurance</p>

          <p className="text-md pl-1">
            Having comprehensive health insurance is non-negotiable. The USA
            does not have a public healthcare system, so it&apos;s crucial to
            have insurance coverage. Most universities provide health insurance
            plans for international students, ensuring you have access to
            medical services and facilities when needed.
          </p>

          <p className="font-bold text-xl mt-3 pl-1">Campus Health Services</p>

          <p className="text-md pl-1">
            Universities typically have on-campus health services that provide
            basic medical care, counseling, and support. Familiarize yourself
            with these services, understand the process for making appointments,
            and know the location of the nearest hospitals or clinics
          </p>

          <p className="text-2xl font-bold mt-6">Transportation</p>
          <p className="font-bold text-xl mt-3 pl-1">Public Transportation</p>

          <p className="text-md pl-1">
            Transportation options vary by city, but many urban areas have
            efficient public transportation systems, including buses and trains.
            Consider getting a student discount on transportation passes to make
            commuting more affordable. Familiarize yourself with schedules and
            routes to navigate the city seamlessly.
          </p>

          <p className="font-bold text-xl mt-3 pl-1">Driving in the USA</p>

          <p className="text-md pl-1">
            If you choose to drive, be aware of the local traffic laws and
            regulations. Obtaining a driver&apos;s license may be necessary,
            depending on your state of residence. Research the process, and if
            needed, take advantage of international student orientations that
            often provide information on driving in the USA.
          </p>
        </div>
        <div className="w-full bg-transparent mx-auto gap-2 p-5 col-span-1 flex flex-col hidden md:block">
          <p className="font-bold text-2xl p-2">Popular Blog Posts</p>
          <div className="border-b-4  border-b-main w-1/5 ml-2 mb-5 items-center flex justify-center block"></div>

          <div className="w-full px-1 text text-2xs">
            <div
              className="flex flex-row hover:cursor-pointer justify-between border-b-2 border-solid gap-2 border-main my-3 pb-3 "
              onClick={() => {
                router.push('/Pennsylvania-State-University');
              }}
            >
              <Image
                unoptimized
                width={1200}
                height={800}
                sizes="100vw"
                src={article3}
                alt=""
                className="w-1/3 rounded-md h-1/4 items-center justify-center"
              />
              <div className=" font-bold">
                <p>
                  Pennsylvania State University | Elevating Education to
                  Unparalleled Heights
                </p>
              </div>
            </div>
            <div
              className="flex flex-row hover:cursor-pointer justify-between border-b-2 border-solid gap-2 border-main my-3 pb-3 "
              onClick={() => {
                router.push('/Mastering-the-Art-of-Financial-Planning');
              }}
            >
              <Image
                unoptimized
                width={1200}
                height={800}
                sizes="100vw"
                src={article4}
                alt=""
                className="w-1/3 rounded-md h-1/4 items-center justify-center"
              />
              <div className=" font-bold">
                <p>
                  Mastering the Art of Financial Planning for Your Study Abroad
                  Adventure
                </p>
              </div>
            </div>
            <div
              className="flex flex-row  hover:cursor-pointer justify-between border-b-2 border-solid gap-2 border-main my-3 pb-3 "
              onClick={() => {
                router.push('/Embarking-on-Excellence');
              }}
            >
              <Image
                unoptimized
                width={1200}
                height={800}
                sizes="100vw"
                src={article2}
                alt=""
                className="w-1/3 rounded-md h-1/4 items-center justify-center"
              />
              <div className=" font-bold">
                <p>
                  Embarking on Excellence | A Comprehensive Guide to Studying
                  Abroad
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Article1;
