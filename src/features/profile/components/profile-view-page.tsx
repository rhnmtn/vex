import { getCurrentUser } from '@/features/profile/actions/get-current-user';
import { notFound } from 'next/navigation';
import ProfileForm from './profile-form';

export default async function ProfileViewPage() {
  const user = await getCurrentUser();

  if (!user) {
    notFound();
  }

  return (
    <ProfileForm
      initialData={{
        id: user.id,
        name: user.name,
        email: user.email,
        title: user.title,
        phone: user.phone,
        avatarMediaId: user.avatarMediaId,
        avatarPath: user.avatarPath
      }}
    />
  );
}
