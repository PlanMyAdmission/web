import React from 'react';
import aiStyles from '@/components/ai-admission/AIAdmissionTool.module.css';
const cx = (...classNames) =>
  classNames
    .flatMap((value) => `${value || ''}`.split(/\s+/))
    .map((name) => aiStyles[name])
    .filter(Boolean)
    .join(' ');
const ProfileUpload = ({ pdfFile, onFileChange }) => {
  return (
    <div className={cx('pma-ai-upload')}>
      <label className={cx('pma-ai-upload-label')}>
        Upload profile PDF (optional)
        <input type="file" accept="application/pdf" onChange={onFileChange} />
      </label>
      <p className={cx('pma-ai-upload-hint')}>
        Attach your profile to personalize results. If you skip this, we’ll
        return a strong general list for the course.
      </p>
      {pdfFile && (
        <div className={cx('pma-ai-upload-file')}>Selected: {pdfFile.name}</div>
      )}
    </div>
  );
};
export default ProfileUpload;
