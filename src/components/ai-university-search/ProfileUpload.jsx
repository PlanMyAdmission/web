import React from "react";

const ProfileUpload = ({ pdfFile, onFileChange }) => {
  return (
    <div className="pma-ai-upload">
      <label className="pma-ai-upload-label">
        Upload profile PDF (optional)
        <input type="file" accept="application/pdf" onChange={onFileChange} />
      </label>
      <p className="pma-ai-upload-hint">
        Attach your profile to personalize results. If you skip this, we’ll
        return a strong general list for the course.
      </p>
      {pdfFile && <div className="pma-ai-upload-file">Selected: {pdfFile.name}</div>}
    </div>
  );
};

export default ProfileUpload;
