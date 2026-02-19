import DashboardNav from '@/components/dashboard/user/DashboardNav';

export const metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

const DashboardLayout = ({ children }) => {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <DashboardNav />
      <div className="px-2 sm:px-0">{children}</div>
    </div>
  );
};
export default DashboardLayout;
