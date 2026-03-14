'use client';

import { FormInput } from '@/components/forms/form-input';
import { FormMediaPicker } from '@/components/forms/form-media-picker';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form } from '@/components/ui/form';
import { updateCompany } from '@/features/company/actions/update-company';
import {
  companyFormSchema,
  type CompanyFormValues
} from '@/features/company/schemas/company-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export type CompanyFormData = {
  id: number;
  name: string;
  shortName: string;
  taxOffice: string;
  taxNumber: string;
  address: string | null;
  city: string | null;
  district: string | null;
  phone: string | null;
  mobile: string | null;
  email: string | null;
  website: string | null;
  description: string | null;
  isActive: boolean;
  logoLightMediaId: number | null;
  logoLightPath?: string | null;
  logoDarkMediaId: number | null;
  logoDarkPath?: string | null;
  heroImageMediaId: number | null;
  heroImagePath?: string | null;
  heroText: string | null;
  heroSubtitle: string | null;
} | null;

const COMPANY_FORM_INFO =
  'Şirket bilgilerinizi görüntüleyin ve düzenleyin. Değişiklikleri kaydetmek için Kaydet butonuna tıklayın.';

interface CompanyFormProps {
  initialData: CompanyFormData;
}

export default function CompanyForm({ initialData }: CompanyFormProps) {
  const defaultValues: CompanyFormValues = {
    name: initialData?.name ?? '',
    shortName: initialData?.shortName ?? '',
    taxOffice: initialData?.taxOffice ?? '',
    taxNumber: initialData?.taxNumber ?? '',
    address: initialData?.address ?? '',
    city: initialData?.city ?? '',
    district: initialData?.district ?? '',
    phone: initialData?.phone ?? '',
    mobile: initialData?.mobile ?? '',
    email: initialData?.email ?? '',
    website: initialData?.website ?? '',
    description: initialData?.description ?? '',
    isActive: initialData?.isActive ?? true,
    logoLightMediaId: initialData?.logoLightMediaId ?? null,
    logoLightFile: null,
    logoDarkMediaId: initialData?.logoDarkMediaId ?? null,
    logoDarkFile: null,
    heroImageMediaId: initialData?.heroImageMediaId ?? null,
    heroImageFile: null,
    heroText: initialData?.heroText ?? '',
    heroSubtitle: initialData?.heroSubtitle ?? ''
  };

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues
  });

  const router = useRouter();

  async function onSubmit(values: CompanyFormValues) {
    const hadLogoLight = !!initialData?.logoLightMediaId;
    const hasLogoLightNow =
      !!values.logoLightMediaId ||
      !!(values.logoLightFile && values.logoLightFile instanceof File);
    const logoLightRemoved = hadLogoLight && !hasLogoLightNow;

    const hadLogoDark = !!initialData?.logoDarkMediaId;
    const hasLogoDarkNow =
      !!values.logoDarkMediaId ||
      !!(values.logoDarkFile && values.logoDarkFile instanceof File);
    const logoDarkRemoved = hadLogoDark && !hasLogoDarkNow;

    const hadHero = !!initialData?.heroImageMediaId;
    const hasHeroNow =
      !!values.heroImageMediaId ||
      !!(values.heroImageFile && values.heroImageFile instanceof File);
    const heroRemoved = hadHero && !hasHeroNow;

    const result = await updateCompany({
      name: values.name,
      shortName: values.shortName,
      taxOffice: values.taxOffice,
      taxNumber: values.taxNumber,
      address: values.address?.trim() || null,
      city: values.city?.trim() || null,
      district: values.district?.trim() || null,
      phone: values.phone?.trim() || null,
      mobile: values.mobile?.trim() || null,
      email: values.email?.trim() || null,
      website: values.website?.trim() || null,
      description: values.description?.trim() || null,
      isActive: values.isActive,
      logoLightMediaId: values.logoLightMediaId,
      logoLightFile:
        values.logoLightFile instanceof File ? values.logoLightFile : null,
      logoLightRemoved,
      logoDarkMediaId: values.logoDarkMediaId,
      logoDarkFile:
        values.logoDarkFile instanceof File ? values.logoDarkFile : null,
      logoDarkRemoved,
      heroImageMediaId: values.heroImageMediaId,
      heroImageFile:
        values.heroImageFile instanceof File ? values.heroImageFile : null,
      heroRemoved,
      heroText: values.heroText?.trim() || null,
      heroSubtitle: values.heroSubtitle?.trim() || null
    });

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success('Şirket bilgileri güncellendi');
    router.push('/dashboard/overview');
    router.refresh();
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          Şirket Bilgileri
        </CardTitle>
        <CardDescription className='text-left'>
          {COMPANY_FORM_INFO}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form
          form={form}
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8'
        >
          <Tabs defaultValue='genel' className='w-full'>
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='genel'>Genel</TabsTrigger>
              <TabsTrigger value='logo'>Logo</TabsTrigger>
              <TabsTrigger value='hero'>Hero</TabsTrigger>
            </TabsList>
            <TabsContent value='genel' className='space-y-6 pt-4'>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <FormInput
                  control={form.control}
                  name='name'
                  label='Şirket Adı'
                  placeholder='Şirket adı giriniz'
                  required
                />
                <FormInput
                  control={form.control}
                  name='shortName'
                  label='Kısa Ad'
                  placeholder='Kısa ad (örn: KiralaKal)'
                  required
                />
              </div>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <FormInput
                  control={form.control}
                  name='taxOffice'
                  label='Vergi Dairesi'
                  placeholder='Vergi dairesi'
                  required
                />
                <FormInput
                  control={form.control}
                  name='taxNumber'
                  label='Vergi No'
                  placeholder='Vergi numarası'
                  required
                />
              </div>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <FormInput
                  control={form.control}
                  name='email'
                  label='E-posta'
                  placeholder='ornek@sirket.com'
                  type='email'
                />
                <FormInput
                  control={form.control}
                  name='website'
                  label='Web Sitesi'
                  placeholder='https://www.example.com'
                  type='url'
                />
                <FormInput
                  control={form.control}
                  name='phone'
                  label='Telefon'
                  placeholder='Sabit telefon'
                  type='tel'
                />
                <FormInput
                  control={form.control}
                  name='mobile'
                  label='Cep Telefonu'
                  placeholder='Cep telefonu'
                  type='tel'
                />
              </div>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
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
                placeholder='Şirket açıklaması (opsiyonel)'
                config={{ rows: 3, showCharCount: false }}
              />
            </TabsContent>
            <TabsContent value='logo' className='space-y-6 pt-4'>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <FormMediaPicker
                  control={form.control}
                  name='logoLightMediaId'
                  label='White Logo'
                  description='Açık arka plan için logo (önerilen: kare, min. 200x200 px)'
                  fileFieldName='logoLightFile'
                  existingMedia={
                    initialData?.logoLightMediaId && initialData?.logoLightPath
                      ? {
                          id: initialData.logoLightMediaId,
                          path: initialData.logoLightPath,
                          filename: undefined,
                          size: undefined
                        }
                      : null
                  }
                  config={{ aspectRatio: 'square', maxPreviewWidth: 160 }}
                />
                <FormMediaPicker
                  control={form.control}
                  name='logoDarkMediaId'
                  label='Dark Logo'
                  description='Koyu arka plan için logo (önerilen: kare, min. 200x200 px)'
                  fileFieldName='logoDarkFile'
                  existingMedia={
                    initialData?.logoDarkMediaId && initialData?.logoDarkPath
                      ? {
                          id: initialData.logoDarkMediaId,
                          path: initialData.logoDarkPath,
                          filename: undefined,
                          size: undefined
                        }
                      : null
                  }
                  config={{ aspectRatio: 'square', maxPreviewWidth: 160 }}
                />
              </div>
            </TabsContent>
            <TabsContent value='hero' className='space-y-6 pt-4'>
              <FormMediaPicker
                control={form.control}
                name='heroImageMediaId'
                label='Hero Görseli'
                description='Ana sayfa hero bölümü için arka plan görseli'
                fileFieldName='heroImageFile'
                existingMedia={
                  initialData?.heroImageMediaId && initialData?.heroImagePath
                    ? {
                        id: initialData.heroImageMediaId,
                        path: initialData.heroImagePath,
                        filename: undefined,
                        size: undefined
                      }
                    : null
                }
                config={{ aspectRatio: 'video', maxPreviewWidth: 320 }}
              />
              <FormInput
                control={form.control}
                name='heroText'
                label='Hero Başlık'
                placeholder='Hero üzerinde görünecek başlık'
              />
              <FormTextarea
                control={form.control}
                name='heroSubtitle'
                label='Hero Alt Başlık'
                placeholder='Hero üzerinde görünecek alt metin'
                config={{ rows: 2, showCharCount: false }}
              />
            </TabsContent>
          </Tabs>

          <div className='border-t pt-6'>
            <FormSwitch
              control={form.control}
              name='isActive'
              label='Aktif'
              description='Şirket aktif listede görünür'
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
