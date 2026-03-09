'use client';

import React from 'react';
import { year, month } from '@/components/recommendations/recommendationData.js';

export const StepOne = ({
  countries,
  states,
  degrees,
  disciplines,
  filterData,
  onFilterChange,
}) => (
  <div className="m-5 grid gap-4 grid-cols-1 sm:grid-cols-6 justify-center">
    <div className="col-span-1 sm:col-span-2">
      <p className="text-md">
        Choose your prefered Country<label className="text-main">*</label>
      </p>
      <select
        className="bg-light px-4 py-2 rounded-md my-1 w-full"
        name="country"
        onChange={onFilterChange}
        value={filterData.country}
        required
      >
        <option value="" disabled>
          Select
        </option>
        {(countries ?? []).map((value) => (
          <option key={value.id ?? value.name} value={value.name}>
            {value.name}
          </option>
        ))}
      </select>
    </div>

    <div className="col-span-1 sm:col-span-1">
      <p>
        Select State<label className="text-main">*</label>
      </p>
      <select
        className="bg-light px-4 py-2 rounded-md my-1 w-full"
        onChange={onFilterChange}
        name="state"
        value={filterData.state}
        required
      >
        <option value="" disabled>
          Select
        </option>
        {(states ?? []).map((value) => (
          <option key={value.id ?? value.name} value={value.name}>
            {value.name}
          </option>
        ))}
      </select>
    </div>

    <div className="col-span-1 sm:col-span-2">
      <p>
        Select the degree you wish to pursue
        <label className="text-main">*</label>
      </p>
      <select
        className="bg-light px-4 py-2 rounded-md my-1 w-full"
        name="degree"
        onChange={onFilterChange}
        value={filterData.degree}
        required
      >
        <option value="" disabled>
          Select
        </option>
        {(degrees ?? []).map((value) => (
          <option key={value.id ?? value.name} value={value.name}>
            {value.name}
          </option>
        ))}
      </select>
    </div>

    <div className="col-span-1 sm:col-span-3 mt-2">
      <p>
        Select your preferred discipline/specialization
        <label className="text-main">*</label>
      </p>
      <select
        className="bg-light px-4 py-2 rounded-md my-1 w-full"
        name="discipline"
        onChange={onFilterChange}
        value={filterData.discipline}
        required
      >
        <option value="" disabled>
          Select
        </option>
        {(disciplines ?? []).map((value) => (
          <option key={value.id ?? value.name} value={value.name}>
            {value.name}
          </option>
        ))}
      </select>
    </div>

    <div className="col-span-1 sm:col-span-3 mt-2">
      <p className="pt-2">Select your preferred application cycle.</p>
      <p className="flex gap-2">
        Year:{' '}
        <span className="flex flex-col sm:flex-row">
          {year.map((value) => (
            <label key={value} className="flex flex-row mr-3 items-center gap-1">
              <input
                type="radio"
                name="year"
                value={value}
                onChange={onFilterChange}
                checked={filterData.year === value}
              />
              <span>{value}</span>
            </label>
          ))}
        </span>
      </p>

      <p className="pt-2">
        Month:{' '}
        <select
          className="px-4 py-2 rounded-md bg-light"
          name="month"
          onChange={onFilterChange}
          value={filterData.month}
        >
          <option value="" disabled>
            Select
          </option>
          {month.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </p>
    </div>
  </div>
);

export const StepTwo = ({ filterData, onFilterChange }) => (
  <div className="col-span-1 sm:col-span-3">
    <h1 className="pt-2">Have you taken any certifications?</h1>
    <div className="flex flex-col">
      <label className="flex flex-row mr-3 items-center">
        <input
          type="radio"
          className="py-2"
          name="certification"
          value="Extra-curricular"
          onChange={onFilterChange}
          checked={filterData.certification === 'Extra-curricular'}
        />
        <span className="px-2">Extra-curricular</span>
      </label>
      <label className="flex flex-row mr-3 items-center">
        <input
          type="radio"
          name="certification"
          onChange={onFilterChange}
          value="Volunteering"
          checked={filterData.certification === 'Volunteering'}
        />
        <span className="px-2">Volunteering</span>
      </label>
      <label className="flex flex-row mr-3 items-center">
        <input
          type="radio"
          name="certification"
          value="Both"
          onChange={onFilterChange}
          checked={filterData.certification === 'Both'}
        />
        <span className="px-2">Both</span>
      </label>
    </div>
  </div>
);

export const StepThree = ({ filterData, onFilterChange }) => (
  <div className="m-5 grid gap-4 grid-cols-1 sm:grid-cols-6 justify-center">
    <div className="col-span-1 sm:col-span-2">
      <p>Have you taken any aptitude tests?</p>
      <div className="flex flex-col">
        <label className="flex flex-row mr-3 gap-1 items-center">
          <input
            type="radio"
            name="aptitude"
            value="No,I'm planning to take"
            onChange={onFilterChange}
            checked={filterData.aptitude === "No,I'm planning to take"}
          />
          <span>No, I&apos;m planning to take</span>
        </label>
        <label className="flex flex-row mr-3 gap-1 items-center">
          <input
            type="radio"
            name="aptitude"
            value="SAT"
            onChange={onFilterChange}
            checked={filterData.aptitude === 'SAT'}
          />
          <span>SAT</span>
        </label>
        <label className="flex flex-row mr-3 gap-1 items-center">
          <input
            type="radio"
            name="aptitude"
            value="ACT"
            onChange={onFilterChange}
            checked={filterData.aptitude === 'ACT'}
          />
          <span>ACT</span>
        </label>
      </div>
    </div>
    <div className="col-span-1 sm:col-span-2">
      <p>Have you taken any English proficiency tests?</p>
      <div className="flex flex-col">
        <label className="flex flex-row mr-3 gap-1 items-center">
          <input
            type="radio"
            name="proficiency"
            value="No,I'm planning to take"
            onChange={onFilterChange}
            checked={filterData.proficiency === "No,I'm planning to take"}
          />
          <span>No, I&apos;m planning to take</span>
        </label>
        <label className="flex flex-row mr-3 gap-1 items-center">
          <input
            type="radio"
            name="proficiency"
            value="IELTS"
            onChange={onFilterChange}
            checked={filterData.proficiency === 'IELTS'}
          />
          <span>IELTS</span>
        </label>
        <label className="flex flex-row mr-3 gap-1 items-center">
          <input
            type="radio"
            name="proficiency"
            value="Cambridge English"
            onChange={onFilterChange}
            checked={filterData.proficiency === 'Cambridge English'}
          />
          <span>Cambridge English</span>
        </label>
        <label className="flex flex-row mr-3 gap-1 items-center">
          <input
            type="radio"
            name="proficiency"
            value="PTE"
            onChange={onFilterChange}
            checked={filterData.proficiency === 'PTE'}
          />
          <span>PTE</span>
        </label>
      </div>
    </div>
  </div>
);
