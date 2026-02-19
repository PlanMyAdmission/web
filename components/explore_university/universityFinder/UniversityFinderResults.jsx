import React from 'react';

const UniversityFinderResults = ({
  cx,
  formData,
  selectedUniversity,
  showResults,
  showModal,
  modalMessage,
  recommendations,
  eligibility,
  estimateTuitionByCountry,
  convertUSDToINR,
  formatINR,
  onCloseModal,
  onUseFallbackList,
}) => (
  <>
    {showResults && selectedUniversity && (
      <div className={cx('results-section')} id="resultsSection">
        <div className={cx('card university-details-card')}>
          <div className={cx('card__body')}>
            <h3>Selected University</h3>
            <div className={cx('university-details')}>
              <div className={cx('university-name')}>{selectedUniversity.name}</div>
              <div className={cx('university-location')}>
                {selectedUniversity.city}, {selectedUniversity.country}
              </div>
              <div className={cx('university-stats')}>
                <div className={cx('university-stat')}>
                  <div className={cx('stat-label')}>World Ranking</div>
                  <div className={cx('stat-value')}>#{selectedUniversity.ranking || 'N/A'}</div>
                </div>
                <div className={cx('university-stat')}>
                  <div className={cx('stat-label')}>Estimated Annual Tuition</div>
                  <div className={cx('stat-value')}>
                    ${
                      selectedUniversity.tuition ||
                      estimateTuitionByCountry(selectedUniversity.country)
                    }
                    <div className={cx('stat-value-inr')}>
                      {formatINR(
                        convertUSDToINR(
                          selectedUniversity.tuition ||
                            estimateTuitionByCountry(selectedUniversity.country),
                        ),
                      )}
                    </div>
                  </div>
                </div>
                <div className={cx('university-stat')}>
                  <div className={cx('stat-label')}>Website</div>
                  <div className={cx('stat-value')}>
                    <a
                      href={selectedUniversity.web_pages[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      Visit University →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={cx('card eligibility-card')}>
          <div className={cx('card__body')}>
            <h3>Eligibility Assessment</h3>
            <div className={cx('eligibility-result')}>
              {eligibility && (
                <>
                  <div className={cx('status', eligibility.statusClass)}>{eligibility.statusText}</div>
                  <p>{eligibility.message}</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className={cx('card recommendations-card')}>
          <div className={cx('card__body')}>
            <h3>Top 3 University Recommendations</h3>
            <div className={cx('recommendations-list')}>
              {recommendations.map((uni) => {
                const tuitionEstimate = uni.tuition || estimateTuitionByCountry(uni.country);
                const tuitionINR = convertUSDToINR(tuitionEstimate);
                const isAffordable = formData.budget >= tuitionEstimate || formData.budget === 0;

                return (
                  <div key={uni.name} className={cx('recommendation-item')}>
                    <div className={cx('recommendation-header')}>
                      <div>
                        <h4 className={cx('recommendation-name')}>{uni.name}</h4>
                        <div className={cx('recommendation-location')}>
                          {uni.city}, {uni.country}
                        </div>
                        <div className={cx('recommendation-details')}>
                          <div
                            className={cx(
                              'recommendation-cost',
                              isAffordable ? 'affordable' : 'expensive',
                            )}
                          >
                            Estimated Cost: ${tuitionEstimate.toLocaleString()} per year
                            {!isAffordable
                              ? ' (Above your budget)'
                              : formData.budget > 0
                                ? ' (Within budget)'
                                : ''}
                            <div className={cx('recommendation-cost-inr')}>
                              {formatINR(tuitionINR)} per year
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={cx('recommendation-match')}>{uni.matchScore}% Match</div>
                    </div>
                    <a
                      href={uni.web_pages[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cx('recommendation-link')}
                    >
                      Visit University Website →
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    )}

    {showModal && (
      <div className={cx('modal')}>
        <div className={cx('modal-content')}>
          <div className={cx('modal-header')}>
            <h3>Search Information</h3>
            <button className={cx('modal-close')} onClick={onCloseModal}>
              &times;
            </button>
          </div>
          <div className={cx('modal-body')}>
            <p>{modalMessage || 'Searching comprehensive university database...'}</p>
            <div className={cx('modal-actions')}>
              <button className={cx('btn btn--primary')} onClick={onCloseModal}>
                Continue Searching
              </button>
              <button className={cx('btn btn--outline')} onClick={onUseFallbackList}>
                Search All Universities
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
);

export default UniversityFinderResults;
