import Navigator from '@/components/explore-university/detail/Navigator.jsx';
import Image from 'next/image';

const University = ({ universities = [] }) => {
  return (
    <div className="max-w-5xl mx-auto bg-transparent px-5 p-10 rounded my-5">
      {universities.map((data, index) => (
        <div
          key={data?.id || data?.slug || index}
          className="grid grid-cols-3 gap-4 sm:grid-cols-5"
        >
          <div className="mt-4 col-span-1 sm:col-span-1 h-20 sm:h-40 rounded-md relative">
            {data?.logo ? (
              <Image
                src={data.logo}
                alt={data?.name || 'University logo'}
                fill
                sizes="160px"
                className="object-contain rounded-md"
                unoptimized
              />
            ) : (
              <div
                className="w-full h-full rounded-md bg-light"
                aria-hidden="true"
              />
            )}
          </div>
          <div className="col-span-2 sm:col-span-3 self-center">
            <div className="flex flex-col flex-wrap">
              <label className="font-bold text-[#3f1831] text-1.9lr">
                {data?.name}
              </label>
              <div className="flex flex-col justify-start sm:flex-row">
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
                  {data?.addr_state}
                </div>
                <div className="flex flex-row items-center text-main">
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
                  {data?.addr_country}
                </div>
              </div>
              <div className="flex flex-row items-center text-[#3f1831]">
                <svg
                  aria-hidden="true"
                  className="w-4 h-4 text-main mt-1"
                  fill="none"
                  stroke="black"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.354 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708 0z"
                  />
                  <path d="m10.273 2.513-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944 1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92.016-1.32a1.89 1.89 0 0 0-1.912-1.911l-1.318.016z" />
                </svg>
                <label className="text-main font-bold text-2xs">
                  {data?.acceptance_rate}
                </label>
                <label className="text-2xs sm:ml-2">Acceptance Rate</label>
              </div>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 self-center">
            <a
              href={data?.admission_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
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
      <Navigator props={universities} />
    </div>
  );
};

export default University;
