// ==========================================
// AYARLAR
// ==========================================
// 3. Adımda kopyaladığın ID'yi tırnakların içine yapıştır:
const SHEET_ID = '1hiJogBGxO1laogkC2K85ELqN185x3GloLf_uvVXkkWI'; 

// ==========================================
// KODLAR (Buraya dokunmana gerek yok)
// ==========================================
const API_URL = `https://opensheet.elk.sh/${SHEET_ID}/1`;

document.addEventListener('DOMContentLoaded', () => {
    const menuContainer = document.getElementById('menu-container');
    menuContainer.innerHTML = '<p style="text-align:center; margin-top:20px;">Menü yükleniyor...</p>';
    fetchMenu();
});

async function fetchMenu() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Veri çekilemedi');
        
        const data = await response.json();
        
        // Eğer tablo boşsa veya hata varsa
        if(data.length === 0) {
            document.getElementById('menu-container').innerHTML = '<p>Menü verisi bulunamadı.</p>';
            return;
        }

        renderMenu(data);

    } catch (error) {
        console.error(error);
        document.getElementById('menu-container').innerHTML = 
            '<p style="text-align:center; color:red;">Menü yüklenirken bir hata oluştu.<br>Lütfen internet bağlantınızı kontrol edin.</p>';
    }
}

function renderMenu(items) {
    const container = document.getElementById('menu-container');
    container.innerHTML = ''; // "Yükleniyor" yazısını temizle

    // 1. Önce kategorileri gruplayalım
    const kategoriler = {};

    items.forEach(item => {
        // Kategori adı boşsa atla
        if (!item.kategori) return;

        if (!kategoriler[item.kategori]) {
            kategoriler[item.kategori] = [];
        }
        kategoriler[item.kategori].push(item);
    });

    // 2. Gruplanan veriyi HTML'e dökelim
    Object.keys(kategoriler).forEach(kategoriAdi => {
        // Kategori Başlığı Bölümü
        const section = document.createElement('section');
        section.classList.add('kategori');

        const title = document.createElement('h2');
        title.classList.add('kategori-baslik');
        title.textContent = kategoriAdi;
        section.appendChild(title);

        // O kategorideki ürünleri listele
        kategoriler[kategoriAdi].forEach(urun => {
            const article = document.createElement('article');
            article.classList.add('urun');

            let resimHTML = '';
            // Eğer tabloda resim hücresi doluysa ekle
            if (urun.resim && urun.resim.trim() !== '') {
                resimHTML = `<img src="${urun.resim}" alt="${urun.ad}" class="urun-resim" onerror="this.style.display='none'">`;
            }

            article.innerHTML = `
                ${resimHTML}
                <div class="urun-bilgi">
                    <div class="urun-ust-kisim">
                        <h3 class="urun-ad">${urun.ad}</h3>
                        <div class="urun-fiyat">${urun.fiyat} TL</div>
                    </div>
                    <p class="urun-aciklama">${urun.aciklama || ''}</p>
                </div>
            `;
            section.appendChild(article);
        });

        container.appendChild(section);
    });
}