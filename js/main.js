// Ambil elemen container produk di index.html
const produkContainer = document.getElementById("product-list");

// Inisialisasi keranjang dari localStorage (kalau ada)
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Variabel pagination
let currentPage = 1;
const itemsPerPage = 6; // jumlah produk per halaman
let allProducts = [];

// Fungsi menampilkan produk per halaman
function renderProducts() {
  // Hitung indeks awal dan akhir berdasarkan halaman aktif
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const productsToShow = allProducts.slice(start, end);

  // Tampilkan produk ke dalam grid
  produkContainer.innerHTML = productsToShow
    .map(
      (p) => `
        <div class="col-sm-6 col-md-4 col-lg-4 mb-4 d-flex">
          <div class="card flex-fill shadow-sm border-0">
            <img src="${p.gambar}" class="card-img-top" alt="${p.nama}" loading="lazy" />
            <div class="card-body d-flex flex-column justify-content-between text-center">
              <div>
                <h5 class="card-title text-success fw-bold">${p.nama}</h5>
                <p class="card-text text-muted small">${p.deskripsi}</p>
              </div>
              <div>
                <p class="fw-semibold mb-2 fs-6">Rp ${p.harga.toLocaleString("id-ID")}</p>
                <button class="btn btn-success w-100 fw-semibold" onclick="addToCart(${p.id}, '${p.nama}', ${p.harga}, '${p.gambar}')">
                  🛒 Tambah ke Keranjang
                </button>
              </div>
            </div>
          </div>
        </div>
      `
    )
    .join("");

  renderPaginationControls();
}

// Fungsi menampilkan tombol navigasi halaman
function renderPaginationControls() {
  const totalPages = Math.ceil(allProducts.length / itemsPerPage);
  const paginationContainer = document.getElementById("pagination");

  paginationContainer.innerHTML = `
    <nav>
      <ul class="pagination justify-content-center">
        <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
          <button class="page-link" onclick="changePage(${currentPage - 1})">Sebelumnya</button>
        </li>
        ${Array.from({ length: totalPages }, (_, i) => `
          <li class="page-item ${currentPage === i + 1 ? "active" : ""}">
            <button class="page-link" onclick="changePage(${i + 1})">${i + 1}</button>
          </li>
        `).join("")}
        <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
          <button class="page-link" onclick="changePage(${currentPage + 1})">Berikutnya</button>
        </li>
      </ul>
    </nav>
  `;
}

// Fungsi ganti halaman
function changePage(page) {
  const totalPages = Math.ceil(allProducts.length / itemsPerPage);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderProducts();
}

// Fungsi load semua produk dari JSON
async function loadProducts() {
  try {
    const res = await fetch("data/products.json");
    allProducts = await res.json();
    renderProducts();
  } catch (error) {
    produkContainer.innerHTML =
      "<p class='text-danger text-center'>Gagal memuat produk.</p>";
  }
}

// Fungsi tambah ke keranjang
function addToCart(id, nama, harga, gambar) {
  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    existingItem.jumlah += 1;
  } else {
    cart.push({ id, nama, harga, gambar, jumlah: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  // Notifikasi kecil di pojok bawah
  const toast = document.createElement("div");
  toast.className =
    "position-fixed bottom-0 end-0 m-3 bg-success text-white px-3 py-2 rounded shadow";
  toast.style.zIndex = "1050";
  toast.innerText = `${nama} ditambahkan ke keranjang!`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

// Jalankan loadProducts saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", loadProducts);
