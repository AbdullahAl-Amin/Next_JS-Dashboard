import Form from '@/app/test/user/create-user';
import AcmeLogo from '@/app/ui/acme-logo';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';

export const metadata: Metadata = {
  title: 'Create User',
};
 
export default async function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Test', href: '/test' },
          {
            label: 'Create User',
            href: '/test/user',
            active: true,
          },
        ]}
      />
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        <AcmeLogo />
      </div>
      <Form/>
    </main>
  );
}