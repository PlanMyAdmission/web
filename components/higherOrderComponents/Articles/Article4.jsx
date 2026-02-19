'use client';

import Image from 'next/image';

import React from 'react';
const article = '/images/articles/article4.png';
const article2 = '/images/articles/article2.png';
const article1 = '/images/articles/article1.png';
const article3 = '/images/articles/article3.png';
import { useRouter } from 'next/navigation';
const Article4 = () => {
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
            Mastering the Art of Financial Planning for Your Study Abroad
            Adventure
          </p>
          <p className="text-sm mt-5">
            Blog By: <b>Plan My Admission</b>
          </p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto bg-transparent mx-auto my-3 mt-16 grid grid-cols-3 gap-2">
        <div className="w-full mx-auto bg-transparent mx-auto justify-center gap-2 p-5 col-span-3 md:col-span-2 flex flex-col">
          <p className="text-2xl">
            Embarking on the journey of studying abroad is an exciting adventure
            filled with new opportunities, cultural experiences, and academic
            growth. However, to ensure a smooth and successful international
            education experience, thorough financial planning is essential. In
            this comprehensive guide, we will explore the key aspects of
            financial planning for studying abroad, providing valuable insights
            and practical tips for prospective students.
          </p>
          <div className="w-full mx-auto bg-light rounded-xl mt-5 mx-auto justify-center gap-1 p-5 col-span-2 flex flex-col">
            <p className="text-2xl font-bold">Table of Contents</p>
            <p className="text-lg text-main ">1. Understanding the Costs</p>
            <p className="text-lg text-main ">
              2. Exploring Funding Opportunities
            </p>
            <p className="text-lg text-main ">3. Work Opportunities</p>
            <p className="text-lg text-main ">4. Budgeting Wisely</p>
          </div>
          <p className="text-2xl font-bold mt-6">Understanding the Costs</p>

          <p className="text-md pl-1">
            The foundation of any effective financial plan is a thorough
            understanding of the costs associated with studying abroad. From
            tuition fees to daily living expenses, breaking down these costs is
            the first step in creating a realistic budget.
          </p>

          <p className="font-bold text-xl mt-3 pl-1">Tuition Fees</p>
          <p className="text-md pl-1">
            Research the tuition fees for your desired program and institution.
            Keep in mind that tuition costs can vary significantly between
            countries and universities. Public institutions often have different
            fee structures for international students compared to private ones.
            Additionally, consider any additional fees for specific courses,
            laboratories, or facilities.
          </p>

          <p className="font-bold text-xl mt-3 pl-1">Cost of Living</p>
          <p className="text-md pl-1">
            The cost of living includes accommodation, food, transportation,
            health insurance, textbooks, and personal expenses. Research the
            average living costs in the city or town where you&apos;ll be
            studying. Urban centers generally have higher living expenses, so be
            sure to factor this into your budget.
          </p>

          <p className="font-bold text-xl mt-3 pl-1">
            Visa and Travel Expenses
          </p>
          <p className="text-md pl-1">
            Don&apos;t overlook visa application fees and travel expenses. Visa
            fees vary by country, and travel costs depend on your location and
            the time of year. Include these expenses in your financial plan, and
            budget for potential fluctuations in travel costs.
          </p>

          <p className="font-bold text-xl mt-3 pl-1">Miscellaneous Expenses</p>
          <p className="text-md pl-1">
            Account for miscellaneous expenses, including initial setup costs
            upon arrival. This might include bedding, kitchen utensils, and
            other essentials. While these costs might seem small individually,
            they can add up, so it&apos;s important to include them in your
            overall financial plan.
          </p>

          <p className="text-2xl font-bold mt-6">
            Exploring Funding Opportunities
          </p>

          <p className="text-md pl-1">
            Once you have a clear picture of the costs, the next step is to
            explore funding opportunities to help support your study abroad
            journey.
          </p>

          <p className="font-bold text-xl mt-3 pl-1">Scholarships and Grants</p>

          <p className="text-md pl-1">
            Research and apply for scholarships and grants offered by your host
            university, government programs, and private organizations. Many
            institutions provide financial assistance based on academic merit,
            leadership, or specific criteria. Begin the application process
            early and ensure you meet all deadlines.
          </p>

          <p className="font-bold text-xl mt-3 pl-1">Student Loans</p>

          <p className="text-md pl-1">
            If scholarships and personal savings are not sufficient, consider
            student loans. Research loan options in your home country and the
            host country, understanding the terms, interest rates, and repayment
            plans. Be sure to calculate the impact of loan repayments on your
            post-graduation financial situation.
          </p>

          <p className="text-2xl font-bold mt-6">Work Opportunities</p>
          <p className="text-md pl-1">
            Explore part-time work opportunities available to international
            students. Many countries allow students to work a certain number of
            hours per week during their studies. Working part-time not only
            provides additional income but also offers valuable work experience.
          </p>

          <p className="text-2xl font-bold mt-6">Budgeting Wisely</p>

          <p className="text-md pl-1">
            Creating a realistic budget is a fundamental aspect of financial
            planning for studying abroad. A well-thought-out budget ensures that
            you can manage your finances effectively throughout your time
            abroad.
          </p>

          <p className="font-bold text-xl mt-3 pl-1">
            Fixed vs. Variable Expenses
          </p>
          <p className="text-md pl-1">
            Differentiate between fixed and variable expenses. Fixed expenses
            include things like tuition, rent, and insurance, which remain
            relatively constant. Variable expenses, such as groceries and
            leisure activities, can fluctuate. Understanding these distinctions
            helps you allocate your budget effectively.
          </p>

          <p className="font-bold text-xl mt-3 pl-1">Budgeting Tools</p>

          <p className="text-md pl-1">
            Use budgeting tools and apps to track your expenses. Many apps allow
            you to categorize spending, set limits, and receive notifications
            when you approach your budget thresholds. These tools can be
            invaluable in helping you stay financially disciplined.
          </p>

          <p className="font-bold text-xl mt-3 pl-1">Emergency Fund</p>

          <p className="text-md pl-1">
            Build an emergency fund to cover unexpected expenses. Whether
            it&apos;s a medical emergency or an unplanned trip, having a
            financial safety net ensures you&apos;re prepared for unforeseen
            circumstances without derailing your overall financial plan.
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
            <div
              className="flex flex-row hover:cursor-pointer justify-between border-b-2 border-solid gap-2 border-main my-3 pb-3 "
              onClick={() => {
                router.push('/Pennsylvania-State-University');
              }}
            >
              <Image
                unoptimized
                width={0}
                height={0}
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
            {}
            <div
              className="flex flex-row  hover:cursor-pointer justify-between border-b-2 border-solid gap-2 border-main my-3 pb-3 "
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
export default Article4;
