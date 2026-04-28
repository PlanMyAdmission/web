import ExploreMainPage from '@/components/explore-university/ExploreMainPage.jsx';
import Image from 'next/image';
import { trackNavigationClick } from '@/lib/analytics/events.js';

const ExploreUniversityData = ({ records = [], imageUrl = '' }) => {
  return (
    <div className="max-w-5xl mx-auto bg-transparent px-5 p-10 rounded my-5">
      {records.map((data, index) => (
        <div
          key={data?.recordId || data?.id || data?.UniversityId || index}
          className="grid grid-cols-3 gap-4 sm:grid-cols-5"
        >
          <div className="mt-4 col-span-1 sm:col-span-1 h-20 sm:h-40 rounded-md relative">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={data?.Name || 'Program logo'}
                fill
                sizes="160px"
                className="object-contain rounded-md"
                unoptimized
              />
            ) : (
              <div
                className="w-full h-full bg-light rounded-md"
                aria-hidden="true"
              />
            )}
          </div>
          <div className="col-span-2 sm:col-span-3 self-center">
            <div className="flex flex-col flex-wrap">
              <label className="font-bold text-[#3f1831] text-1.9lr">
                {data?.Name}
              </label>
              <div className="flex flex-col justify-start sm:flex-col">
                <div className="flex flex-row items-center text-main font-bold text-[1.3rem]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    fill="currentColor"
                    className="bi bi-circle-fill mx-1"
                    viewBox="0 0 16 16"
                  >
                    <circle cx="8" cy="8" r="8" />
                  </svg>
                  {data?.University}
                </div>
                <div className="flex flex-row items-center text-main">
                  <svg
                    aria-hidden="true"
                    className="w-3 h-3 text-main"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M18,4.48a8.45,8.45,0,0,0-12,12l5.27,5.28a1,1,0,0,0,1.42,0L18,16.43A8.45,8.45,0,0,0,18,4.48ZM16.57,15,12,19.59,7.43,15a6.46,6.46,0,1,1,9.14,0ZM9,7.41a4.32,4.32,0,0,0,0,6.1,4.31,4.31,0,0,0,7.36-3,4.24,4.24,0,0,0-1.26-3.05A4.3,4.3,0,0,0,9,7.41Zm4.69,4.68a2.33,2.33,0,1,1,.67-1.63A2.33,2.33,0,0,1,13.64,12.09Z"
                    ></path>
                  </svg>
                  {data?.Country}
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 self-center">
            <a
              href={data?.admission_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
              onClick={() => {
                trackNavigationClick({
                  location: 'explore_program_detail',
                  label: 'apply_now',
                  destination: data?.admission_url || 'missing_admission_url',
                });
              }}
            >
              <button
                type="button"
                className="block text-white w-full text-1.5lr bg-main py-1 px-4 rounded-lg"
              >
                Apply Now
              </button>
            </a>
          </div>
        </div>
      ))}
      <ExploreMainPage props={records} />
    </div>
  );
};

export default ExploreUniversityData;
