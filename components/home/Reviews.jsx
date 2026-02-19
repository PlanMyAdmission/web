'use client';

import React from 'react';
import person1 from '@/assets/homeAssets/deepakbhatia.jpeg';
import person2 from '@/assets/homeAssets/Shagunbansal.jpeg';
import person3 from '@/assets/homeAssets/virensood.jpeg';
import person4 from '@/assets/homeAssets/Ritikasingh.jpeg';
import StarRateIcon from '@mui/icons-material/StarRate';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Girl2 from '@/assets/homeAssets/Girl2.svg';
class Content extends React.Component {
  render() {
    const handelLeft = () => {
      if (this.carousel?.previous) {
        this.carousel.previous();
      }
    };
    const handelRight = () => {
      if (this.carousel?.next) {
        this.carousel.next();
      }
    };
    return (
      <Carousel
        ref={(ref) => (this.carousel = ref)}
        responsive={{
          all: {
            breakpoint: {
              max: 4000,
              min: 0,
            },
            items: 1,
          },
        }}
        arrows={false}
        infinite
      >
        <Reviews
          {...Data[0]}
          onShowLeft={handelLeft}
          onShowRight={handelRight}
        />
        <Reviews
          {...Data[1]}
          onShowLeft={handelLeft}
          onShowRight={handelRight}
        />
        <Reviews
          {...Data[2]}
          onShowLeft={handelLeft}
          onShowRight={handelRight}
        />
        {}
      </Carousel>
    );
  }
}
const Reviews = ({ gyan, author, university, onShowRight, onShowLeft }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-10">
      <article className="flex flex-wrap items-start pb-24 sm:pb-32">
        {}
        <div className="bg-white basis-80 grow-[5] relative -mb-32 mt-10 -ml-4 sm:-ml-20 p-6 sm:p-8 lg:p-10 rounded-lg sm:[clip-path:polygon(0_theme(spacing.2),100%_0,calc(100%-theme(spacing.8))_calc(100%-theme(spacing.4)),theme(spacing.8)_94%)] shadow-md">
          <p className="text-main flex">
            {[...Array(5)].map((_, i) => (
              <StarRateIcon key={i} fontSize="small" />
            ))}
          </p>

          <figure>
            <blockquote className="pt-3 text-gray-700 text-sm sm:text-base leading-relaxed">
              {gyan}
            </blockquote>

            <figcaption className="mt-6 sm:pl-10">
              <cite className="not-italic sm:flex sm:justify-between">
                <div>
                  <b className="block text-lg sm:text-xl relative">
                    <span className="absolute top-0 right-[calc(100%+4px)]">
                      -
                    </span>
                    {author}
                  </b>
                  <span className="text-main text-sm">{university}</span>
                </div>

                <div className="flex py-4 sm:pt-0 sm:ml-4">
                  <button
                    className="text-white bg-main py-1 px-2 mr-2 rounded-sm"
                    onClick={onShowLeft}
                  >
                    &larr;
                  </button>
                  <button
                    className="text-white bg-main py-1 px-2 rounded-sm"
                    onClick={onShowRight}
                  >
                    &rarr;
                  </button>
                </div>
              </cite>
            </figcaption>
          </figure>
        </div>
      </article>
    </div>
  );
};
const Data = [
  {
    gyan: 'Reflecting on my journey, I recall the uncertain beginnings of my overseas education process, having previously felt unsupported and unsure. That changed with the guidance I received through Plan My Admission. From day one, I was met with unwavering commitment and empathy, transforming my outlook and giving me the confidence to pursue my dreams. The support extended beyond professional advice—it included personal encouragement and dedicated listening, even during moments of frustration. Over eight months, this steadfast guidance helped me navigate tough decisions and finally secure admission to a top university in the USA. Looking back, I firmly believe this achievement would not have been possible without their expertise and heartfelt support.',
    author: 'Kiran Patel',
  },
  {
    gyan: 'After facing confusion and repeated doubt in the admission process, finding Plan My Admission proved to be a turning point. The team assisted me at every step, from shaping my resume and Statement of Purpose to timely solutions for every query and concern. Their consistent availability gave me peace of mind, and the genuine care made me feel understood and valued. Through their expert advice, I was able to submit strong applications and ultimately secure admission at one of the best colleges matching my ambitions. I am grateful for their guidance and can confidently recommend their services to anyone looking for personalized and reliable support in higher education.',
    author: 'Arjun Sharma',
  },
  {
    gyan: 'My experience with Plan My Admission began with the daunting process of applying for master’s programs abroad. With their expertise, I received personalized counseling, proactive guidance on my applications, and thorough support during the visa process. Even complex procedures felt manageable thanks to their clear advice and ongoing encouragement. Regular follow-ups, helpful resources, and skilled mentoring made every stage less overwhelming, leading to successful admission in the right college and swift visa approval. I highly recommend their support to anyone planning to study abroad and needing expert help for their higher education journey.',
    author: 'Rajesh Kumar',
  },
];
export default Content;
