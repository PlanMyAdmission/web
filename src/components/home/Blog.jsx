import React from 'react'
import article1 from "../../assets/articles/article1.png"
import article2 from "../../assets/articles/article2.png"
import article3 from "../../assets/articles/article3.png"
import article4 from "../../assets/articles/article4.png"
import { useNavigate } from "react-router-dom";
import ArticleCard from '../../higherOrderComponents/ArticleCardBlogs'
import Header from '../../higherOrderComponents/Header'
import { Helmet } from 'react-helmet'
import JoinUs from './JoinUs'

const data = [
    {
        id: 1,
        image: article1,
        head: "Navigating the American Campus | A Student's Guide to Living in the USA",
        desc: "Venturing into the United States for higher education is not just...",
        link: "/Navigating-the-American-Campus",
    },
    {
        id: 2,
        image: article2,
        head: "Embarking on Excellence | A Comprehensive Guide to Studying Abroad",
        desc: "Embarking on the adventure of studying abroad is a transformative...",
        link: "/Embarking-on-Excellence",
    },
    {
        id: 3,
        image: article3,
        head: "Pennsylvania State University | Elevating Education to Unparalleled Heights",
        desc: "In the realm of higher education, few institutions stand as tall and...",
        link: "/Pennsylvania-State-University",
    },
    {
        id: 4,
        image: article4,
        head: "Mastering the Art of Financial Planning for Your Study Abroad Adventure",
        desc: "Embarking on the journey of studying abroad is an exciting adventure...",
        link: "/Mastering-the-Art-of-Financial-Planning",
    },
]

const Blog = () => {
    return (
        <>
            <Helmet>
                <title>Planmyadmission blogs | Explore the World of Studying Abroad with us</title>
                <meta name="title" content="Planmyadmission blogs | Explore the World of Studying Abroad with us" />
                <meta name="description" content="Dive into our blog for the latest updates and valuable insights on studying abroad in 2024. Stay informed about colleges, courses, exams, and application tips. Your comprehensive guide to a successful international education journey awaits." />
                <link rel="canonical" href="https://planmyadmission.com/about" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta property="og:title" content="Planmyadmission blogs | Explore the World of Studying Abroad with us" />
                <meta property="og:description" content="Dive into our blog for the latest updates and valuable insights on studying abroad in 2024. Stay informed about colleges, courses, exams, and application tips. Your comprehensive guide to a successful international education journey awaits." />
                <meta property="og:image" content="https://planmyadmission.com" />
                <meta property="og:url" content="https://planmyadmission.com/blogs" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Planmyadmission blogs | Explore the World of Studying Abroad with us" />
                <meta name="twitter:description" content="Dive into our blog for the latest updates and valuable insights on studying abroad in 2024. Stay informed about colleges, courses, exams, and application tips. Your comprehensive guide to a successful international education journey awaits." />
            </Helmet>

            <Header heading={"Our Blogs"} />
            {/* <div className="md:border-b-4  border-b-main w-1/5 ml-5 mb-5 items-center flex justify-center md:block"></div> */}
            <div className='max-w-6xl mx-auto bg-light mx-auto px-5 p-10 rounded-xl mt-5 grid grid-cols-1 sm:grid-cols-2 justify-center items-center gap-7'>
                {
                    data && data.map((item) => {
                        return <ArticleCard props={item} />
                    })
                }
            </div>
                <JoinUs  />
        </>
    )
}

export default Blog