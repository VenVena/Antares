import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

// --- Fungsi API Diletakkan di Sini ---
// CATATAN: Pastikan API Anda di `.../api/obat/${id}` mengembalikan semua field di bawah ini.
const getMedicineById = async (id) => {
  const response = await fetch(`https://antaresapi-production-006d.up.railway.app/api/obat/${id}`);
  if (!response.ok) {
    throw new Error(`Gagal mengambil data obat: ${response.statusText}`);
  }
  const item = await response.json();

  // Transformasi data agar sesuai dengan yang diharapkan komponen.
  // Menambahkan semua field yang diminta dengan fallback jika data null/kosong.
  return {
    id: item.obat_id,
    name: item.nama_obat || "Nama Tidak Tersedia",
    price: parseInt(item.harga_satuan, 10),
    stock: parseInt(item.stok, 10),
    foto: item.foto,
    satuan: item.satuan,
    
    // --- Data Detail Obat ---
    deskripsi: item.deskripsi || "Informasi tidak tersedia.",
    komposisi: item.komposisi || "Informasi tidak tersedia.",
    kemasan: item.kemasan || "Informasi tidak tersedia.",
    manfaat: item.manfaat || "Informasi tidak tersedia.",
    kategori: item.kategori || "Tidak ada kategori",
    dosis: item.dosis, // Boleh null jika memang tidak ada
    penyajian: item.penyajian || "Informasi tidak tersedia.",
    cara_penyimpanan: item.cara_penyimpanan || "Informasi tidak tersedia.",
    perhatian: item.perhatian || "Informasi tidak tersedia.",
    efek_samping: item.efek_samping || "Informasi tidak tersedia.",
    nama_standar_mims: item.nama_standar_mims || "Informasi tidak tersedia.",
    nomor_izin_edar: item.nomor_izin_edar || "Informasi tidak tersedia.",
    golongan_obat: item.golongan_obat || "Informasi tidak tersedia.",
    keterangan: item.keterangan, // Boleh null
    referensi: item.referensi || "Informasi tidak tersedia.",
  };
};


// --- Komponen Ikon SVG (Tidak ada perubahan) ---
const FaArrowLeft = () => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"></path>
  </svg>
);
const FaCartPlus = () => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M528.12 301.319l47.273-208C578.806 78.301 567.391 64 551.99 64H159.99c-15.391 0-26.806 14.301-23.273 29.319L168.1 144h240l-22.067 96.933c-3.163 13.84-16.521 23.067-30.933 23.067H210.421l-15.104 66.458c-3.693 16.299 8.251 31.542 24.685 31.542h224c15.391 0 26.806-14.301 23.273-29.319L528.12 301.319zM256 496c26.51 0 48-21.49 48-48s-21.49-48-48-48-48 21.49-48 48 21.49 48 48 48zm128-48c0 26.51 21.49 48 48 48s48-21.49 48-48-21.49-48-48-48-48 21.49-48 48zm-114.89-283.319L128 32H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h38.686c-3.486-10.154-5.686-20.943-5.686-32 0-35.346 28.654-64 64-64 11.056 0 21.456 2.801 30.274 7.721z"></path>
  </svg>
);


