'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TAB_ITEMS = [
  { id: 'shortlisted', name: 'Shortlisted' },
  { id: 'profile', name: 'Profile' },
  { id: 'recommendations', name: 'Recommendations' },
  { id: 'documents', name: 'Documents' },
];

const DashboardNav = () => {
  const pathname = usePathname();
  const normalizedPath = pathname?.replace(/\/$/, '');
  const currentSegment = normalizedPath?.split('/').pop();

  return (
    <nav
      className="bg-light flex justify-start overflow-x-auto hide-scroll-bar whitespace-nowrap snap-x my-10 rounded-md shadow-sm"
      aria-label="Dashboard Tabs"
    >
      {TAB_ITEMS.map((tab) => {
        const isActive = currentSegment === tab.id;
        return (
          <Link
            key={tab.id}
            href={`/dashboard/${tab.id}`}
            className="snap-start"
            aria-current={isActive ? 'page' : undefined}
          >
            <span
              className={`inline-block py-2 px-4 mx-2 my-1 rounded-md transition-all duration-300 ${
                isActive
                  ? 'bg-white text-main font-semibold shadow-md'
                  : 'bg-light text-gray-700 hover:bg-white hover:text-main'
              }`}
            >
              {tab.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default DashboardNav;
