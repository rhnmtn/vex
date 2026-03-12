# Clean Code İnceleme Raporu

Proje clean code prensiplerine göre gözden geçirildi. Tespit edilen maddeler aşağıdadır.

---

## 1. Kullanılmayan / Fazladan Kodlar

### 1.1 Hiç Kullanılmayan Dosyalar
| Dosya | Açıklama |
|-------|----------|
| `src/components/forms/demo-form.tsx` | Demo form bileşeni hiçbir sayfada import edilmiyor |
| `src/components/nav-projects.tsx` | NavProjects bileşeni hiçbir yerde kullanılmıyor |
| `src/hooks/use-multistep-form.tsx` | useMultistepForm hook'u hiçbir yerde kullanılmıyor |

### 1.2 Kullanılmayan Form Bileşenleri (sadece demo-form içinde)
- `FormRadioGroup` – `demo-form` dışında kullanılmıyor
- `FormSlider` – `demo-form` dışında kullanılmıyor  
- `FormFileUpload` – `demo-form` dışında kullanılmıyor (FormMediaPicker kullanılıyor)

### 1.3 Kullanılmayan UI Bileşenleri
| Bileşen | Durum |
|---------|-------|
| `InputOTP` (input-otp.tsx) | Hiçbir yerde import edilmiyor |

### 1.4 Kullanılmayan Actions / API
| Dosya | Açıklama |
|-------|----------|
| `src/features/media/actions/get-media-by-ids.ts` | `getMediaByIds` export ediliyor ama hiçbir yerde çağrılmıyor |

### 1.5 Kullanılmayan Veri
| Dosya | Açıklama |
|-------|----------|
| `src/constants/data.ts` | `recentSalesData` ve `SaleUser` tanımlı ama kullanılmıyor (RecentSales kendi verisini kullanıyor) |

### 1.6 Kullanılmayan Breadcrumb Mapping
| Dosya | Açıklama |
|-------|----------|
| `src/hooks/use-breadcrumbs.tsx` | `/dashboard/employee` mapping'i var ama employee route'u yok |

### 1.7 Kullanılmayan / Fazla Icon Kayıtları
`src/components/icons.tsx` içinde nav'da kullanılmayan:
- `product`, `employee`, `login`, `account`, `kanban`, `billing`, `workspace`, `pro`, `exclusive`, `pizza` vb.

### 1.8 Kullanılmayan / Fazla Bağımlılıklar
| Paket | Durum |
|-------|-------|
| `match-sorter` | fakeProducts kaldırıldıktan sonra kullanılmıyor |
| `sort-by` | Projede kullanım yok |
| `@faker-js/faker` | Sadece mock-api'de kullanılıyordu; artık kullanılmıyor |

---

## 2. Tekrarlanan Kod (DRY İhlali)

### 2.1 Tablo Wrapper Bileşenleri
`PostCategoryTable`, `PostTable`, `CustomerTable`, `MediaTable`, `UserTable` neredeyse aynı:

```tsx
// Her biri aynı pattern:
const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));
const pageCount = Math.ceil(totalItems / pageSize);
const { table } = useDataTable({ data, columns, pageCount, ... });
return <DataTable table={table}><DataTableToolbar table={table} /></DataTable>;
```

**Öneri:** `src/components/ui/table/data-table-wrapper.tsx` gibi generic bir ortak bileşen oluşturulabilir.

### 2.2 Cell Action Bileşenleri
`post-category-tables/cell-action.tsx`, `post-tables/cell-action.tsx`, `customer-tables/cell-action.tsx` benzer yapıda:
- AlertModal
- DropdownMenu (Düzenle, Sil)
- deletePostCategory / deletePost / deleteCustomer vb.

**Öneri:** `DataTableCellAction` generic bileşeni veya parametreli `createCellAction` factory fonksiyonu.

### 2.3 CRUD Action Pattern
`create-post`, `update-post`, `delete-post` ile `create-post-category`, `update-post-category` vb. benzer:
- auth kontrolü
- companyId kontrolü
- session.user.id kullanımı
- revalidatePath

**Öneri:** Ortak auth/tenant guard wrapper veya helper fonksiyonlar.

---

## 3. Karmaşık / Sadeleştirilebilir İşlemler

### 3.1 `use-data-table.ts`
- ~290 satır, tek dosyada çok fazla sorumluluk
- Filter, sort, pagination, URL state mantığı bir arada

**Öneri:** `useDataTableFilters`, `useDataTablePagination` gibi ayrı hook’lara bölünebilir.

### 3.2 `update-post.ts` / `update-post-category.ts`
- featuredImage / bannerImage için aynı mantık (upload, delete, replace)
- Benzer kod blokları tekrarlanıyor

**Öneri:** `updateEntityWithMedia` benzeri ortak helper.

### 3.3 Auth / Session Kontrolü
Her action’da:
```ts
const session = await auth.api.getSession({ headers: await headers() });
if (!session?.user) return { success: false, error: 'Oturum gerekli' };
const companyId = (session.user as SessionUserWithCompany).companyId;
if (companyId == null) return { success: false, error: 'Şirket atanmamış' };
```

**Öneri:** `requireAuthSession()` veya `withCompanyGuard()` gibi ortak wrapper.

### 3.4 Form Submit Handler Tekrarları
`post-form.tsx`, `post-category-form.tsx` benzer yapıda:
- create vs update
- router.push, router.refresh
- form.setError('root', ...)

**Öneri:** `useFormSubmit` veya `createFormSubmitHandler` benzeri ortak helper.

---

## 4. Tutarsızlıklar

### 4.1 Typo
- `page-container.tsx`: `isloading` → `isLoading` (camelCase)

### 4.2 Import Path Tutarsızlığı
- Bazı dosyalar `@/` kullanırken bazıları `../` kullanıyor. Proje genelinde `@/` tercih edilmeli.

---

## 5. Öncelik Sırası (Önerilen)

| Öncelik | İş | Etki |
|---------|-----|------|
| Yüksek | demo-form, nav-projects, use-multistep-form sil | Kullanılmayan kod azalır |
| Yüksek | recentSalesData, SaleUser kaldır veya kullan | data.ts sadeleşir |
| Yüksek | getMediaByIds kaldır veya kullan | Dead code temizlenir |
| Orta | Generic DataTableWrapper oluştur | 5 tablo bileşeni → 1 ortak bileşen |
| Orta | match-sorter, sort-by, faker kaldır | Bağımlılık azalır |
| Orta | requireAuthSession helper | Action’larda tekrar azalır |
| Düşük | Icon registry sadeleştir | Bakım kolaylaşır |
| Düşük | employee breadcrumb mapping kaldır | Gereksiz mapping temizlenir |

---

## 6. Sonuç

- **Kullanılmayan:** ~10+ dosya, ~5 bileşen, kullanılmayan veri ve bağımlılıklar
- **Tekrarlanan:** Tablo wrapper, cell action, CRUD pattern
- **Karmaşık:** use-data-table, auth/session kontrolü, update-with-media mantığı

Bu adımlar uygulanarak kod tabanı sadeleştirilebilir ve bakım maliyeti azaltılabilir.
