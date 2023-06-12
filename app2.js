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
  e.preventDefault(); 
  gelirler = gelirler + Number(gelirInput.value);
  localStorage.setItem("gelirler", gelirler);
  ekleFormu.reset();
  hesaplaVeGuncelle();
});

//? Sayfa her yuklendikten sonra calisan event
window.addEventListener("load", () => {
  gelirler = Number(localStorage.getItem("gelirler"));
  harcamaListesi = JSON.parse(localStorage.getItem("harcamalar")) || [];
  harcamaListesi.forEach((harcama) => harcamayiDomaYaz(harcama));
  console.log(harcamaListesi);
  tarihInput.valueAsDate = new Date();
  hesaplaVeGuncelle();
});

//? harcama formu submit edildiginde calisir
harcamaFormu.addEventListener("submit", (e) => {
  e.preventDefault(); //? reload'u engelle
  const yeniHarcama = {
    id: new Date().getTime(), //? Sistem saatini (ms olarak) verir. Unique gibidir.
    tarih: tarihInput.value,
    alan: harcamaAlaniInput.value,
    miktar: miktarInput.value,
  };
  harcamaListesi.push(yeniHarcama);
  localStorage.setItem("harcamalar", JSON.stringify(harcamaListesi));
  harcamayiDomaYaz(yeniHarcama);
  hesaplaVeGuncelle();
  harcamaFormu.reset();
  tarihInput.valueAsDate = new Date();
});


const hesaplaVeGuncelle = () => {
  const giderler = harcamaListesi.reduce(
    (toplam, harcama) => toplam + Number(harcama.miktar), 0
  );

  gelirinizTd.innerText = gelirler;
  giderinizTd.innerText = giderler;
  kalanTd.innerText = gelirler - giderler;
};


const harcamayiDomaYaz = ({ id, miktar, tarih, alan }) => {
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
  if (e.target.classList.contains("fa-trash-can")) {
    e.target.parentElement.parentElement.remove();
    const id = e.target.id;
    console.log(id);
    harcamaListesi = harcamaListesi.filter((harcama) => harcama.id != id);
    localStorage.setItem("harcamalar", JSON.stringify(harcamaListesi));
    hesaplaVeGuncelle();
  }
});

temizleBtn.addEventListener("click", () => {
  if (confirm("Emin miyiz?")) { 
    location.reload();
  }
});
