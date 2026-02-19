import { redirect } from 'next/navigation';
const DashboardIndexPage = () => {
  redirect('/dashboard/profile');
  return null;
};
export default DashboardIndexPage;
