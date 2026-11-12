// ==========================================
// BAKKAL AMCA - DİNAMİK YÖNETİM SİSTEMİ (JS)
// ==========================================

// 1. Varsayılan Ürün Listesi
const varsayilanUrunler = [
    { 
        id: 1, 
        ad: "Ülker Çikolatalı Gofret", 
        marka: "Ülker", 
        fiyat: 20.00, 
        resim: "resimler/ulkercikolataligofret.jpg", 
        barkod: "1234567" 
    },
    { 
        id: 2, 
        ad: "Yudum Ayçiçek Yağı 5L", 
        marka: "Yudum", 
        fiyat: 250.00, 
        resim: "resimler/yudum.jpg", 
        barkod: "9876543" 
    }
];

// 2. Tarayıcı Hafızasından (LocalStorage) Verileri Çek
let urunler = JSON.parse(localStorage.getItem('bakkalUrunler')) || varsayilanUrunler;

// İlk açılışta hafıza boşsa varsayılanları kaydet
if (!localStorage.getItem('bakkalUrunler')) {
    localStorage.setItem('bakkalUrunler', JSON.stringify(varsayilanUrunler));
}

// 3. Hafıza Güncelleme Yardımcı Fonksiyonu
function hafizayiGuncelle() {
    localStorage.setItem('bakkalUrunler', JSON.stringify(urunler));
}

