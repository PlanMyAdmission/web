import React from 'react';
import Header from '@components/common/Header';
import data from '@/components/legal/privacy-policy.js';
import SimpleRichText from '@/components/shared/SimpleRichText.jsx';
const Content = (data) => {
  return (
    <div className="max-w-7xl md:mx-auto bg-light md:px-10 py-10 rounded-xl px-5 mx-2 md:my-20 mb-5">
      <h1 className="font-bold text-2xl">{data.head}</h1>
      <SimpleRichText className="py-4" text={data.content} />
      <ol className="list-decimal px-3">
        {data.policy.map((item) => {
          return (
            <div key={item.title} className="mb-3">
              <li className="font-bold text-xl py-2">{item.title}</li>
              <SimpleRichText text={item.description} />
            </div>
          );
        })}
      </ol>
    </div>
  );
};
const Privacy = ({ content }) => {
  return (
    <div>
      <Header heading={content?.headerHeading || 'Privacy Policy'} />
      <Content {...(content || data)} />
    </div>
  );
};
export default Privacy;
