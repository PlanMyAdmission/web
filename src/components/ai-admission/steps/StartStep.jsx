import React from "react";

const StartStep = ({
  mode,
  onModeChange,
  pdfFile,
  onFileChange,
  formData,
  setField,
  onContinue,
  onAnalyze,
}) => {
  return (
    <div className="pma-ai-flow-card">
      <div className="pma-ai-flow-options">
        <button
          type="button"
          className={`pma-ai-mode-btn ${mode === "pdf" ? "active" : ""}`}
          onClick={() => onModeChange("pdf")}
        >
          Upload PDF
        </button>
        <button
          type="button"
          className={`pma-ai-mode-btn ${mode === "form" ? "active" : ""}`}
          onClick={() => onModeChange("form")}
        >
          Enter Details
        </button>
      </div>

      {mode === "pdf" ? (
        <div className="pma-ai-upload">
          <label className="pma-ai-upload-label">
            Upload profile PDF
            <input type="file" accept="application/pdf" onChange={onFileChange} />
          </label>
          <p className="pma-ai-upload-hint">
            We send the PDF to Gemini only for analysis. Nothing is stored.
          </p>
          {pdfFile && (
            <div className="pma-ai-upload-file">Selected: {pdfFile.name}</div>
          )}
          <div className="pma-ai-step-actions">
            <button type="button" className="pma-ai-primary" onClick={onAnalyze}>
              Analyze Profile
            </button>
          </div>
        </div>
      ) : (
        <div className="pma-ai-form">
          <div className="pma-ai-field">
            <label>First Name</label>
            <input value={formData.fullName} onChange={setField("fullName")} />
          </div>
          <div className="pma-ai-field">
            <label>Last Name</label>
            <input value={formData.lastName} onChange={setField("lastName")} />
          </div>
          <div className="pma-ai-field">
            <label>Email</label>
            <input value={formData.email} onChange={setField("email")} />
          </div>
          <div className="pma-ai-step-actions">
            <button type="button" className="pma-ai-primary" onClick={onContinue}>
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartStep;
