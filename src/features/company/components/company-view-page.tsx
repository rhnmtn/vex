import { getCompanyByUser } from '@/features/company/actions/get-company-by-user';
import { notFound } from 'next/navigation';
import CompanyForm from './company-form';

export default async function CompanyViewPage() {
  const company = await getCompanyByUser();

  if (!company) {
    notFound();
  }

  return (
    <CompanyForm
      initialData={{
        id: company.id,
        name: company.name,
        shortName: company.shortName,
        taxOffice: company.taxOffice,
        taxNumber: company.taxNumber,
        address: company.address,
        city: company.city,
        district: company.district,
        phone: company.phone,
        mobile: company.mobile,
        email: company.email,
        website: company.website,
        description: company.description,
        isActive: company.isActive ?? true,
        logoLightMediaId: company.logoLightMediaId,
        logoLightPath: company.logoLightPath,
        logoDarkMediaId: company.logoDarkMediaId,
        logoDarkPath: company.logoDarkPath,
        heroImageMediaId: company.heroImageMediaId,
        heroImagePath: company.heroImagePath,
        heroText: company.heroText,
        heroSubtitle: company.heroSubtitle
      }}
    />
  );
}
