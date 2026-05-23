export const defaultUniversityFAQ = [
  {
    id: 'home-choose-university',
    question: 'How do I choose the right university for studying abroad?',
    answer:
      'Compare academic fit, entry requirements, graduate outcomes, tuition, living costs, location, scholarships, and post-study work options. A strong shortlist usually includes aspirational, target, and safer universities.',
  },
  {
    id: 'home-application-documents',
    question:
      'Which documents are commonly required for university applications?',
    answer:
      'Most universities ask for academic transcripts, a passport, resume or CV, statement of purpose, letters of recommendation, English test scores, standardized test scores where required, and proof of funds after an offer.',
  },
  {
    id: 'home-intakes',
    question:
      'What are the main university intakes for international students?',
    answer:
      'Common intakes are fall, winter or spring, and sometimes summer. Fall usually has the widest course availability, while later intakes can work well when a student needs more time for tests, documents, or funding.',
  },
];

export const universityFAQByPath = {
  '/': defaultUniversityFAQ,
  '/about': [
    {
      id: 'about-good-university-fit',
      question: 'What makes a university a good fit for a student?',
      answer:
        'A good fit balances the course curriculum, academic level, career outcomes, campus environment, city, budget, scholarship access, and support for international students.',
    },
    {
      id: 'about-ranking-vs-course',
      question:
        'Should students prioritize university rankings or course strength?',
      answer:
        'Rankings can be useful, but course structure, faculty expertise, internships, research options, accreditation, and employability are often more important for long-term outcomes.',
    },
    {
      id: 'about-country-choice',
      question: 'How should students compare study destinations?',
      answer:
        'Compare tuition, living costs, visa rules, part-time work options, graduate work routes, safety, climate, language, and how well the destination supports the student career goal.',
    },
  ],
  '/contact': [
    {
      id: 'contact-admissions-office',
      question: 'When should I contact a university admissions office?',
      answer:
        'Contact admissions when a requirement is unclear, a document status has not updated, a deadline is close, or you need official confirmation before submitting an application.',
    },
    {
      id: 'contact-query-details',
      question:
        'What details should I include in a university admissions query?',
      answer:
        'Include your full name, application ID if available, intended course, intake, nationality, and a clear question. Attach only the documents needed to explain the issue.',
    },
    {
      id: 'contact-response-time',
      question: 'How long do universities usually take to reply?',
      answer:
        'Response times vary by university and season. Replies are often slower near application deadlines, so students should ask important questions well before the final submission date.',
    },
  ],
  '/pricing': [
    {
      id: 'pricing-application-budget',
      question: 'What costs should students budget for when applying abroad?',
      answer:
        'Students should plan for application fees, test fees, transcript charges, courier or document costs, visa fees, health insurance, deposits, tuition, living expenses, and emergency funds.',
    },
    {
      id: 'pricing-application-fees',
      question: 'Do university application fees vary by country and course?',
      answer:
        'Yes. Fees can vary by university, country, degree level, and program. Some universities waive fees during events or for eligible applicants, while others require payment for every application.',
    },
    {
      id: 'pricing-scholarship-budget',
      question:
        'How can scholarships affect the total cost of studying abroad?',
      answer:
        'Scholarships can reduce tuition, living costs, or both. Students should check eligibility, award value, renewal rules, deadlines, and whether the scholarship is automatic or needs a separate application.',
    },
  ],
  '/for-institutions': [
    {
      id: 'institutions-international-recruitment',
      question:
        'What do universities consider when recruiting international students?',
      answer:
        'Universities look at academic readiness, language ability, market demand, visa success patterns, student diversity, retention, employability, and whether applicants understand the program requirements.',
    },
    {
      id: 'institutions-student-support',
      question:
        'Which support services matter most to international applicants?',
      answer:
        'International students often compare admissions guidance, visa documentation support, accommodation help, orientation, academic advising, career services, mental health resources, and language support.',
    },
    {
      id: 'institutions-offer-conversion',
      question: 'Why do admitted students delay accepting university offers?',
      answer:
        'Students may wait because of funding, scholarship decisions, visa preparation, family approval, competing offers, unclear course details, or uncertainty about accommodation and post-study options.',
    },
  ],
  '/how-it-works': [
    {
      id: 'process-start-timeline',
      question:
        'When should students start preparing for university applications?',
      answer:
        'Students should ideally start 9 to 18 months before the intended intake so they have time for course research, exams, document preparation, applications, scholarships, and visa steps.',
    },
    {
      id: 'process-shortlist',
      question: 'How many universities should be on an application shortlist?',
      answer:
        'A practical shortlist often has 6 to 10 universities across reach, match, and safer options. The right number depends on budget, deadlines, entry requirements, and course availability.',
    },
    {
      id: 'process-after-offer',
      question: 'What happens after a university offer is received?',
      answer:
        'Students review offer conditions, pay any required deposit, submit pending documents, apply for scholarships or housing, prepare finances, and begin the visa process for the chosen destination.',
    },
  ],
  '/explore': [
    {
      id: 'explore-compare-universities',
      question: 'What should I compare when exploring universities?',
      answer:
        'Compare course modules, tuition, scholarships, entry requirements, location, class format, internships, research options, rankings by subject, student support, and graduate employment outcomes.',
    },
    {
      id: 'explore-country-filter',
      question: 'How do I decide which country is best for my degree?',
      answer:
        'Start with your career goal, preferred course, budget, language comfort, work options, visa pathway, and whether the destination has strong employers or research in your field.',
    },
    {
      id: 'explore-course-search',
      question:
        'Why do similar courses have different names at different universities?',
      answer:
        'Universities structure programs differently. Similar subjects may appear as majors, specializations, pathways, or concentrations, so students should read modules and learning outcomes before deciding.',
    },
  ],
  '/explore/university': [
    {
      id: 'university-search-filters',
      question: 'Which filters are useful when searching for universities?',
      answer:
        'Useful filters include country, subject, degree level, tuition range, intake, English score, academic score, campus location, scholarship availability, and preferred career pathway.',
    },
    {
      id: 'university-search-compare',
      question: 'How should I compare universities from a search results page?',
      answer:
        'Open each profile and compare course modules, fees, admission criteria, application deadlines, scholarship options, campus setting, student support, and graduate outcomes.',
    },
    {
      id: 'university-search-next-step',
      question: 'What should I do after finding a suitable university?',
      answer:
        'Check the official course page, confirm entry requirements and deadlines, note required documents, review costs, and add the option to a balanced shortlist.',
    },
  ],
  '/explore/university/detail': [
    {
      id: 'university-detail-entry-requirements',
      question: 'How should I read university entry requirements?',
      answer:
        'Check academic grades, prerequisite subjects, English scores, portfolio or interview needs, work experience, document rules, and whether requirements change by campus, intake, or course.',
    },
    {
      id: 'university-detail-course-fit',
      question: 'What makes a university course suitable for my career goal?',
      answer:
        'Look for relevant modules, practical projects, placements, research labs, industry links, accreditation, electives, and graduate destinations connected to the role or field you want.',
    },
    {
      id: 'university-detail-scholarships',
      question: 'Where can I find scholarship details for a university?',
      answer:
        'Scholarship information is usually listed on the university funding pages, course pages, international student pages, and offer letters. Always check deadlines and eligibility before applying.',
    },
  ],
  '/explore/universities/profile': [
    {
      id: 'university-profile-location',
      question:
        'How important is university location for international students?',
      answer:
        'Location affects living costs, internships, part-time work, transport, safety, climate, and access to employers. It should be considered alongside course quality and budget.',
    },
    {
      id: 'university-profile-student-services',
      question: 'Which campus services should international students check?',
      answer:
        'Check international student advising, visa support, housing help, career services, health services, tutoring, disability support, clubs, and orientation for new students.',
    },
    {
      id: 'university-profile-course-pages',
      question: 'Why should I still read the official course page?',
      answer:
        'Official course pages confirm the latest modules, fees, deadlines, accreditation, entry criteria, and application instructions. Profile pages are useful, but official pages should guide final decisions.',
    },
  ],
  '/ai-university-matchmaker': [
    {
      id: 'matchmaker-profile-details',
      question: 'What profile details help find better university matches?',
      answer:
        'Useful details include academic scores, intended degree, preferred countries, budget, test scores, work experience, extracurriculars, intake, scholarship need, and career goals.',
    },
    {
      id: 'matchmaker-reach-match-safe',
      question:
        'What is the difference between reach, match, and safe universities?',
      answer:
        'Reach universities are more competitive than your current profile, match universities align closely with your credentials, and safer universities have entry requirements you are more likely to meet.',
    },
    {
      id: 'matchmaker-results-review',
      question:
        'Should students apply only to universities that match their profile?',
      answer:
        'Students should use profile matches as a starting point, then review course fit, deadlines, funding, visa considerations, and long-term career outcomes before finalizing applications.',
    },
  ],
  '/essay-review': [
    {
      id: 'essay-strong-sop',
      question:
        'What makes a strong statement of purpose for university admission?',
      answer:
        'A strong SOP connects academic background, relevant experience, course reasons, university fit, career goals, and evidence of readiness. It should be specific, structured, and personal.',
    },
    {
      id: 'essay-common-mistakes',
      question: 'What mistakes should students avoid in admission essays?',
      answer:
        'Avoid generic claims, copied templates, unsupported achievements, unclear goals, excessive biography, weak course research, spelling errors, and writing that does not answer the prompt.',
    },
    {
      id: 'essay-word-count',
      question: 'How important is the university essay word limit?',
      answer:
        'Word limits matter because universities use them to assess clarity and judgment. Stay within the limit, prioritize the strongest evidence, and remove repeated or vague sentences.',
    },
  ],
  '/recommendations': [
    {
      id: 'recommendations-validate',
      question: 'How should students validate university recommendations?',
      answer:
        'Students should verify course availability, entry requirements, fees, scholarships, deadlines, campus location, visa requirements, and graduate outcomes on official university pages.',
    },
    {
      id: 'recommendations-final-shortlist',
      question:
        'How do I turn university recommendations into a final shortlist?',
      answer:
        'Group recommendations by admission competitiveness, budget, country, course quality, and deadlines. Remove options that do not match your career plan or financial limits.',
    },
    {
      id: 'recommendations-deadlines',
      question: 'Why do recommended universities have different deadlines?',
      answer:
        'Deadlines vary because universities use different admissions calendars, course capacities, scholarship rounds, and visa timelines. Some programs close early once seats are filled.',
    },
  ],
  '/blogs': [
    {
      id: 'blogs-research-topics',
      question: 'Which study abroad topics should students research first?',
      answer:
        'Start with destination rules, course options, tuition, living costs, scholarships, admissions tests, SOP expectations, visa process, part-time work, and graduate career pathways.',
    },
    {
      id: 'blogs-official-sources',
      question: 'How can students verify study abroad information online?',
      answer:
        'Use official university pages, government visa websites, scholarship portals, test provider pages, and current course handbooks. Recheck details because deadlines and requirements can change.',
    },
    {
      id: 'blogs-updates',
      question: 'Why do university admissions requirements change?',
      answer:
        'Requirements may change because of course updates, accreditation rules, seat availability, visa policy changes, test policy updates, or shifts in applicant demand.',
    },
  ],
  '/blogs/article': [
    {
      id: 'blog-article-date-check',
      question: 'How do I know if study abroad advice is still current?',
      answer:
        'Check the publication date, official university or government sources, intake year, and whether the article links to current deadlines, fees, visa rules, or test policies.',
    },
    {
      id: 'blog-article-apply-context',
      question: 'Can one article decide my university shortlist?',
      answer:
        'No. Articles are useful for research, but students should combine them with official course pages, budget checks, eligibility reviews, and personal career goals.',
    },
    {
      id: 'blog-article-action',
      question: 'What should I do after reading a study abroad article?',
      answer:
        'Turn the advice into a checklist, verify dates and requirements on official sources, compare universities, and note any documents or deadlines that affect your applications.',
    },
  ],
  '/terms-and-conditions': [
    {
      id: 'terms-offer-conditions',
      question:
        'What should students check before accepting a university offer?',
      answer:
        'Students should review offer conditions, tuition deposit rules, refund terms, document deadlines, scholarship status, visa timelines, accommodation options, and the exact course start date.',
    },
    {
      id: 'terms-deposit-rules',
      question: 'Why do university deposit and refund rules matter?',
      answer:
        'Deposit and refund rules affect cash flow and decision timing. Students should read the official policy before paying, especially when comparing multiple offers or waiting for visa decisions.',
    },
    {
      id: 'terms-conditional-admission',
      question: 'What is a conditional university admission offer?',
      answer:
        'A conditional offer means the university may admit the student if specific requirements are met, such as final grades, English scores, documents, portfolio review, or financial proof.',
    },
  ],
  '/privacy-policy': [
    {
      id: 'privacy-documents',
      question: 'What personal documents do universities usually request?',
      answer:
        'Universities commonly request transcripts, passport details, test scores, resumes, essays, recommendation letters, financial documents, and sometimes portfolios or work experience proof.',
    },
    {
      id: 'privacy-safe-sharing',
      question: 'How should students share application documents safely?',
      answer:
        'Students should upload documents through official university portals, use secure email only when instructed, avoid public links, and keep copies of submitted files and receipts.',
    },
    {
      id: 'privacy-proof-funds',
      question: 'Why do universities or visa offices ask for proof of funds?',
      answer:
        'Proof of funds helps confirm that a student can cover tuition, living expenses, insurance, and other study costs. Requirements vary by country and institution.',
    },
  ],
};

