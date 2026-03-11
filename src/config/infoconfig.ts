import type { InfobarContent } from '@/components/ui/infobar';

export const productInfoContent: InfobarContent = {
  title: 'Product Management',
  sections: [
    {
      title: 'Overview',
      description:
        'The Products page allows you to manage your product catalog. You can view all products in a table format with server-side functionality including sorting, filtering, pagination, and search capabilities. Use the "Add New" button to create new products.',
      links: [
        {
          title: 'Product Management Guide',
          url: '#'
        }
      ]
    },
    {
      title: 'Adding Products',
      description:
        'To add a new product, click the "Add New" button in the page header. You will be taken to a form where you can enter product details including name, description, price, category, and upload product images.',
      links: [
        {
          title: 'Adding Products Documentation',
          url: '#'
        }
      ]
    },
    {
      title: 'Editing Products',
      description:
        'You can edit existing products by clicking on a product row in the table. This will open the product edit form where you can modify any product information. Changes are saved automatically when you submit the form.',
      links: [
        {
          title: 'Editing Products Guide',
          url: '#'
        }
      ]
    },
    {
      title: 'Deleting Products',
      description:
        'Products can be deleted from the product listing table. Click the delete action for the product you want to remove. You will be asked to confirm the deletion before the product is permanently removed from your catalog.',
      links: [
        {
          title: 'Product Deletion Policy',
          url: '#'
        }
      ]
    },
    {
      title: 'Table Features',
      description:
        'The product table includes several powerful features to help you manage large product catalogs efficiently. You can sort columns by clicking on column headers, filter products using the filter controls, navigate through pages using pagination, and quickly find products using the search functionality.',
      links: [
        {
          title: 'Table Features Documentation',
          url: '#'
        },
        {
          title: 'Sorting and Filtering Guide',
          url: '#'
        }
      ]
    },
    {
      title: 'Product Fields',
      description:
        'Each product can have the following fields: Name (required), Description (optional text), Price (numeric value), Category (for organizing products), and Image Upload (for product photos). All fields can be edited when creating or updating a product.',
      links: [
        {
          title: 'Product Fields Specification',
          url: '#'
        }
      ]
    }
  ]
};

export const usersInfoContent: InfobarContent = {
  title: 'Kullanıcı Yönetimi',
  sections: [
    {
      title: 'Genel Bakış',
      description:
        'Kullanıcılar sayfası şirketinize ait kullanıcıları listeleyip yönetmenizi sağlar. Sıralama, filtreleme, sayfalama ve arama özellikleri sunar.',
      links: []
    },
    {
      title: 'Yeni Kullanıcı',
      description:
        'Yeni kullanıcılar kayıt sayfasından oluşturulur. "Yeni Ekle" butonu ile kayıt sayfasına yönlendirilirsiniz.',
      links: []
    },
    {
      title: 'Düzenleme',
      description:
        'Tablodaki satır işlemleri menüsünden "Düzenle" ile kullanıcı bilgilerini (ad, ünvan, telefon, rol, aktiflik) güncelleyebilirsiniz.',
      links: []
    },
    {
      title: 'Pasif Yapma',
      description:
        'Kullanıcıyı pasif yaparak giriş yapmasını engelleyebilirsiniz. Kendi hesabınızı pasif yapamazsınız.',
      links: []
    }
  ]
};

export const customersInfoContent: InfobarContent = {
  title: 'Müşteri Yönetimi',
  sections: [
    {
      title: 'Genel Bakış',
      description:
        'Müşteriler sayfası şirketinize ait müşterileri listeleyip yönetmenizi sağlar. Yetkili kişi, firma adı, iletişim bilgileri ve vergi bilgilerini yönetebilirsiniz.',
      links: []
    },
    {
      title: 'Yeni Müşteri',
      description:
        '"Yeni Ekle" butonu ile yeni müşteri oluşturabilirsiniz. Firma adı zorunludur, diğer alanlar opsiyoneldir.',
      links: []
    },
    {
      title: 'Düzenleme',
      description:
        'Tablodaki satır işlemleri menüsünden "Düzenle" ile müşteri bilgilerini güncelleyebilirsiniz.',
      links: []
    },
    {
      title: 'Silme',
      description:
        'Müşteriyi silmek soft delete yapılır. Silinen müşteriler listede görünmez ancak veritabanında tutulur.',
      links: []
    }
  ]
};
