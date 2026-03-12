'use client';

import { FormInput } from '@/components/forms/form-input';
import { FormSwitch } from '@/components/forms/form-switch';
import { FormTextarea } from '@/components/forms/form-textarea';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { createCustomer } from '@/features/customers/actions/create-customer';
import { updateCustomer } from '@/features/customers/actions/update-customer';
import {
  customerFormSchema,
  type CustomerFormValues
} from '@/features/customers/schemas/customer-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

export type CustomerFormData = {
  id: number;
  name: string;
  contactName: string | null;
  mobile: string | null;
  email: string | null;
  city: string | null;
  district: string | null;
  address: string | null;
  taxOffice: string | null;
  taxNumber: string | null;
  description: string | null;
  isActive: boolean;
} | null;

const CUSTOMER_FORM_INFO =
  'Firma adı zorunludur. Diğer alanlar opsiyoneldir. Kaydet ile form gönderilir.';

interface CustomerFormProps {
  initialData: CustomerFormData;
  pageTitle: string;
  pageDescription?: string;
}

export default function CustomerForm({
  initialData,
  pageTitle,
  pageDescription = CUSTOMER_FORM_INFO
}: CustomerFormProps) {
  const defaultValues: CustomerFormValues = {
    name: initialData?.name ?? '',
    contactName: initialData?.contactName ?? '',
    email: initialData?.email ?? '',
    mobile: initialData?.mobile ?? '',
    city: initialData?.city ?? '',
    district: initialData?.district ?? '',
    address: initialData?.address ?? '',
    taxOffice: initialData?.taxOffice ?? '',
    taxNumber: initialData?.taxNumber ?? '',
    description: initialData?.description ?? '',
    isActive: initialData?.isActive ?? true
  };

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues
  });

  const router = useRouter();
  const isEdit = !!initialData?.id;

  async function onSubmit(values: CustomerFormValues) {
    if (isEdit) {
      const result = await updateCustomer(initialData!.id, {
        name: values.name,
        contactName: values.contactName?.trim() || null,
        mobile: values.mobile?.trim() || null,
        email: values.email?.trim() || null,
        city: values.city?.trim() || null,
        district: values.district?.trim() || null,
        address: values.address?.trim() || null,
        taxOffice: values.taxOffice?.trim() || null,
        taxNumber: values.taxNumber?.trim() || null,
        description: values.description?.trim() || null,
        isActive: values.isActive
      });
      if (!result.success) {
        form.setError('root', { message: result.error });
        return;
      }
    } else {
      const result = await createCustomer({
        name: values.name,
        contactName: values.contactName?.trim() || null,
        mobile: values.mobile?.trim() || null,
        email: values.email?.trim() || null,
        city: values.city?.trim() || null,
        district: values.district?.trim() || null,
        address: values.address?.trim() || null,
        taxOffice: values.taxOffice?.trim() || null,
        taxNumber: values.taxNumber?.trim() || null,
        description: values.description?.trim() || null,
        isActive: values.isActive
      });
      if (!result.success) {
        form.setError('root', { message: result.error });
        return;
      }
    }

    router.push('/dashboard/customers');
    router.refresh();
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
        <CardDescription className='text-left'>
          {pageDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form
          form={form}
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8'
        >
          <div className='w-full'>
            <FormInput
              control={form.control}
              name='name'
              label='Firma Adı'
              placeholder='Firma adı giriniz'
              required
            />
          </div>

          <FormInput
            control={form.control}
            name='contactName'
            label='Yetkili Kişi'
            placeholder='Yetkili adı giriniz'
          />

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <FormInput
              control={form.control}
              name='email'
              label='E-posta'
              placeholder='ornek@firma.com'
            />
            <FormInput
              control={form.control}
              name='mobile'
              label='Telefon'
              placeholder='Telefon numarası'
            />
            <FormInput
              control={form.control}
              name='city'
              label='Şehir'
              placeholder='Şehir'
            />
            <FormInput
              control={form.control}
              name='district'
              label='İlçe'
              placeholder='İlçe'
            />
            <FormInput
              control={form.control}
              name='taxOffice'
              label='Vergi Dairesi'
              placeholder='Vergi dairesi'
            />
            <FormInput
              control={form.control}
              name='taxNumber'
              label='Vergi No'
              placeholder='Vergi numarası'
            />
          </div>

          <FormTextarea
            control={form.control}
            name='address'
            label='Adres'
            placeholder='Adres giriniz'
            config={{ rows: 3, showCharCount: false }}
          />

          <FormTextarea
            control={form.control}
            name='description'
            label='Açıklama'
            placeholder='Açıklama (opsiyonel)'
            config={{ rows: 3, showCharCount: false }}
          />

          <div className='border-t pt-6'>
            <FormSwitch
              control={form.control}
              name='isActive'
              label='Aktif'
              description='Müşteri aktif listede görünür'
            />
          </div>

          <Button type='submit' disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
