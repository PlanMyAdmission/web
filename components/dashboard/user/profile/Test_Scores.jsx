'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthProvider.jsx';
import TestScoreSummary from '@/components/dashboard/user/profile/TestScoreSummary.jsx';

const emptyTestScore = {
  exam_type: '',
  sub_type: '',
  date: '',
  listen_score: '',
  read_score: '',
  write_score: '',
  exam_score: '',
  analytical_score: '',
  verbal_score: '',
  quantitative_score: '',
};

const Test_Scores = () => {
  const label_style = 'block text-sm font-medium text-gray-700 mb-1';
  const [data, setData] = useState([{ ...emptyTestScore }]);
  const {
    currentUser,
    uploadDataToFireStoreInArray,
    profileData,
    handleDocumentDelete,
  } = useAuth();
  const addClick = () => {
    setData((prev) => [...prev, { ...emptyTestScore }]);
  };
  const removeClick = (index) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  };
  const handleChange = (i, event) => {
    const updated = [...data];
    updated[i][event.target.name] = event.target.value;
    setData(updated);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    uploadDataToFireStoreInArray(data[0], 'test_score');
  };
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {profileData?.test_score?.map((score) => (
        <TestScoreSummary
          key={score.id}
          score={score}
          onDelete={() => handleDocumentDelete(score.id, 'test_score')}
        />
      ))}

      <form onSubmit={handleSubmit} className="space-y-8">
        {data.map((input, index) => (
          <div key={index} className="border p-4 rounded-md bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className={label_style}>Exam Type *</label>
                <select
                  name="exam_type"
                  value={input.exam_type}
                  className="w-full rounded border p-2"
                  onChange={(e) => {
                    handleChange(index, e);
                    setType(e.target.value);
                  }}
                  required
                >
                  <option value="">Select</option>
                  <option>English Proficiency</option>
                  <option>Entrance Exam</option>
                </select>
              </div>

              {input.exam_type === 'English Proficiency' && (
                <>
                  <div>
                    <label className={label_style}>Sub Type *</label>
                    <select
                      name="sub_type"
                      className="w-full rounded border p-2"
                      onChange={(e) => handleChange(index, e)}
                      required
                    >
                      <option value="">Select</option>
                      <option>TOEFL iBT</option>
                      <option>IELTS Academic</option>
                      <option>IELTS General Training</option>
                      <option>Pearson PTE</option>
                      <option>KITE</option>
                      <option>Cambridge English</option>
                    </select>
                  </div>
                  <div>
                    <label className={label_style}>Date *</label>
                    <input
                      type="date"
                      name="date"
                      value={input.date}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full rounded border p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className={label_style}>Listening *</label>
                    <input
                      type="text"
                      name="listen_score"
                      value={input.listen_score}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full rounded border p-2"
                      placeholder="Out of 30"
                      required
                    />
                  </div>
                  <div>
                    <label className={label_style}>Reading *</label>
                    <input
                      type="text"
                      name="read_score"
                      value={input.read_score}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full rounded border p-2"
                      placeholder="Out of 30"
                      required
                    />
                  </div>
                  <div>
                    <label className={label_style}>Writing *</label>
                    <input
                      type="text"
                      name="write_score"
                      value={input.write_score}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full rounded border p-2"
                      placeholder="Out of 30"
                      required
                    />
                  </div>
                </>
              )}

              {input.exam_type === 'Entrance Exam' && (
                <>
                  <div>
                    <label className={label_style}>Sub Type *</label>
                    <select
                      name="sub_type"
                      className="w-full rounded border p-2"
                      onChange={(e) => handleChange(index, e)}
                      required
                    >
                      <option value="">Select</option>
                      <option>GRE</option>
                      <option>GMAT</option>
                      <option>SAT</option>
                      <option>ACT</option>
                    </select>
                  </div>
                  <div>
                    <label className={label_style}>Date *</label>
                    <input
                      type="date"
                      name="date"
                      value={input.date}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full rounded border p-2"
                      required
                    />
                  </div>
                  {input.sub_type === 'GRE' ? (
                    <>
                      <div>
                        <label className={label_style}>Analytical *</label>
                        <input
                          type="text"
                          name="analytical_score"
                          value={input.analytical_score}
                          onChange={(e) => handleChange(index, e)}
                          className="w-full rounded border p-2"
                          placeholder="Out of 6"
                          required
                        />
                      </div>
                      <div>
                        <label className={label_style}>Quantitative *</label>
                        <input
                          type="text"
                          name="quantitative_score"
                          value={input.quantitative_score}
                          onChange={(e) => handleChange(index, e)}
                          className="w-full rounded border p-2"
                          placeholder="130-170"
                          required
                        />
                      </div>
                      <div>
                        <label className={label_style}>Verbal *</label>
                        <input
                          type="text"
                          name="verbal_score"
                          value={input.verbal_score}
                          onChange={(e) => handleChange(index, e)}
                          className="w-full rounded border p-2"
                          placeholder="130-170"
                          required
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className={label_style}>Total Score *</label>
                      <input
                        type="text"
                        name="exam_score"
                        value={input.exam_score}
                        onChange={(e) => handleChange(index, e)}
                        className="w-full rounded border p-2"
                        required
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="mt-4 flex gap-3">
              <button
                type="submit"
                className="bg-main text-white px-4 py-1 rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => removeClick(index)}
                className="border border-main text-main px-4 py-1 rounded hover:bg-main hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        ))}

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={addClick}
            className="text-main border border-main px-4 py-1 rounded hover:bg-main hover:text-white"
          >
            Add Test
          </button>
        </div>
      </form>
    </div>
  );
};
export default Test_Scores;