export const FAQ_ROUTE_CONFIGS = [
  { path: '/', heading: 'Study Abroad FAQ', faqKey: '/' },
  { path: '/about', heading: 'University Selection FAQ', faqKey: '/about' },
  { path: '/contact', heading: 'Admissions Contact FAQ', faqKey: '/contact' },
  { path: '/pricing', heading: 'Study Abroad Cost FAQ', faqKey: '/pricing' },
  {
    path: '/for-institutions',
    heading: 'International Admissions FAQ',
    faqKey: '/for-institutions',
  },
  {
    path: '/how-it-works',
    heading: 'Application Process FAQ',
    faqKey: '/how-it-works',
  },
  {
    path: '/explore',
    heading: 'University Exploration FAQ',
    faqKey: '/explore',
  },
  {
    path: '/explore/university',
    heading: 'University Search FAQ',
    faqKey: '/explore/university',
  },
  {
    path: '/ai-university-matchmaker',
    heading: 'University Matchmaking FAQ',
    faqKey: '/ai-university-matchmaker',
  },
  {
    path: '/essay-review',
    heading: 'Admission Essay FAQ',
    faqKey: '/essay-review',
  },
  {
    path: '/recommendations',
    heading: 'University Shortlist FAQ',
    faqKey: '/recommendations',
  },
  { path: '/blogs', heading: 'Study Abroad Research FAQ', faqKey: '/blogs' },
  {
    path: '/terms-and-conditions',
    heading: 'University Offer Terms FAQ',
    faqKey: '/terms-and-conditions',
  },
  {
    path: '/privacy-policy',
    heading: 'Application Documents FAQ',
    faqKey: '/privacy-policy',
  },
  {
    prefix: '/blogs/',
    heading: 'Study Abroad Article FAQ',
    faqKey: '/blogs/article',
  },
  {
    prefix: '/explore/universities/',
    heading: 'University Detail FAQ',
    faqKey: '/explore/universities/profile',
  },
  {
    prefix: '/explore/university/',
    heading: 'University Profile FAQ',
    faqKey: '/explore/university/detail',
  },
];