function ProductDetail({ addToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getMedicineById(id);
        setProduct(data);
      } catch (error) {
        console.error(`Error fetching product with id ${id}:`, error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const itemToCart = {
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      unit: product.satuan,
      image: product.foto,
      quantity: quantity,
    };
    addToCart(itemToCart);
    alert(`${quantity} ${product.name} telah ditambahkan ke keranjang!`);
  };

  // --- Bagian Detail Section Component untuk kebersihan kode ---
  const DetailSection = ({ title, content }) => {
    // Hanya render section jika 'content' ada isinya
    if (!content) return null;
    return (
      <div>
        <h3 className="font-semibold text-gray-700 border-b pb-1 mb-2">{title}</h3>
        {/* whitespace-pre-wrap digunakan agar format teks (seperti line break) dari database tetap ditampilkan */}
        <p className="text-gray-600 whitespace-pre-wrap">{content}</p>
      </div>
    );
  };
  
  if (loading) {
    return <div className="text-center py-10 text-gray-500">Memuat data produk...</div>;
  }

  if (!product) {
    return (
      <div className="text-center py-10 text-red-500">
        <p className="text-xl font-semibold">Produk tidak ditemukan</p>
        <p>Gagal mengambil data atau produk dengan ID ini tidak ada.</p>
        <Link to="/products" className="mt-4 inline-flex items-center text-blue-600 hover:underline">
          <FaArrowLeft /> <span className="ml-2">Kembali ke Daftar Produk</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 font-sans">
      <Link to="/products" className="inline-flex items-center text-blue-600 hover:underline mb-4">
        <FaArrowLeft /> <span className="ml-2">Kembali ke Daftar Produk</span>
      </Link>

      <div className="grid md:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow-lg">
        {/* Kolom Gambar */}
        <div className="flex justify-center items-start">
          <img
            src={product.foto}
            alt={product.name}
            className="w-full max-w-sm h-auto object-cover rounded-lg shadow-md border"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/400x400/EEE/31343C?text=Gambar+Tidak+Tersedia";
            }}
          />
        </div>

        {/* Kolom Informasi & Aksi */}
        <div className="flex flex-col space-y-4">
          <p className="text-sm text-gray-500 uppercase">{product.kategori}</p>
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-2xl text-green-600 font-semibold">
            Rp {typeof product.price === 'number' ? product.price.toLocaleString('id-ID') : 'N/A'}
          </p>
          <div>
            <h3 className="font-semibold text-gray-700">Ketersediaan</h3>
            <p className={`font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
              {product.stock > 0 ? `Tersedia (${product.stock} ${product.satuan})` : "Stok Habis"}
            </p>
          </div>

          {/* Tombol Aksi (Jumlah & Keranjang) */}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="flex items-center border rounded-md overflow-hidden">
               <button onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))} disabled={product.stock <= 0} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition-colors">-</button>
               <input type="number" min="1" max={product.stock} value={quantity}
                 onChange={(e) => {
                   const val = parseInt(e.target.value);
                   if (isNaN(val)) { setQuantity(1); } 
                   else { setQuantity(Math.min(product.stock, Math.max(1, val))); }
                 }}
                 disabled={product.stock <= 0} className="w-16 text-center border-x px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
               <button onClick={() => setQuantity((prev) => prev < product.stock ? prev + 1 : product.stock)} disabled={quantity >= product.stock || product.stock <= 0} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition-colors">+</button>
            </div>
            <button onClick={handleAddToCart} disabled={product.stock <= 0} className="flex-grow flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-transform transform hover:scale-105">
              <FaCartPlus /> <span>Tambahkan ke Keranjang</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bagian Detail Lengkap di Bawah */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Detail Produk</h2>
        
        <DetailSection title="Deskripsi" content={product.deskripsi} />
        <DetailSection title="Manfaat" content={product.manfaat} />
        <DetailSection title="Komposisi" content={product.komposisi} />
        <DetailSection title="Dosis" content={product.dosis} />
        <DetailSection title="Aturan Pakai / Penyajian" content={product.penyajian} />
        <DetailSection title="Kemasan" content={product.kemasan} />
        <DetailSection title="Cara Penyimpanan" content={product.cara_penyimpanan} />
        <DetailSection title="Perhatian" content={product.perhatian} />
        <DetailSection title="Efek Samping" content={product.efek_samping} />
        
        {/* Bagian Informasi Tambahan dengan format Key-Value */}
        <div className="border-t pt-4 mt-4 space-y-2">
            <h3 className="font-semibold text-lg text-gray-700 mb-2">Informasi Lainnya</h3>
            <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-600">Nama Standar MIMS</span>
                <span className="text-gray-800">{product.nama_standar_mims}</span>
            </div>
             <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-600">Nomor Izin Edar (NIE)</span>
                <span className="text-gray-800">{product.nomor_izin_edar}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-600">Golongan Obat</span>
                <span className="text-gray-800 bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{product.golongan_obat}</span>
            </div>
            {product.keterangan &&
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-600">Keterangan</span>
                <span className="text-gray-800">{product.keterangan}</span>
              </div>
            }
        </div>
        
        <DetailSection title="Referensi" content={product.referensi} />
      </div>
    </div>
  );
}

export default ProductDetail;