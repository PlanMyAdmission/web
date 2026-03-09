import React from 'react';

const splitBoldSegments = (text) =>
  text.split(/(<strong>.*?<\/strong>)/gi).filter(Boolean).map((segment, index) => {
    const strongMatch = segment.match(/^<strong>(.*?)<\/strong>$/i);

    if (strongMatch) {
      return <strong key={`strong-${index}`}>{strongMatch[1]}</strong>;
    }

    return <React.Fragment key={`text-${index}`}>{segment}</React.Fragment>;
  });

const renderInline = (value = '') => {
  const normalized = `${value || ''}`.replace(/<br\s*\/?>/gi, '\n');
  const lines = normalized.split('\n');

  return lines.map((line, index) => (
    <React.Fragment key={`line-${index}`}>
      {splitBoldSegments(line)}
      {index < lines.length - 1 ? <br /> : null}
    </React.Fragment>
  ));
};

const SimpleRichText = ({ as: Tag = 'p', className = '', text = '' }) => {
  return <Tag className={className}>{renderInline(text)}</Tag>;
};

export default SimpleRichText;
