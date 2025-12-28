# ⚙️ Motor Kontrol Simülatörü

🚀 **Site** [https://ard4wien.github.io/Motor/](https://ard4wien.github.io/Motor/)

---

## ✨ Ana Özellikler (Key Features)

- 🔒 **Mühürleme Devresi (Holding Circuit):** Kontaktörlerin kendi kontağı üzerinden enerjisini sürdürme mantığı birebir simüle edilmiştir.
- 🔄 **Elektriksel Kilitleme (Interlocking):** İleri ve geri yön butonları arasında elektriksel koruma (NC kontak kilitleme).
- ⚡ **Gerçekçi 3P Sigorta:** Faz bazlı renk kodları (L1-L2-L3) ve aktif durum parlaması ile endüstriyel tasarım.
- ⚙️ **Dinamik Motor Animasyonu:** Yön ve hıza duyarlı rotor dönüşü, şaft parlaması ve görsel hız çizgileri.
- 📱 **Mobil Desteği:** Mobilde açılır-kapanır (collapsible) araç kutusu ve duyarlı durum çubuğu.
- 💎 **Premium Estetik:** Glassmorphism arayüz, yumuşak mikro-animasyonlar ve modern tipografi.

---

## 🛠️ Kullandığım Teknolojiler

- **Frontend:** [React](https://react.dev/)
- **Durum Yönetimi (State):** [Zustand](https://zustand-demo.pmnd.rs/)
- **Animasyon:** [Framer Motion](https://www.framer.com/motion/)
- **Build Aracı:** [Vite](https://vitejs.dev/)
- **Stil:** Vanilla CSS (Custom Design System)

---

## 🚀 Yerel Kurulum (Local Setup)

Projeyi kendi bilgisayarınızda çalıştırmak için:

1. Depoyu klonlayın:
   ```bash
   git clone https://github.com/Ard4Wien/Motor.git
   ```
2. Proje dizinine gidin:
   ```bash
   cd Motor
   ```
3. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
4. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

---

## 📦 Dağıtım (Deployment)

Projeyi GitHub Pages üzerinde yayınlamak için:

```bash
npm run deploy
```

---

## 👨‍💻 Hazırlayan (By)
**Arda** - *Motor Similasyonu Projesi*
---

> [!TIP]
> **Önemli:** Motoru çalıştırmak için önce **Otomatik Bağla** butonuna basabilir veya terminal bağlantılarını 13-14 (NO) ve 21-22 (NC) standartlarına uygun şekilde yapabilirsiniz.
