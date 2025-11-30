// ==========================================
// AYARLAR
// ==========================================
const SHEET_ID = '1hiJogBGxO1laogkC2K85ELqN185x3GloLf_uvVXkkWI'; 

// ==========================================
// KODLAR
// ==========================================
const API_URL = `https://opensheet.elk.sh/${SHEET_ID}/1`;

document.addEventListener('DOMContentLoaded', () => {
    const menuContainer = document.getElementById('menu-container');
    menuContainer.innerHTML = '<p style="text-align:center; margin-top:20px;">Menü yükleniyor...</p>';
    fetchMenu();
    setupModal(); // Modal için olay dinleyicilerini kur
});

async function fetchMenu() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Veri çekilemedi');
        
        const data = await response.json();
        
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
    container.innerHTML = ''; 

    const modal = document.getElementById("resim-modal");
    const modalImg = document.getElementById("buyuk-resim");

    const kategoriler = {};
    items.forEach(item => {
        if (!item.kategori) return;
        if (!kategoriler[item.kategori]) {
            kategoriler[item.kategori] = [];
        }
        kategoriler[item.kategori].push(item);
    });

    Object.keys(kategoriler).forEach(kategoriAdi => {
        const section = document.createElement('section');
        section.classList.add('kategori');

        const title = document.createElement('h2');
        title.classList.add('kategori-baslik');
        title.textContent = kategoriAdi;
        section.appendChild(title);

        kategoriler[kategoriAdi].forEach(urun => {
            const article = document.createElement('article');
            article.classList.add('urun');

            let resimElement = null;
            
            if (urun.resim && urun.resim.trim() !== '') {
                resimElement = document.createElement('img');
                resimElement.src = urun.resim;
                resimElement.alt = urun.ad;
                resimElement.classList.add('urun-resim');
                resimElement.onerror = function() { this.style.display='none' };
                
                // --- DEĞİŞİKLİK BURADA ---
                // Hem 'click' (masaüstü/android) hem de 'touchstart' (iOS için daha güvenilir) olayını dinle
                const openImage = (e) => {
                    e.preventDefault(); // Dokunma olayının yanlışlıkla click'i tetiklemesini engelle
                    modal.classList.add('visible'); // CSS ile görünür yap
                    modalImg.src = resimElement.src; 
                };
                
                resimElement.addEventListener('click', openImage);
                resimElement.addEventListener('touchstart', openImage);
                // --- DEĞİŞİKLİK SONU ---
            }

            article.innerHTML = `
                <div class="urun-bilgi">
                    <div class="urun-ust-kisim">
                        <h3 class="urun-ad">${urun.ad}</h3>
                        <div class="urun-fiyat">${urun.fiyat} TL</div>
                    </div>
                    <p class="urun-aciklama">${urun.aciklama || ''}</p>
                </div>
            `;

            if (resimElement) {
                article.prepend(resimElement);
            }
            
            section.appendChild(article);
        });

        container.appendChild(section);
    });
}

// GÜNCELLENMİŞ MODAL YÖNETİMİ FONKSİYONU
function setupModal() {
    const modal = document.getElementById("resim-modal");
    const span = document.getElementsByClassName("modal-kapat")[0];

    const closeModal = () => {
        modal.classList.remove('visible'); // CSS ile gizle
    };

    // Kapatma (X) butonuna tıklandığında modalı kapat
    span.addEventListener('click', closeModal);
    
    // Karartılmış arka plana tıklandığında modalı kapat
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
}