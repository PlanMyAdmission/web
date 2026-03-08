import React from 'react';
import uniStyles from '@/components/ai-university-search/AIUniversitySearch.module.css';
const cx = (...classNames) =>
  classNames
    .flatMap((value) => `${value || ''}`.split(/\s+/))
    .map((name) => uniStyles[name])
    .filter(Boolean)
    .join(' ');
const ProfileUpload = ({ pdfFile, onFileChange }) => {
  return (
    <div className={cx('pma-uni-upload')}>
      <label className={cx('pma-uni-upload-label')}>
        Upload profile PDF (optional)
        <input type="file" accept="application/pdf" onChange={onFileChange} />
      </label>
      <p className={cx('pma-uni-upload-hint')}>
        Attach your profile to personalize results. If you skip this, we’ll
        return a strong general shortlist for your selected profile.
      </p>
      {pdfFile && (
        <div className={cx('pma-uni-upload-file')}>Selected: {pdfFile.name}</div>
      )}
    </div>
  );
};
export default ProfileUpload;
