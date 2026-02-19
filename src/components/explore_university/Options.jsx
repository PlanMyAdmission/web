import React from 'react';
import { useState } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { createAutocomplete } from '@algolia/autocomplete-core';
import { getAlgoliaResults } from '@algolia/autocomplete-preset-algolia';
// import { Autocomplete } from '../../higherOrderComponents/Autocomplete';
import { Item } from '../../higherOrderComponents/Item';

const appId = '8CPNZ7GSBE';
const apiKey = 'd5e280b4cfd33be419ebfd25c236e5e0';
const searchClient = algoliasearch(appId, apiKey);

// (1) Create a React state.

const Options = () => {
  const [search, setSearch] = useState('');
  const [autocompleteState, setAutocompleteState] = React.useState({});
  const autocomplete = React.useMemo(
    () =>
      createAutocomplete({
        onStateChange({ state }) {
          // (2) Synchronize the Autocomplete state with the React state.
          setAutocompleteState(state);
        },
        getSources() {
          return [
            // (3) Use an Algolia index source.
            {
              sourceId: 'Name',
              getItemInputValue({ item }) {
                return item.query;
              },
              getItems({ query }) {
                return getAlgoliaResults({
                  searchClient,
                  queries: [
                    {
                      indexName: 'explore',
                      query,
                      params: {
                        hitsPerPage: 4,
                        highlightPreTag: '<mark>',
                        highlightPostTag: '</mark>',
                      },
                    },
                  ],
                });
              },
              getItemUrl({ item }) {
                return item.url;
              },
            },
          ];
        },
      }),
    [],
  );
  return (
    <div className="max-w-6xl mx-auto bg-light px-5 py-10 rounded my-5">
      <form>
        <div className="grid md:grid-cols-10 gap-6 sm:grid-cols-6 mb-8">
          <div className="col-span-4 sm:col-span-4">
            <label for="search" className="block pb-3 text-main font-bold">
              Search Course
            </label>
            <div className="relative">
              <div className="flex absolute inset-y-5 left-0 items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-main"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
            </div>
            <div className="aa-Autocomplete" {...autocomplete.getRootProps({})}>
              <input
                type="search"
                id="default-search"
                className="inline aa-Input bg-transparent w-full p-3 pl-11 text-sm ring-main ring-offset-1 ring-1 focus:outline-none placeholder:text-[11px] md:placeholder:text-[14px]"
                placeholder="Search Universites,Courses and more..."
                required=""
                value={search}
                // autoComplete="off"
                onChange={(e) => setSearch(e.target.value)}
                {...autocomplete.getInputProps({})}
              />
              <div className="aa-Panel" {...autocomplete.getPanelProps({})}>
                {autocompleteState.isOpen &&
                  autocompleteState.collections.map((collection, index) => {
                    const { source, items } = collection;

                    return (
                      <div key={`source-${index}`} className="aa-Source">
                        {items.length > 0 && (
                          <ul
                            className="aa-List"
                            {...autocomplete.getListProps()}
                          >
                            {items.map((item) => (
                              <li
                                key={item.objectID}
                                className="aa-Item"
                                {...autocomplete.getItemProps({
                                  item,
                                  source,
                                })}
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          <div className="col-span-2 sm:col-span-2">
            <label for="search" className="block pb-3 text-main font-bold">
              Intake
            </label>
            <select
              id="intake"
              name="intake"
              autocomplete="intake"
              className="inline-block bg-transparent w-full p-3 pr-20 text-sm ring-main ring-offset-1 ring-1 focus:outline-none"
              onChange={() => {}}
              defaultValue={'Select'}
            >
              <option value="">Select</option>
              <option>yes</option>
              <option>yes</option>
              <option>yes</option>
              <option>yes</option>
            </select>
          </div>

          <div className="col-span-2 sm:col-span-2">
            <label for="search" className="block pb-3 text-main font-bold">
              Year
            </label>
            <select
              id="year"
              name="year"
              autocomplete="year"
              className="inline-block bg-transparent w-full p-3 pr-20 text-sm ring-main ring-offset-1 ring-1 focus:outline-none"
              onChange={() => {}}
              defaultValue={''}
            >
              <option value="">Select</option>
              <option>yes</option>
              <option>yes</option>
              <option>yes</option>
              <option>yes</option>
            </select>
          </div>
          <div className="col-span-2 sm:col-span-2">
            <button
              type="submit"
              className="inline-block text-white w-90% uppercase px-4 py-2 mt-0 bg-main sm:mt-10"
            >
              Explore
            </button>
          </div>
        </div>
        <div className="grid md:grid-cols-10 gap-6 sm:grid-cols-6 md:grid-cols-8">
          <div className="col-span-2 sm:col-span-2">
            <label className="text block mb-3">Program Level</label>
            <div className="grid grid-cols-2  sm:grid-cols-1 text-sm">
              <div className="p-1">
                <input type="checkbox" />
                <label className="pl-1">PG Diploma</label>
              </div>

              <div className="p-1">
                <input type="checkbox" />
                <label className="pl-1">UG</label>
              </div>

              <div className="p-1">
                <input type="checkbox" />
                <label className="pl-1">Foundation</label>
              </div>

              <div className="p-1">
                <input type="checkbox" />
                <label className="pl-1">Twinning Programmes (UG) </label>
              </div>
            </div>
          </div>
          <div className="col-span-2 sm:col-span-2">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">
              <div className="mb-2">
                <label className="text block mb-1">Country</label>
                <select
                  id="year"
                  name="year"
                  autocomplete="year"
                  className="inline-block bg-transparent w-full pr-20 text-sm ring-main ring-offset-1 ring-1 focus:outline-none"
                  onChange={() => {}}
                  defaultValue={''}
                >
                  <option value="">Select</option>
                  <option>India</option>
                  <option>India</option>
                  <option>India</option>
                </select>
              </div>

              <div className="mb-2">
                <label className="text block mb-1">Duration</label>
                <select
                  id="year"
                  name="year"
                  autocomplete="year"
                  className="inline-block bg-transparent w-full pr-20 text-sm ring-main ring-offset-1 ring-1 focus:outline-none"
                  onChange={() => {}}
                  defaultValue={''}
                >
                  <option value="">Select</option>
                  <option>India</option>
                  <option>India</option>
                  <option>India</option>
                </select>
              </div>

              <div className="mb-2">
                <label className="text block mb-1">Disclipine Area</label>
                <select
                  id="year"
                  name="year"
                  autocomplete="year"
                  className="inline-block bg-transparent w-full pr-20 text-sm ring-main ring-offset-1 ring-1 focus:outline-none"
                  onChange={() => {}}
                  defaultValue={''}
                >
                  <option value="">Select</option>
                  <option>India</option>
                  <option>India</option>
                  <option>India</option>
                </select>
              </div>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-2">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">
              <div className="mb-2">
                <label className="text block mb-1">Study Area</label>
                <select
                  id="year"
                  name="year"
                  autocomplete="year"
                  className="inline-block bg-transparent w-full pr-20 text-sm ring-main ring-offset-1 ring-1 focus:outline-none"
                  onChange={() => {}}
                  defaultValue={''}
                >
                  <option value="">Select</option>
                  <option>India</option>
                  <option>India</option>
                  <option>India</option>
                </select>
              </div>

              <div className="mb-2">
                <label className="text block mb-1">ESL/ELP Available</label>
                <select
                  id="year"
                  name="year"
                  autocomplete="year"
                  className="inline-block bg-transparent w-full pr-20 text-sm ring-main ring-offset-1 ring-1 focus:outline-none"
                  onChange={() => {}}
                  defaultValue={''}
                >
                  <option value="">Select</option>
                  <option>India</option>
                  <option>India</option>
                  <option>India</option>
                </select>
              </div>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-2">
            <label className="text block mb-3">Requirements</label>
            <div className="grid grid-cols-2 sm:grid-cols-1 text-sm">
              <div className="p-1">
                <input type="checkbox" />
                <label className="pl-1">PG Diploma</label>
              </div>

              <div className="p-1">
                <input type="checkbox" />
                <label className="pl-1">UG</label>
              </div>

              <div className="p-1">
                <input type="checkbox" />
                <label className="pl-1">Foundation</label>
              </div>

              <div className="p-1">
                <input type="checkbox" />
                <label className="pl-1">Twinning Programmes (UG) </label>
              </div>
              <div className="p-1">
                <input type="checkbox" />
                <label className="pl-1">PG Diploma</label>
              </div>

              <div className="p-1">
                <input type="checkbox" />
                <label className="pl-1">UG</label>
              </div>

              <div className="p-1">
                <input type="checkbox" />
                <label className="pl-1">Foundation</label>
              </div>

              <div className="p-1">
                <input type="checkbox" />
                <label className="pl-1">Twinning Programmes (UG) </label>
              </div>
            </div>
          </div>
          {/* <div className="grid grid-cols-1 sm:grid-cols-1 text-sm">
              <div className="p-1">
                <input type="checkbox" />
                <label className="pl-1">PG Diploma</label>
              </div>

              <div className="p-1">
                <input type="checkbox" />
                <label className="pl-1">UG</label>
              </div>

              <div className="p-1">
                <input type="checkbox" />
                <label className="pl-1">Foundation</label>
              </div>

              <div className="p-1">
                <input type="checkbox" />
                <label className="pl-1">Twinning Programmes (UG) </label>
              </div>
            </div> */}
        </div>
      </form>
      <div>
        <p>Other poplular searches</p>
        <button className="border border-main md:py-2 px-4 m-1 rounded-full hover:bg-light md:text-[14px] text-main text-[10px] py-1">
          Computer Science
        </button>
        <button className="border border-main md:py-2 px-4 m-1 rounded-full hover:bg-light md:text-[14px] text-main text-[10px] py-1">
          Science
        </button>
        <button className="border border-main md:py-2 px-4 m-1 rounded-full hover:bg-light md:text-[14px] text-main text-[10px] py-1">
          MBA
        </button>
        <button className="border border-main md:py-2 px-4 m-1 rounded-full hover:bg-light md:text-[14px] text-main text-[10px] py-1">
          PHD
        </button>
      </div>
    </div>
  );
};

export default Options;
