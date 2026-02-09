import React from "react";

const CourseStep = ({ formData, setField, onBack, onNext }) => {
  return (
    <div className="pma-ai-form">
      <div className="pma-ai-field">
        <label>Target Country/Region</label>
        <input
          value={formData.targetCountry}
          onChange={setField("targetCountry")}
        />
      </div>
      <div className="pma-ai-field">
        <label>Degree Level</label>
        <input value={formData.degreeLevel} onChange={setField("degreeLevel")} />
      </div>
      <div className="pma-ai-field">
        <label>Field of Study</label>
        <input value={formData.fieldOfStudy} onChange={setField("fieldOfStudy")} />
      </div>
      <div className="pma-ai-field">
        <label>GPA (or percentage)</label>
        <input value={formData.gpa} onChange={setField("gpa")} />
      </div>
      <div className="pma-ai-field">
        <label>Test Scores</label>
        <input value={formData.testScores} onChange={setField("testScores")} />
      </div>
      <div className="pma-ai-step-actions">
        <button type="button" className="pma-ai-secondary" onClick={onBack}>
          Back
        </button>
        <button type="button" className="pma-ai-primary" onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default CourseStep;
