import React from 'react';
import article1 from '@/assets/articles/article1.png';
import article2 from '@/assets/articles/article2.png';
import article3 from '@/assets/articles/article3.png';
import article4 from '@/assets/articles/article4.png';
import ArticleCard from '@components/higherOrderComponents/ArticleCardBlogs';
import Header from '@components/higherOrderComponents/Header';
import JoinUs from '@/components/home/JoinUs.jsx';
const data = [
  {
    id: 1,
    image: article1,
    head: "Navigating the American Campus | A Student's Guide to Living in the USA",
    desc: 'Venturing into the United States for higher education is not just...',
    link: '/Navigating-the-American-Campus',
  },
  {
    id: 2,
    image: article2,
    head: 'Embarking on Excellence | A Comprehensive Guide to Studying Abroad',
    desc: 'Embarking on the adventure of studying abroad is a transformative...',
    link: '/Embarking-on-Excellence',
  },
  {
    id: 3,
    image: article3,
    head: 'Pennsylvania State University | Elevating Education to Unparalleled Heights',
    desc: 'In the realm of higher education, few institutions stand as tall and...',
    link: '/Pennsylvania-State-University',
  },
  {
    id: 4,
    image: article4,
    head: 'Mastering the Art of Financial Planning for Your Study Abroad Adventure',
    desc: 'Embarking on the journey of studying abroad is an exciting adventure...',
    link: '/Mastering-the-Art-of-Financial-Planning',
  },
];
const Blog = () => {
  return (
    <>
      <Header heading={'Our Blogs'} />
      {}
      <div className="max-w-6xl mx-auto bg-light mx-auto px-5 p-10 rounded-xl mt-5 grid grid-cols-1 sm:grid-cols-2 justify-center items-center gap-7">
        {data &&
          data.map((item) => {
            return <ArticleCard key={item.id} props={item} />;
          })}
      </div>
      <JoinUs />
    </>
  );
};
export default Blog;
