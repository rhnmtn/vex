import type { InfobarContent } from '@/components/ui/infobar';

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

export const postsInfoContent: InfobarContent = {
  title: 'Blog Yazıları',
  sections: [
    {
      title: 'Genel Bakış',
      description:
        'Blog yazıları sayfası blog içeriklerinizi yönetmenizi sağlar. Zengin metin editörü ile içerik oluşturabilir, kategorilere atayabilir ve öne çıkan görsel ekleyebilirsiniz.',
      links: []
    },
    {
      title: 'Yeni Yazı',
      description:
        '"Yeni Ekle" butonu ile yeni yazı oluşturabilirsiniz. Başlık, özet, içerik (Lexical editör), öne çıkan görsel, kategoriler ve yayın tarihi alanlarını doldurabilirsiniz.',
      links: []
    },
    {
      title: 'Düzenleme',
      description:
        'Tablodaki satır işlemleri menüsünden "Düzenle" ile yazı bilgilerini güncelleyebilirsiniz.',
      links: []
    },
    {
      title: 'Silme',
      description:
        'Yazıyı silmek soft delete yapılır. Silinen yazılar listede görünmez.',
      links: []
    }
  ]
};

export const postCategoriesInfoContent: InfobarContent = {
  title: 'Yazı Kategorileri',
  sections: [
    {
      title: 'Genel Bakış',
      description:
        'Yazı kategorileri sayfası blog yazılarınızı gruplamak için kategorileri yönetmenizi sağlar. Zengin metin editörü ile kategori sayfası içeriği oluşturabilirsiniz.',
      links: []
    },
    {
      title: 'Yeni Kategori',
      description:
        '"Yeni Ekle" butonu ile yeni kategori oluşturabilirsiniz. Kategori adı ve slug zorunludur. İçerik alanında Lexical editör ile zengin metin yazabilirsiniz.',
      links: []
    },
    {
      title: 'Düzenleme',
      description:
        'Tablodaki satır işlemleri menüsünden "Düzenle" ile kategori bilgilerini güncelleyebilirsiniz.',
      links: []
    },
    {
      title: 'Silme',
      description:
        'Kategoriyi silmek soft delete yapılır. Silinen kategoriler listede görünmez.',
      links: []
    }
  ]
};
