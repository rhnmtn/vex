/**
 * İlk başlangıç için veritabanı seed scripti
 * Şirket ve kullanıcı oluşturur.
 *
 * Önce tabloları oluşturun: pnpm db:push
 * Sonra çalıştırın: pnpm db:seed
 */

import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from './index';
import { companies, user } from './drizzle-schema';
import { auth } from '@/lib/auth';

// ============ TANIMLAMALAR (Script başında düzenleyin) ============

const SEED_CONFIG = {
  company: {
    name: 'ABC Şirket',
    shortName: 'ABC',
    taxOffice: 'Kadıköy',
    taxNumber: '1234567890',
    address: 'Örnek Mah. Örnek Sok. No:1',
    city: 'İstanbul',
    district: 'Kadıköy'
  },
  user: {
    name: 'Erhan Metin',
    email: 'e.metin@live.com',
    password: '12341234',
    role: 'ADMIN' as const
  }
};

// ============ SEED FONKSİYONU ============

async function seed() {
  console.log('🌱 Seed başlatılıyor...\n');

  // 1. Şirket kontrolü ve oluşturma
  const [existingCompany] = await db
    .select()
    .from(companies)
    .where(eq(companies.taxNumber, SEED_CONFIG.company.taxNumber))
    .limit(1);

  let companyId: number;

  if (existingCompany) {
    console.log('✅ Şirket zaten mevcut:', existingCompany.name);
    companyId = existingCompany.id;
  } else {
    const [newCompany] = await db
      .insert(companies)
      .values({
        name: SEED_CONFIG.company.name,
        shortName: SEED_CONFIG.company.shortName,
        taxOffice: SEED_CONFIG.company.taxOffice,
        taxNumber: SEED_CONFIG.company.taxNumber,
        address: SEED_CONFIG.company.address,
        city: SEED_CONFIG.company.city,
        district: SEED_CONFIG.company.district
      })
      .returning({ id: companies.id });
    companyId = newCompany!.id;
    console.log('✅ Şirket oluşturuldu:', SEED_CONFIG.company.name, '(id:', companyId, ')');
  }

  // 2. Kullanıcı kontrolü
  const [existingUser] = await db
    .select()
    .from(user)
    .where(eq(user.email, SEED_CONFIG.user.email))
    .limit(1);

  if (existingUser) {
    console.log('✅ Kullanıcı zaten mevcut:', existingUser.email);
    // Şirket atanmamışsa güncelle
    if (existingUser.companyId !== companyId) {
      await db
        .update(user)
        .set({ companyId, role: SEED_CONFIG.user.role, updatedAt: new Date() })
        .where(eq(user.id, existingUser.id));
      console.log('   → Şirket ve rol güncellendi');
    }
  } else {
    // 3. Better Auth ile kullanıcı oluştur (şifre hash'lenir)
    try {
      await auth.api.signUpEmail({
        body: {
          name: SEED_CONFIG.user.name,
          email: SEED_CONFIG.user.email,
          password: SEED_CONFIG.user.password
        },
        headers: new Headers()
      });

      // 4. Oluşturulan kullanıcıya şirket ve rol ata
      const [createdUser] = await db
        .select()
        .from(user)
        .where(eq(user.email, SEED_CONFIG.user.email))
        .limit(1);

      if (createdUser) {
        await db
          .update(user)
          .set({
            companyId,
            role: SEED_CONFIG.user.role,
            updatedAt: new Date()
          })
          .where(eq(user.id, createdUser.id));
        console.log('✅ Kullanıcı oluşturuldu:', SEED_CONFIG.user.email);
        console.log('   → Şirket ve ADMIN rolü atandı');
      }
    } catch (err) {
      // E-posta zaten kayıtlı olabilir (race condition)
      const [userByEmail] = await db
        .select()
        .from(user)
        .where(eq(user.email, SEED_CONFIG.user.email))
        .limit(1);
      if (userByEmail) {
        await db
          .update(user)
          .set({ companyId, role: SEED_CONFIG.user.role, updatedAt: new Date() })
          .where(eq(user.id, userByEmail.id));
        console.log('✅ Kullanıcı bulundu, şirket/rol güncellendi:', SEED_CONFIG.user.email);
      } else {
        throw err;
      }
    }
  }

  console.log('\n✨ Seed tamamlandı.');
  console.log('\nGiriş bilgileri:');
  console.log('  E-posta:', SEED_CONFIG.user.email);
  console.log('  Şifre:', SEED_CONFIG.user.password, '(min 8 karakter)');
  console.log('');
}

seed().catch((err) => {
  console.error('❌ Seed hatası:', err);
  process.exit(1);
});
