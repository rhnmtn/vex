import { getUserById } from '@/features/users/actions/get-user-by-id';
import { notFound } from 'next/navigation';
import UserForm from './user-form';

type UserViewPageProps = {
  userId: string;
};

export default async function UserViewPage({ userId }: UserViewPageProps) {
  if (userId === 'new') {
    return (
      <UserForm
        initialData={null}
        pageTitle='Yeni Kullanıcı'
      />
    );
  }

  const userData = await getUserById(userId);
  if (!userData) {
    notFound();
  }

  return (
    <UserForm
      initialData={userData}
      pageTitle='Kullanıcı Düzenle'
    />
  );
}
