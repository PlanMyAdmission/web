'use client';

import Image from 'next/image';

import React from 'react';
import Header from '@/components/higherOrderComponents/Header.jsx';
import article from '@assets/articles/article3.png';
import article2 from '@assets/articles/article2.png';
import article1 from '@assets/articles/article1.png';
import article4 from '@assets/articles/article4.png';
import { useRouter } from 'next/navigation';
const Article3 = () => {
  const router = useRouter();
  return (
    <>
      <div className="max-w-5xl mx-auto bg-light mx-auto px-5 p-10 rounded-xl my-5 mt-20 grid grid-cols-1 sm:grid-cols-2 justify-center items-center gap-7">
        <Image
          unoptimized
          width={0}
          height={0}
          sizes="100vw"
          src={article}
          alt=""
          className="w-6/7 rounded-xl col-span-1 items-center justify-center"
        />
        <div className="col-span-1 text-4xl font-bold">
          <p>
            Pennsylvania State University | Elevating Education to Unparalleled
            Heights
          </p>
          <p className="text-sm mt-5">
            Blog By: <b>Plan My Admission</b>
          </p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto bg-transparent mx-auto my-3 mt-16 grid grid-cols-3 gap-2">
        <div className="w-full mx-auto bg-transparent mx-auto justify-center gap-2 p-5 col-span-3 md:col-span-2 flex flex-col">
          <p className="text-2xl">
            In the realm of higher education, few institutions stand as tall and
            proud as Pennsylvania State University. Established in 1855, Penn
            State has evolved into a powerhouse of academic excellence,
            innovation, and community engagement. This blog explores why
            Pennsylvania State University is widely regarded as one of the best
            universities for education, attracting students globally seeking a
            transformative and unparalleled learning experience.
          </p>
          <div className="w-full mx-auto bg-light rounded-xl mt-5 mx-auto justify-center gap-1 p-5 col-span-2 flex flex-col">
            <p className="text-2xl font-bold">Table of Contents</p>
            <p className="text-lg text-main ">1. Diverse Academic Offerings</p>
            <p className="text-lg text-main ">2. World-Class Faculty</p>
            <p className="text-lg text-main ">
              3. Cutting-Edge Research Opportunities
            </p>
            <p className="text-lg text-main ">4. Entrepreneurial Ecosystem</p>
            <p className="text-lg text-main ">5. Global Engagement</p>
            <p className="text-lg text-main ">6. State-of-the-Art Facilities</p>
            <p className="text-lg text-main ">7. Vibrant Campus Culture</p>
            <p className="text-lg text-main ">8. Traditions and Spirit</p>
            <p className="text-lg text-main ">9. Philanthropic Impact</p>
          </div>
          <p className="text-2xl font-bold mt-6">Diverse Academic Offerings</p>

          <p className="text-md pl-1">
            Penn State&apos;s commitment to providing a comprehensive education
            is reflected in its vast array of academic programs. Whether
            you&apos;re drawn to liberal arts, engineering, business, health
            sciences, or information technology, Penn State offers a diverse
            range of undergraduate and graduate programs. This breadth allows
            students to explore their passions, fostering a well-rounded
            educational experience.
          </p>

          <p className="text-2xl font-bold mt-6">World-Class Faculty</p>

          <p className="text-md pl-1">
            At the core of any great university is its faculty, and Penn State
            is no exception. The university&apos;s faculty comprises
            accomplished scholars, researchers, and industry experts dedicated
            to imparting knowledge and fostering critical thinking. Students
            have the privilege of learning from individuals at the forefront of
            their fields, ensuring a high-quality and intellectually stimulating
            education.
          </p>

          <p className="text-2xl font-bold mt-6">
            Cutting-Edge Research Opportunities
          </p>

          <p className="text-md pl-1">
            Penn State&apos;s commitment to research and innovation places it in
            the echelons of elite institutions. The university is home to
            numerous research centers and institutes, providing students with
            unparalleled opportunities to contribute to groundbreaking research.
            Engaging in real-world research projects equips Penn State graduates
            with the skills and knowledge needed to excel in their chosen
            fields.
          </p>

          <p className="text-2xl font-bold mt-6">Entrepreneurial Ecosystem</p>

          <p className="text-md pl-1">
            In today&apos;s rapidly evolving world, fostering an entrepreneurial
            mindset is crucial. Penn State recognizes this and has developed a
            vibrant entrepreneurial ecosystem. The university actively supports
            students in turning their innovative ideas into reality. Programs,
            resources, and initiatives geared toward entrepreneurship prepare
            students for success in an ever-changing global landscape.
          </p>

          <p className="text-2xl font-bold mt-6">Global Engagement</p>

          <p className="text-md pl-1">
            Penn State&apos;s commitment to global perspectives is evident in
            its diverse student body and international programs. The university
            encourages students to embrace a global mindset through study abroad
            opportunities, international research collaborations, and cultural
            exchange initiatives. This global engagement prepares students for a
            interconnected and interdependent world.
          </p>

          <p className="text-2xl font-bold mt-6">State-of-the-Art Facilities</p>

          <p className="text-md pl-1">
            Penn State&apos;s commitment to excellence extends to its
            facilities. Cutting-edge laboratories, libraries, and
            technology-equipped classrooms create an environment conducive to
            learning and research. The university&apos;s investment in modern
            infrastructure ensures that students have access to the tools and
            resources needed for academic success.
          </p>

          <p className="text-2xl font-bold mt-6">Vibrant Campus Culture</p>

          <p className="text-md pl-1">
            A thriving campus culture is an integral part of the Penn State
            experience. The University Park campus in State College buzzes with
            activity, offering a blend of academic and extracurricular
            opportunities. Diverse student organizations, cultural events, and
            spirited athletic activities contribute to a vibrant and inclusive
            community.
          </p>

          <p className="text-2xl font-bold mt-6">Traditions and Spirit</p>

          <p className="text-md pl-1">
            Penn State&apos;s rich traditions and spirited atmosphere contribute
            to a sense of pride and belonging. The iconic &quot;We Are&quot;
            chant and the Nittany Lion mascot symbolize the unity and resilience
            of the Penn State community. Engaging in these traditions fosters a
            strong sense of identity and camaraderie among students and alumni.
          </p>

          <p className="text-2xl font-bold mt-6">Philanthropic Impact</p>

          <p className="text-md pl-1">
            Penn State&apos;s commitment to making a positive impact extends
            beyond the campus. The university hosts THON, the largest
            student-run philanthropy globally, raising funds for pediatric
            cancer research and support. This commitment to philanthropy
            underscores the university&apos;s ethos of contributing to the
            betterment of society.
          </p>
          <p className="text-md pl-1">
            Pennsylvania State University&apos;s reputation as one of the best
            universities for education is grounded in its unwavering commitment
            to academic excellence, research, and community engagement. For
            students seeking an education that transcends traditional boundaries
            and prepares them for leadership in a dynamic world, Penn State is
            not just a university; it&apos;s a transformative journey. With a
            legacy built on innovation, global engagement, and a vibrant campus
            culture, Penn State continues to set the standard for what a
            world-class education looks like. We Are Penn State!
          </p>
        </div>
        <div className="w-full bg-transparent mx-auto gap-2 p-5 col-span-1 flex flex-col hidden md:block">
          <p className="font-bold text-2xl p-2">Popular Blog Posts</p>
          <div className="border-b-4  border-b-main w-1/5 ml-2 mb-5 items-center flex justify-center block"></div>

          <div className="w-full px-1 text text-2xs">
            <div
              className="flex flex-row hover:cursor-pointer justify-between border-b-2 border-solid gap-2 border-main my-3 pb-3 "
              onClick={() => {
                router.push('/Navigating-the-American-Campus');
              }}
            >
              <Image
                unoptimized
                width={0}
                height={0}
                sizes="100vw"
                src={article1}
                alt=""
                className="w-1/3 rounded-md h-1/4 items-center justify-center"
              />
              <div className=" font-bold">
                <p>
                  Navigating the American Campus: A Student&apos;s Guide to
                  Living in the USA
                </p>
              </div>
            </div>
            {}
            <div
              className="flex flex-row hover:cursor-pointer justify-between border-b-2 border-solid gap-2 border-main my-3 pb-3 "
              onClick={() => {
                router.push('/Mastering-the-Art-of-Financial-Planning');
              }}
            >
              <Image
                unoptimized
                width={0}
                height={0}
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
              className="flex flex-row hover:cursor-pointer justify-between border-b-2 border-solid gap-2 border-main my-3 pb-3 "
              onClick={() => {
                router.push('/Embarking-on-Excellence');
              }}
            >
              <Image
                unoptimized
                width={0}
                height={0}
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
export default Article3;
