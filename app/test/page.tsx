import AcmeLogo from '@/app/ui/acme-logo';
import { Suspense } from 'react';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/test/latest-invoices';
import { RevenueChartSkeleton, LatestInvoicesSkeleton } from '@/app/ui/skeletons';
 
export const metadata: Metadata = {
  title: 'Test',
};

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Test', href: '/test', active: true},
          {
            label: 'Create User',
            href: '/test/user',
          },
        ]}
      />
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        <AcmeLogo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
            <Suspense fallback={<RevenueChartSkeleton />}>
            <RevenueChart />
            </Suspense>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
            <Suspense fallback={<LatestInvoicesSkeleton />}>
            <LatestInvoices />
            </Suspense>
        </div>
      </div>
    </main>
  );
}
