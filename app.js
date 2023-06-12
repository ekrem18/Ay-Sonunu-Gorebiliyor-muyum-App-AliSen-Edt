//! Selectors
const ekleBtn = document.getElementById("ekle-btn");
const gelirInput = document.getElementById("gelir-input");
const ekleFormu = document.getElementById("ekle-formu");

//! Sonuc tablosu
const gelirinizTd = document.getElementById("geliriniz");
const giderinizTd = document.getElementById("gideriniz");
const kalanTd = document.getElementById("kalan");

//! Harcama formu
const harcamaFormu = document.getElementById("harcama-formu");
const harcamaAlaniInput = document.getElementById("harcama-alani");
const tarihInput = document.getElementById("tarih");
const miktarInput = document.getElementById("miktar");

//! Harcama Tablosu
const harcamaBody = document.getElementById("harcama-body");
const temizleBtn = document.getElementById("temizle-btn");

//! Variables
let gelirler = 0;

//! Tum harcamalari saklayacak dizi (JSON)
let harcamaListesi = [];

//!Events

//? Formun submit butonuna basildiginda
ekleFormu.addEventListener("submit", (e) => {
  e.preventDefault(); // reload'u engeller ; Böylece JavaScript tarafından belirtilen işlemleri gerçekleştirebilir ve sayfayı yenileme veya başka bir sayfaya yönlendirme gibi varsayılan işlemleri durdurabilirsin

  gelirler = gelirler + Number(gelirInput.value); // stringi number a çevirdim.

  // "gelirler" adında bir anahtarla belirtilen 'gelirler' değerini yerel depolama alanına kaydeder.İlk parametre, kaydedilecek değerin anahtarını temsil eder. İkinci parametre ise kaydedilecek değeri temsil eder.
  localStorage.setItem("gelirler", gelirler);

  // input degerini sifrladim
  ekleFormu.reset();

  // Degisiklikleri DOM'a bas yazan fonks.
  hesaplaVeGuncelle();
});

//? Sayfa her yuklendikten sonra calisan event
window.addEventListener("load", () => {
  // gelirler bilgisini local storage'dan okuyarak global degiskenimize yaz
  
  gelirler = Number(localStorage.getItem("gelirler"));
  // localStroge'den harcama listesini okuyarak global dizimize saklıyoruz.
  
  harcamaListesi = JSON.parse(localStorage.getItem("harcamalar")) || [];
  // harcama dizisinin icindeki objleri tek tek DOMa yaziyoruz.
  
  harcamaListesi.forEach((harcama) => harcamayiDomaYaz(harcama));
  // Tarih inputunu bugun deger ile yukle
  
  tarihInput.valueAsDate = new Date();
  // Degisen bilgileri hesapla ve DOM'a bas
  hesaplaVeGuncelle();
});

//? harcama formu submit edildiginde calisir
harcamaFormu.addEventListener("submit", (e) => {
  e.preventDefault(); //? reload'u engelle

  // yeni harcama bilgileri ile bir obje olustur
  const yeniHarcama = {
    id: new Date().getTime(), //? Sistem saatini (ms olarak) verir. Unique gibidir.
    tarih: tarihInput.value,
    alan: harcamaAlaniInput.value,
    miktar: miktarInput.value,
  };

  // yeni harcama objesini diziye ekle
  harcamaListesi.push(yeniHarcama);

  // dizisin son halini localStorage e gonder.
  localStorage.setItem("harcamalar", JSON.stringify(harcamaListesi));

  harcamayiDomaYaz(yeniHarcama);

  hesaplaVeGuncelle();

  // Formdaki verileri sil
  harcamaFormu.reset();
  tarihInput.valueAsDate = new Date();
});

const hesaplaVeGuncelle = () => {
  const giderler = harcamaListesi.reduce(
    (toplam, harcama) => toplam + Number(harcama.miktar),
    0
  );

  gelirinizTd.innerText = gelirler;
  giderinizTd.innerText = giderler;
  kalanTd.innerText = gelirler - giderler;
  if (gelirler === giderler) {
    alert("Ayranı Yok İçmeye, Atla Gider Sı.maya");
  } else if (giderler > gelirler) {
    alert("Ayranı Yok İçmeye, Atla Gider Sı.maya");
  }
  
};// İlk olarak, harcamaListesi.reduce() yöntemi kullanılarak harcamaListesi dizisindeki her bir harcama öğesi üzerinde bir döngü oluşturulur. Bu döngü, her bir harcamanın miktar özelliğini alır ve toplam değişkenine ekler. 
//Böylece giderler değişkeni, harcamaListesi dizisindeki tüm harcamaların miktarlarının toplamını tutar.
// Sonra, gelirinizTd, giderinizTd ve kalanTd gibi HTML elementlerinin innerText özelliği kullanılarak bu elementlere değerler atanır. gelirinizTd.innerText ifadesi, gelirler değişkeninin değerini gelirinizTd elementinin içeriğine yazar. Aynı şekilde, giderler değişkeni giderinizTd elementine, gelirler - giderler ifadesi ise kalanTd elementine yazılır.

// Bu fonksiyonun amacı, harcamaListesi dizisindeki harcamaların miktarlarını toplamak ve bu toplamları ilgili HTML elementlerine güncellemektir. Böylece, hesaplaVeGuncelle() fonksiyonu çağrıldığında, gelirlerin, giderlerin ve kalan miktarın doğru bir şekilde gösterildiği bir arayüz elde edilir.

const harcamayiDomaYaz = ({ id, miktar, tarih, alan }) => {
  // const { id, miktar, tarih, alan } = yeniHarcama
  harcamaBody.innerHTML += `
  <tr>
    <td>${tarih}</td>
    <td>${alan}</td>
    <td>${miktar}</td>
    <td><i id=${id} class="fa-solid fa-trash-can text-danger"  type="button"></i></td>
  </tr>
  `;
};

harcamaBody.addEventListener("click", (e) => {
  // console.log(e.target)

  // Event bir sil butonundan geldi ise
  if (e.target.classList.contains("fa-trash-can")) {
    // DOM'dan ilgili row'u sildik.
    e.target.parentElement.parentElement.remove();

    const id = e.target.id;
    console.log(id);

    // Dizideki ilgili objeyi sildik.
    harcamaListesi = harcamaListesi.filter((harcama) => harcama.id != id);

    // Silinmis yeni diziyi Local Storage aktardik.
    localStorage.setItem("harcamalar", JSON.stringify(harcamaListesi));

    // her satir silindikten sonra yeni degerleri hesapla ve DOM'a yaz
    hesaplaVeGuncelle();
  }
});



// temizle butonuna basildigi zaman calis
temizleBtn.addEventListener("click", () => {
  if (confirm("Silmek istedigine emin misiniz?")) {
    // harcamaListesi = [];               // RAM'deki harcama listesini sil
    // gelirler = 0;                      // RAM'deki gelirleri sil
    localStorage.clear(); // local straoge'daki tüm verileri sil
    // harcamaBody.innerHTML = "";        // DOM'daki tüm harcamlar sil
    // hesaplaVeGuncelle();               // sonuc tablosundaki (DOM) gelirler, giderler ve kalan degerleri sil.
    location.reload(); // alternatif silme
  }
});