// 4. EKRAN ÇİZİM FONKSİYONU
function vitriniCiz(liste) {
    const vitrinKutusu = document.querySelector('.vitrin');
    const tabloGövdesi = document.querySelector('.urun-tablosu tbody') || document.querySelector('table tbody');
    const markalarKonteyner = document.querySelector('.markalar-konteyner');

    // A) VİTRİN KARTLARI (index.html)
    if (vitrinKutusu) {
        let html = "";
        if (liste.length === 0) {
            html = `
                <div style="grid-column: 1 / -1; text-align: center; color: #94a3b8; padding: 40px 0;">
                    <i class="fa-solid fa-magnifying-glass" style="font-size: 32px; margin-bottom: 10px; display: block;"></i>
                    Aradığınız kriterlere uygun ürün bulunamadı.
                </div>
            `;
        } else {
            liste.forEach(urun => {
                html += `
                    <div class="urun-karti" data-id="${urun.id}">
                        <div class="kart-aksiyonlari">
                            <button class="btn-aksiyon btn-duzenle" data-id="${urun.id}" title="Ürünü Düzenle">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button class="btn-aksiyon btn-sil" data-id="${urun.id}" title="Ürünü Sil">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>

                        <img src="${urun.resim || 'resimler/ulkercikolataligofret.jpg'}" alt="${urun.ad}">
                        <h3>${urun.ad}</h3>
                        <p class="marka">${urun.marka}</p>
                        <p class="fiyat">${Number(urun.fiyat).toFixed(2)} TL</p>
                        <small class="barkod">Barkod: ${urun.barkod}</small>
                    </div>
                `;
            });
        }
        
        html += `
            <div class="urun-karti kart-ekle">
                <a href="urun-ekle.html">
                    <div class="arti-simgesi">+</div>
                    <span>Yeni Ürün Ekle</span>
                </a>
            </div>
        `;
        vitrinKutusu.innerHTML = html;
    }

    // B) TABLO SATIRLARI (urunler.html)
    if (tabloGövdesi) {
        let html = "";
        if (liste.length === 0) {
            html = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 20px; color: #94a3b8;">
                        Listelenecek ürün bulunamadı.
                    </td>
                </tr>
            `;
        } else {
            liste.forEach(urun => {
                html += `
                    <tr data-id="${urun.id}">
                        <td><img src="${urun.resim || 'resimler/ulkercikolataligofret.jpg'}" alt="${urun.ad}" width="45" height="45" style="border-radius: 6px; object-fit: cover;"></td>
                        <td>${urun.barkod || '-'}</td>
                        <td>${urun.ad}</td>
                        <td>${urun.marka}</td>
                        <td>${Number(urun.fiyat).toFixed(2)} TL</td>
                        <td class="islem-hucre">
                            <button type="button" class="btn-aksiyon btn-duzenle" data-id="${urun.id}">Düzenle</button>
                            <button type="button" class="btn-aksiyon btn-sil" data-id="${urun.id}">Sil</button>
                        </td>
                    </tr>
                `;
            });
        }
        tabloGövdesi.innerHTML = html;
    }

    // C) MARKA KATALOĞU (markalar.html)
    if (markalarKonteyner) {
        let html = "";
        const markalar = [...new Set(urunler.map(u => u.marka))];

        if (markalar.length === 0) {
            html = `<p style="color:#94a3b8;">Henüz kayıtlı marka bulunmuyor.</p>`;
        } else {
            markalar.forEach(markaAdi => {
                const markaUrunleri = urunler.filter(u => u.marka === markaAdi);
                let urunSatirlari = "";

                markaUrunleri.forEach(u => {
                    urunSatirlari += `
                        <tr>
                            <td><img src="${u.resim || 'resimler/ulkercikolataligofret.jpg'}" width="35" height="35" style="border-radius:4px; object-fit:cover;"></td>
                            <td>${u.ad}</td>
                            <td>${u.barkod || '-'}</td>
                            <td>${Number(u.fiyat).toFixed(2)} TL</td>
                            <td class="islem-hucre">
                                <button type="button" class="btn-aksiyon btn-duzenle" data-id="${u.id}">Düzenle</button>
                                <button type="button" class="btn-aksiyon btn-sil" data-id="${u.id}">Sil</button>
                            </td>
                        </tr>
                    `;
                });

                html += `
                    <div class="marka-kart">
                        <div class="marka-baslik">
                            <span>${markaAdi} (${markaUrunleri.length} Ürün)</span>
                            <span class="ok-simgesi">&#9660;</span>
                        </div>
                        <div class="marka-icerik">
                            <div class="marka-icerik-ic">
                                <table class="marka-urun-tablosu">
                                    <thead>
                                        <tr>
                                            <th>Görsel</th>
                                            <th>Ürün Adı</th>
                                            <th>Barkod</th>
                                            <th>Fiyat</th>
                                            <th>İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${urunSatirlari}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
        markalarKonteyner.innerHTML = html;

        document.querySelectorAll('.marka-baslik').forEach(baslik => {
            baslik.onclick = function() {
                this.parentElement.classList.toggle('aktif');
            };
        });
    }

    butonOlaylariniBagla();
}

function urunleriListele() {
    vitriniCiz(urunler);
}

// 5. Sil ve Düzenle Buton Dinleyicileri
function butonOlaylariniBagla() {
    document.querySelectorAll('.btn-sil').forEach(btn => {
        btn.onclick = function(e) {
            e.stopPropagation();
            const urunId = Number(this.getAttribute('data-id'));
            urunSil(urunId);
        };
    });

    document.querySelectorAll('.btn-duzenle').forEach(btn => {
        btn.onclick = function(e) {
            e.stopPropagation();
            const urunId = Number(this.getAttribute('data-id'));
            urunGuncelle(urunId);
        };
    });
}

// 6. Ürün Silme Fonksiyonu
function urunSil(silinecekId) {
    if (confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
        urunler = urunler.filter(urun => urun.id !== silinecekId);
        hafizayiGuncelle();
        markaFiltresiniGuncelle();
        urunleriListele();
    }
}

// 7. Ürün Güncelleme Fonksiyonu
function urunGuncelle(guncellenecekId) {
    const urun = urunler.find(u => u.id === guncellenecekId);
    if (!urun) return;

    const yeniAd = prompt("Yeni Ürün Adı:", urun.ad);
    const yeniFiyat = prompt("Yeni Fiyat (TL):", urun.fiyat);

    if (yeniAd && yeniFiyat) {
        urun.ad = yeniAd;
        urun.fiyat = Number(yeniFiyat);
        hafizayiGuncelle();
        urunleriListele();
    }
}

// 8. Sol Menüdeki Marka Filtresini Dinamik Doldurma
function markaFiltresiniGuncelle() {
    const markaSelect = document.getElementById('marka-filtrele');
    if (!markaSelect) return;

    const markalar = [...new Set(urunler.map(u => u.marka))];
    const seciliMarka = markaSelect.value;

    let options = `<option value="">Tüm Markalar</option>`;
    markalar.forEach(marka => {
        options += `<option value="${marka}">${marka}</option>`;
    });

    markaSelect.innerHTML = options;
    markaSelect.value = seciliMarka;
}

// 9. Canlı Arama ve Marka Filtreleme Mantığı
function filtreyiUygula() {
    const aramaKutusu = document.getElementById('urun-arama');
    const markaSelect = document.getElementById('marka-filtrele');

    const arananMetin = aramaKutusu ? aramaKutusu.value.toLowerCase().trim() : "";
    const seciliMarka = markaSelect ? markaSelect.value.toLowerCase().trim() : "";

    const filtrelenmis = urunler.filter(urun => {
        const urunAd = (urun.ad || "").toLowerCase();
        const urunMarka = (urun.marka || "").toLowerCase();
        const urunBarkod = (urun.barkod || "").toLowerCase();

        const aramaUyum = urunAd.includes(arananMetin) || 
                          urunMarka.includes(arananMetin) || 
                          urunBarkod.includes(arananMetin);

        const markaUyum = seciliMarka === "" || urunMarka === seciliMarka;

        return aramaUyum && markaUyum;
    });

    vitriniCiz(filtrelenmis);
}

// 10. YENİ ÜRÜN EKLEME FORMU (urun-ekle.html)
const urunFormu = document.querySelector('.urun-formu');
if (urunFormu) {
    urunFormu.addEventListener('submit', function(e) {
        e.preventDefault();

        const barkod = document.getElementById('barkod')?.value || '';
        const ad = document.getElementById('urun-adi')?.value || 'İsimsiz Ürün';
        const marka = document.getElementById('marka')?.value || 'Diğer';
        const fiyat = Number(document.getElementById('fiyat')?.value || 0);
        const gorselInput = document.getElementById('gorsel');

        function urunuKaydetVeYonlendir(resimVerisi) {
            const yeniUrun = {
                id: Date.now(),
                barkod: barkod,
                ad: ad,
                marka: marka,
                fiyat: fiyat,
                resim: resimVerisi
            };

            urunler.push(yeniUrun);
            hafizayiGuncelle();
            alert(`${ad} başarıyla eklendi!`);
            window.location.href = "index.html";
        }

        if (gorselInput && gorselInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function(event) {
                urunuKaydetVeYonlendir(event.target.result);
            };
            reader.readAsDataURL(gorselInput.files[0]);
        } else {
            urunuKaydetVeYonlendir("resimler/ulkercikolataligofret.jpg");
        }
    });
}

// 11. SAYFA YÜKLENME ANINDA OTOMATİK ÇALIŞMA
document.addEventListener('DOMContentLoaded', function() {
    urunleriListele();
    markaFiltresiniGuncelle();

    const aramaKutusu = document.getElementById('urun-arama');
    const markaSelect = document.getElementById('marka-filtrele');

    if (aramaKutusu) {
        aramaKutusu.addEventListener('input', filtreyiUygula);
    }

    if (markaSelect) {
        markaSelect.addEventListener('change', filtreyiUygula);
    }
});