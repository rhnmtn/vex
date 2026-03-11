import { getCustomerById } from '@/features/customers/actions/get-customer-by-id';
import { notFound } from 'next/navigation';
import CustomerForm from './customer-form';

type CustomerViewPageProps = {
  customerId: string;
};

export default async function CustomerViewPage({
  customerId
}: CustomerViewPageProps) {
  if (customerId === 'new') {
    return (
      <CustomerForm
        initialData={null}
        pageTitle='Yeni Müşteri'
      />
    );
  }

  const id = parseInt(customerId, 10);
  if (Number.isNaN(id)) {
    notFound();
  }

  const customer = await getCustomerById(id);
  if (!customer) {
    notFound();
  }

  return (
    <CustomerForm
      initialData={{
        id: customer.id,
        name: customer.name,
        contactName: customer.contactName,
        mobile: customer.mobile,
        email: customer.email,
        city: customer.city,
        district: customer.district,
        address: customer.address,
        taxOffice: customer.taxOffice,
        taxNumber: customer.taxNumber,
        description: customer.description,
        isActive: customer.isActive ?? true
      }}
      pageTitle='Müşteri Düzenle'
    />
  );
}
