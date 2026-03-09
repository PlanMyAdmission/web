import React from 'react';
import Course from '@/components/explore-university/detail/Course.jsx';

const SECTION_TITLE_CLASS = 'text text-1.7lr font-bold';

const SectionTitle = ({ prefix, suffix }) => (
  <label className={SECTION_TITLE_CLASS}>
    <span className="underline underline-offset-8 decoration-main">{prefix}</span>
    {suffix}
  </label>
);

const StatRow = ({ label, value }) => (
  <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
    <label>{label}</label>
    <label>{value}</label>
  </div>
);

const AboutSection = ({ aboutRef, description }) => (
  <div ref={aboutRef} className="max-w-5xl mx-auto bg-transparent rounded my-5 ml-8">
    <div className="flex flex-col jsutify-left">
      <SectionTitle prefix="Abo" suffix="ut" />
      <p className="text text-lr my-5">{description}</p>
    </div>
  </div>
);

const StatsSection = ({ statRef, university }) => (
  <div ref={statRef} className="mt-5 ml-8 mb-8">
    <SectionTitle prefix="Sta" suffix="ts" />
    <div className="flex flex-col sm:flex-row bg-light justify-between mt-8 mb-5 rounded-lg p-3">
      <div className="w-full px-1 md:w-1/2 md:px-2 text text-2xs">
        <StatRow
          label="Tuition Value"
          value={`${university?.tuition_value} ${university?.tuition_currency}`}
        />
        <StatRow
          label="Aid Value"
          value={`${university?.aid_value} ${university?.aid_currency}`}
        />
        <StatRow
          label="Stay on Campus Value"
          value={`${university?.stay_on_campus_value} ${university?.stay_on_campus_currency}`}
        />
        <StatRow
          label="Mandatory Value"
          value={`${university?.mandatory_value} ${university?.mandatory_currency}`}
        />
      </div>
      <div className="w-full px-1 md:w-1/2 md:px-2 text text-2xs">
        <StatRow
          label="Average Salary"
          value={`${university?.avg_salary_value} ${university?.avg_salary_currency}`}
        />
        <StatRow
          label="Books & Supplies Value"
          value={`${university?.books_and_supplies_value} ${university?.books_and_supplies_currency}`}
        />
        <StatRow
          label="Insurance Value"
          value={`${university?.insurance_value} ${university?.insurance_currency}`}
        />
        <StatRow
          label="Personal Value"
          value={`${university?.personal_value} ${university?.personal_currency}`}
        />
      </div>
    </div>

    <div className="bg-light px-3 py-2 rounded-lg w-full">
      <label className="text text-2xs font-bold">Student Gender Distribution</label>
      <div className="grid grid-cols-1 sm:grid-cols-4 text text-2xs">
        <div className="col-span-1 sm:col-span-1 border-b-2 sm:border-r-2 sm:border-b-0 border-solid border-main">
          <div className="flex flex-col items-center my-3 px-8">
            <label>Male</label>
            <label className="text-main text-lr font-bold">
              {university?.male_percent ? university.male_percent : '-'}%
            </label>
          </div>
        </div>
        <div className="col-span-1 border-b-2 sm:border-r-2 sm:border-b-0 border-solid border-main">
          <div className="flex flex-col items-center my-3 px-8">
            <label>Female</label>
            <label className="text-main text-lr font-bold">
              {university?.female_percent ? university.female_percent : '-'}%
            </label>
          </div>
        </div>
        <div className="col-span-1 border-b-2 sm:border-r-2 sm:border-b-0 border-solid border-main">
          <div className="flex flex-col items-center my-3 px-8">
            <label>Student</label>
            <label className="text-main text-lr font-bold">
              {university?.student_faculty_ratio?.toString().split('.')[0] || '-'}
            </label>
          </div>
        </div>
        <div className="col-span-1 border-b-2 sm:border-b-0 border-solid border-main">
          <div className="flex flex-col items-center my-3 px-8">
            <label>Teacher</label>
            <label className="text-main text-lr font-bold">
              {university?.student_faculty_ratio?.toString().split('.')[1] || '-'}
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CoursesSection = ({
  courseRef,
  selected,
  uniqueDisciplines,
  onDisciplineChange,
  visibleCourses,
  onShowMore,
}) => (
  <div ref={courseRef} className="my-5 ml-8">
    <label className="text text-1.7lr font-bold mb-10">
      <span className="underline underline-offset-8 decoration-main">Cou</span>
      rses
    </label>
    <div className="flex flex-col items-center">
      <div>
        <select
          id="year"
          name="year"
          autoComplete="off"
          className="block bg-light self-auto justify-left p-1 pr-10 w-90% text text-2xs focus:outline-none mt-8 rounded-md"
          onChange={onDisciplineChange}
          value={selected}
        >
          <option value="">Discipline</option>
          {uniqueDisciplines.map((discipline) => (
            <option value={discipline} key={discipline}>
              {discipline}
            </option>
          ))}
        </select>

        {visibleCourses.map((unvdata) => (
          <Course
            key={unvdata?.id}
            course={`${unvdata?.degree?.[0] || ''} in ${unvdata?.name || ''}`}
            state={unvdata?.state}
            country={unvdata?.country}
            degree={unvdata?.degree}
            format={unvdata?.format}
            about={unvdata?.description}
            id={unvdata?.id}
            discipline={unvdata?.discipline}
            sub_discipline={unvdata?.sub_discipline}
            sub_degree={unvdata?.sub_degree}
            fee={`${unvdata?.fees_value} ${unvdata?.fees_currency}`}
            acceptance={unvdata?.acceptance_criteria}
            docs={unvdata?.documents_required}
            url={unvdata?.primary_url}
          />
        ))}
      </div>
      <div>
        <button
          type="button"
          className="block text-white bg-main text-1.5lr p-3 text-lg mb-0 mt-5 items-center rounded-lg self-center"
          onClick={onShowMore}
        >
          Show More
        </button>
      </div>
    </div>
  </div>
);

const HighlightsInfoSection = ({ highlightRef, infoRef, university }) => (
  <div className="my-8 ml-8">
    <div className="flex flex-col items-stretch sm:flex-row bg-transparent justify-between mt-8 mb-5 rounded-lg p-3">
      <div ref={highlightRef} className="w-full px-1 md:w-1/2 md:px-2 text text-2xs">
        <label className="text text-1.7lr font-bold mb-10">
          <span className="underline underline-offset-8 decoration-main">Hig</span>
          hlights
        </label>
        <div className="bg-light mt-5 p-2 rounded-md">
          <p className="text text-xs">
            Find miscellaneous information about students, campus and faculty of {`${university?.name}`} below.
          </p>
          <br />
          <div className="w-full text text-2xs">
            <StatRow label="Population" value={university?.population} />
            <StatRow
              label="International Student Package"
              value={`${university?.avg_salary_value} ${university?.avg_salary_currency}`}
            />
            <StatRow
              label="Graduation Rate"
              value={`${university?.graduation_rate}%`}
            />
          </div>
        </div>
      </div>

      <div ref={infoRef} className="w-full px-1 md:w-1/2 md:px-2 text text-2xs">
        <label className="text text-1.7lr font-bold mb-10">
          <span className="underline underline-offset-8 decoration-main">Add</span>
          itional Info
        </label>
        <div className="bg-light mt-5 p-2 rounded-md">
          <p className="text text-xs">{university?.addr_line_1}</p>
          <p className="text text-xs">{university?.addr_city}</p>
          <p className="text text-xs">{university?.addr_state}, {university?.addr_country}</p>
          <div className="w-full text text-2xs">
            <StatRow label="Email" value={university?.email} />
            <StatRow label="Phone" value={university?.phone} />
            <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
              <label>Website URL</label>
              <label>
                <a
                  href={university?.primary_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {university?.primary_url}
                </a>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export { AboutSection, CoursesSection, HighlightsInfoSection, StatsSection };