export const normalizeFaqPath = (pathname = '/') => {
  const pathOnly = pathname.split('?')[0].split('#')[0] || '/';
  if (pathOnly === '/') {
    return '/';
  }
  return pathOnly.replace(/\/+$/, '') || '/';
};

const resolveFaqRouteConfig = (pathname = '/') => {
  const normalizedPath = normalizeFaqPath(pathname);
  const exactRoute = FAQ_ROUTE_CONFIGS.find(
    ({ path }) => path === normalizedPath,
  );

  if (exactRoute) {
    return exactRoute;
  }

  const prefixRoute = FAQ_ROUTE_CONFIGS.find(({ prefix }) =>
    prefix ? normalizedPath.startsWith(prefix) : false,
  );

  if (prefixRoute && universityFAQByPath[prefixRoute.faqKey]) {
    return prefixRoute;
  }

  return null;
};

export const getFaqForPath = (pathname = '/') => {
  const routeConfig = resolveFaqRouteConfig(pathname);
  return routeConfig ? universityFAQByPath[routeConfig.faqKey] : null;
};

export const getFaqHeadingForPath = (pathname = '/') => {
  return resolveFaqRouteConfig(pathname)?.heading || null;
};

export const getFaqConfigForPath = (pathname = '/') => {
  const routeConfig = resolveFaqRouteConfig(pathname);

  if (!routeConfig) {
    return null;
  }

  return {
    heading: routeConfig.heading,
    items: universityFAQByPath[routeConfig.faqKey],
  };
};

const toPlainText = (value = '') =>
  value
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export const buildFAQSchema = (pathname = '/') => {
  const faqs = getFaqForPath(pathname);

  if (!faqs?.length) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: toPlainText(item.answer),
      },
    })),
  };
};
