import {
  apiConfig,
  commonMisspellings,
  embeddedUniversities,
  exchangeRate,
  universityAbbreviations,
} from '@/components/explore_university/universityFinder/constants.js';

export const convertUSDToINR = (usdAmount) =>
  Math.round(usdAmount * exchangeRate);

export const formatINR = (amount) => {
  if (amount === 0) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const estimateTuitionByCountry = (country) => {
  const estimates = {
    'United States': 55000,
    'United Kingdom': 30000,
    Canada: 28000,
    Australia: 42000,
    Germany: 5000,
    France: 8000,
    Netherlands: 15000,
    Switzerland: 2000,
    Singapore: 35000,
    Japan: 25000,
    China: 15000,
    India: 8000,
    'South Korea': 12000,
  };
  return estimates[country] || 20000;
};

const expandAbbreviations = (query) => {
  const lowerQuery = query.toLowerCase().trim();
  if (universityAbbreviations[lowerQuery]) {
    return universityAbbreviations[lowerQuery];
  }

  let expandedQuery = lowerQuery;
  for (const [abbrev, fullName] of Object.entries(universityAbbreviations)) {
    if (expandedQuery.includes(abbrev)) {
      expandedQuery = expandedQuery.replace(
        new RegExp(`\\b${abbrev}\\b`, 'g'),
        fullName,
      );
    }
  }
  return expandedQuery;
};

const correctMisspellings = (query) => {
  let correctedQuery = query.toLowerCase().trim();
  if (commonMisspellings[correctedQuery]) {
    return commonMisspellings[correctedQuery];
  }

  for (const [misspelling, correction] of Object.entries(commonMisspellings)) {
    if (correctedQuery.includes(misspelling)) {
      correctedQuery = correctedQuery.replace(
        new RegExp(misspelling, 'g'),
        correction,
      );
    }
  }
  return correctedQuery;
};

const preprocessQuery = (query) =>
  expandAbbreviations(correctMisspellings(query.toLowerCase().trim()));

const partialWordSearch = (query) => {
  const queryWords = query.toLowerCase().trim().split(/\s+/);
  return embeddedUniversities
    .filter((uni) => {
      const uniWords = uni.name.toLowerCase().split(/\s+/);
      return queryWords.every((queryWord) =>
        uniWords.some(
          (uniWord) =>
            uniWord.includes(queryWord) ||
            queryWord.includes(uniWord) ||
            uniWord.startsWith(queryWord) ||
            queryWord.startsWith(uniWord),
        ),
      );
    })
    .slice(0, 8);
};

const searchEmbeddedDatabase = (query) => {
  const processedQuery = preprocessQuery(query);
  let results = embeddedUniversities.filter((uni) => {
    const nameMatch = uni.name
      .toLowerCase()
      .includes(processedQuery.toLowerCase());
    const cityMatch =
      uni.city && uni.city.toLowerCase().includes(processedQuery.toLowerCase());
    const countryMatch = uni.country
      .toLowerCase()
      .includes(processedQuery.toLowerCase());
    const domainMatch =
      uni.domains &&
      uni.domains.some((domain) =>
        domain.toLowerCase().includes(processedQuery.toLowerCase()),
      );
    return nameMatch || cityMatch || countryMatch || domainMatch;
  });

  if (results.length === 0) {
    results = partialWordSearch(query);
  }

  results.sort((a, b) => {
    const aNameMatch = a.name
      .toLowerCase()
      .includes(processedQuery.toLowerCase())
      ? 1
      : 0;
    const bNameMatch = b.name
      .toLowerCase()
      .includes(processedQuery.toLowerCase())
      ? 1
      : 0;
    if (aNameMatch !== bNameMatch) return bNameMatch - aNameMatch;
    return (a.ranking || 999) - (b.ranking || 999);
  });

  return results.slice(0, 10);
};

const searchOpenAlexAPI = async (query) => {
  const processedQuery = preprocessQuery(query);
  const url = `${apiConfig.openalex}${encodeURIComponent(processedQuery)}&per_page=10`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeout);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`OpenAlex API error: ${response.status}`);
    }

    const data = await response.json();
    return (
      data.results?.map((inst) => ({
        name: inst.display_name,
        country: inst.country_code || 'Unknown',
        city: inst.geo?.city || '',
        domains: inst.homepage_url ? [new URL(inst.homepage_url).hostname] : [],
        web_pages: inst.homepage_url ? [inst.homepage_url] : [],
        ranking: Math.floor(Math.random() * 100) + 1,
        tuition: estimateTuitionByCountry(inst.country_code || 'Unknown'),
      })) || []
    );
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

const searchHipolabsAPI = async (query) => {
  const processedQuery = preprocessQuery(query);
  const url = `${apiConfig.corsProxy}${encodeURIComponent(apiConfig.hipolabs + encodeURIComponent(processedQuery))}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Hipolabs API error: ${response.status}`);
    }

    const data = await response.json();
    const universities = JSON.parse(data.contents);
    return (
      universities?.slice(0, 10).map((uni) => ({
        name: uni.name,
        country: uni.country,
        city: uni['state-province'] || '',
        domains: uni.domains || [],
        web_pages: uni.web_pages || [],
        ranking: Math.floor(Math.random() * 100) + 1,
        tuition: estimateTuitionByCountry(uni.country),
      })) || []
    );
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export const searchUniversities = async (query, setApiStatus) => {
  let results = [];

  try {
    setApiStatus((prev) => ({ ...prev, openalex: 'loading' }));
    results = await searchOpenAlexAPI(query);
    if (!results.length) {
      throw new Error('No results from OpenAlex');
    }
    setApiStatus((prev) => ({ ...prev, openalex: 'success' }));
  } catch (_openAlexError) {
    setApiStatus((prev) => ({ ...prev, openalex: 'error' }));

    try {
      setApiStatus((prev) => ({ ...prev, hipolabs: 'loading' }));
      results = await searchHipolabsAPI(query);
      if (!results.length) {
        throw new Error('No results from Hipolabs');
      }
      setApiStatus((prev) => ({ ...prev, hipolabs: 'success' }));
    } catch (_hipolabsError) {
      setApiStatus((prev) => ({
        ...prev,
        hipolabs: 'error',
        fallback: 'active',
      }));
      results = searchEmbeddedDatabase(query);
    }
  }

  return results;
};

export const getRecommendations = (selectedUniversity) => {
  if (!selectedUniversity) return [];

  let filtered = embeddedUniversities
    .filter(
      (uni) =>
        uni.country === selectedUniversity.country &&
        uni.name !== selectedUniversity.name,
    )
    .slice(0, 2);

  const international = embeddedUniversities
    .filter(
      (uni) =>
        uni.country !== selectedUniversity.country &&
        uni.name !== selectedUniversity.name,
    )
    .slice(0, 1);

  filtered = [...filtered, ...international];

  if (filtered.length < 3) {
    const additional = embeddedUniversities
      .filter(
        (uni) =>
          uni.name !== selectedUniversity.name && !filtered.includes(uni),
      )
      .slice(0, 3 - filtered.length);
    filtered = [...filtered, ...additional];
  }

  return filtered.map((uni, index) => ({
    ...uni,
    matchScore: Math.max(85, 95 - index * 5),
  }));
};
