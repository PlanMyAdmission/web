'use client';

import React from 'react';
import Delete from '@mui/icons-material/DeleteOutlined';

const TestScoreSummary = ({ score, onDelete }) => (
  <div className="flex justify-between items-start border-b pb-4 mb-4">
    <div>
      <h2 className="text-lg font-semibold text-main">{score.exam_type}</h2>
      <p className="text-sm font-medium text-gray-600">
        Exam Type: {score.sub_type}
      </p>
      {score.exam_type === 'English Proficiency' && (
        <>
          <p>Listening Score: {score.listen_score}</p>
          <p>Reading Score: {score.read_score}</p>
          <p>Writing Score: {score.write_score}</p>
        </>
      )}
      {score.exam_type !== 'English Proficiency' && score.sub_type !== 'GRE' && (
        <p>Test Score: {score.exam_score}</p>
      )}
      {score.exam_type !== 'English Proficiency' && score.sub_type === 'GRE' && (
        <>
          <p>Analytical: {score.analytical_score}</p>
          <p>Quantitative: {score.quantitative_score}</p>
          <p>Verbal: {score.verbal_score}</p>
        </>
      )}
    </div>
    <Delete className="text-red-500 cursor-pointer" onClick={onDelete} />
  </div>
);

export default TestScoreSummary;
