import React from 'react';
import { studyLevels } from '@/components/explore-university/university-finder/constants.js';

const UniversitySearchForm = ({
  cx,
  formData,
  isSearching,
  showDropdown,
  searchResults,
  validationMessages,
  apiStatus,
  formatINR,
  convertUSDToINR,
  onInputChange,
  onUniversitySelect,
  onTestTypeChange,
  onSubmit,
  onReset,
}) => {
  const scoreTypeConfig = {
    PERCENTAGE_100: {
      label: 'Percentage (0 - 100)',
      min: 0,
      max: 100,
      step: 0.1,
      placeholder: 'Example: 82',
    },
    CGPA_10: {
      label: 'CGPA (0 - 10)',
      min: 0,
      max: 10,
      step: 0.1,
      placeholder: 'Example: 8.2',
    },
    GPA_4: {
      label: 'GPA (0 - 4)',
      min: 0,
      max: 4,
      step: 0.1,
      placeholder: 'Example: 3.4',
    },
  };

  const scoreConfig =
    scoreTypeConfig[formData.scoreType] || scoreTypeConfig.CGPA_10;

  return (
    <>
      <header className={cx('header')}>
        <h1>University Course Finder</h1>
        <p className={cx('header__subtitle')}>
          Search from 200+ universities worldwide with comprehensive global database coverage
        </p>
      </header>

      <main className={cx('main')}>
        <form className={cx('course-finder-form')} onSubmit={onSubmit}>
          <div className={cx('form-group')}>
            <label htmlFor="university" className={cx('form-label')}>Search University</label>
            <div className={cx('search-container')}>
              <input
                type="text"
                id="university"
                className={cx('form-control university-search')}
                placeholder="Start typing university name (e.g., Oxford, Cambridge, Harvard, MIT)..."
                value={formData.university}
                onChange={(event) => onInputChange('university', event.target.value)}
                autoComplete="off"
                required
              />
              {isSearching && (
                <div className={cx('search-loading')}>
                  <span className={cx('loading-spinner')}></span>
                </div>
              )}
              {showDropdown && searchResults.length > 0 && (
                <div className={cx('search-dropdown')}>
                  <div className={cx('search-results')}>
                    {searchResults.map((uni, index) => (
                      <div
                        key={`${uni.name}-${index}`}
                        className={cx('search-result-item')}
                        onClick={() => onUniversitySelect(uni)}
                      >
                        <div className={cx('search-result-name')}>{uni.name}</div>
                        <div className={cx('search-result-country')}>
                          {uni.country}
                          {uni.city ? `, ${uni.city}` : ''}
                        </div>
                        {uni.domains?.[0] && (
                          <div className={cx('search-result-domain')}>{uni.domains[0]}</div>
                        )}
                        {uni.ranking && (
                          <div className={cx('search-result-ranking')}>World Ranking: #{uni.ranking}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {validationMessages.university && (
              <div className={cx('validation-message error')}>{validationMessages.university}</div>
            )}
          </div>

          <div className={cx('academic-profile')}>
            <h3>Academic Profile</h3>

            <div className={cx('form-group')}>
              <label htmlFor="studyLevel" className={cx('form-label')}>Study Level</label>
              <select
                id="studyLevel"
                className={cx('form-control')}
                value={formData.studyLevel}
                onChange={(event) => onInputChange('studyLevel', event.target.value)}
                required
              >
                <option value="">Select study level...</option>
                {studyLevels.map((level) => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
              {validationMessages.studyLevel && (
                <div className={cx('validation-message error')}>{validationMessages.studyLevel}</div>
              )}
            </div>

            <div className={cx('form-group')}>
              <label htmlFor="scoreType" className={cx('form-label')}>Academic Score Type</label>
              <select
                id="scoreType"
                className={cx('form-control')}
                value={formData.scoreType}
                onChange={(event) => onInputChange('scoreType', event.target.value)}
                required
              >
                <option value="PERCENTAGE_100">Percentage (100)</option>
                <option value="CGPA_10">CGPA (10)</option>
                <option value="GPA_4">GPA (4)</option>
              </select>
            </div>

            <div className={cx('form-group')}>
              <label htmlFor="gpa" className={cx('form-label')}>{scoreConfig.label}</label>
              <input
                type="number"
                id="gpa"
                className={cx('form-control')}
                min={scoreConfig.min}
                max={scoreConfig.max}
                step={scoreConfig.step}
                placeholder={scoreConfig.placeholder}
                value={formData.gpa}
                onChange={(event) => onInputChange('gpa', event.target.value)}
                required
              />
              {validationMessages.gpa && (
                <div className={cx('validation-message error')}>{validationMessages.gpa}</div>
              )}
            </div>

            <div className={cx('form-group')}>
              <label className={cx('form-label')}>English Test Score</label>
              <div className={cx('test-selection')}>
                <div className={cx('radio-group')}>
                  <label className={cx('radio-label')}>
                    <input
                      type="radio"
                      name="testType"
                      value="ielts"
                      checked={formData.testType === 'ielts'}
                      onChange={(event) => onTestTypeChange(event.target.value)}
                    />
                    <span className={cx('radio-custom')}></span>
                    IELTS (0.0 - 9.0)
                  </label>
                  <input
                    type="number"
                    className={cx('form-control test-input')}
                    min="0"
                    max="9"
                    step="0.5"
                    placeholder="IELTS score"
                    value={formData.ieltsScore}
                    onChange={(event) => onInputChange('ieltsScore', event.target.value)}
                    disabled={formData.testType !== 'ielts'}
                  />
                </div>

                <div className={cx('radio-group')}>
                  <label className={cx('radio-label')}>
                    <input
                      type="radio"
                      name="testType"
                      value="toefl"
                      checked={formData.testType === 'toefl'}
                      onChange={(event) => onTestTypeChange(event.target.value)}
                    />
                    <span className={cx('radio-custom')}></span>
                    TOEFL (0 - 120)
                  </label>
                  <input
                    type="number"
                    className={cx('form-control test-input')}
                    min="0"
                    max="120"
                    step="1"
                    placeholder="TOEFL score"
                    value={formData.toeflScore}
                    onChange={(event) => onInputChange('toeflScore', event.target.value)}
                    disabled={formData.testType !== 'toefl'}
                  />
                </div>
              </div>
              {validationMessages.testType && (
                <div className={cx('validation-message error')}>{validationMessages.testType}</div>
              )}
              {validationMessages.testScore && (
                <div className={cx('validation-message error')}>{validationMessages.testScore}</div>
              )}
            </div>
          </div>

          <div className={cx('budget-planning')}>
            <h3>Budget Planning</h3>
            <div className={cx('form-group')}>
              <label htmlFor="budget" className={cx('form-label')}>Annual Tuition Budget</label>
              <div className={cx('budget-container')}>
                <input
                  type="range"
                  id="budget"
                  className={cx('budget-slider')}
                  min="0"
                  max="100000"
                  step="1000"
                  value={formData.budget}
                  onChange={(event) => onInputChange('budget', parseInt(event.target.value, 10))}
                />
                <div className={cx('budget-display')}>
                  <span className={cx('budget-value')}>${formData.budget.toLocaleString()}</span>
                  <span className={cx('budget-inr')}>({formatINR(convertUSDToINR(formData.budget))})</span>
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className={cx('btn btn--primary btn--full-width btn--lg')}>
            Find University Match
          </button>
          <button
            type="button"
            className={cx('btn btn--outline btn--full-width btn--lg btn--reset')}
            onClick={onReset}
          >
            Reset Form
          </button>
        </form>

        <div className={cx('api-indicator')}>
          <div className={cx('api-sources')}>
            <div className={cx('api-source', apiStatus.openalex)}>
              <span className={cx('api-dot')}></span>
              <span>OpenAlex API</span>
            </div>
            <div className={cx('api-source', apiStatus.hipolabs)}>
              <span className={cx('api-dot')}></span>
              <span>Hipolabs API</span>
            </div>
            <div className={cx('api-source', apiStatus.fallback)}>
              <span className={cx('api-dot')}></span>
              <span>Comprehensive Database (200+ Universities)</span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default UniversitySearchForm;
