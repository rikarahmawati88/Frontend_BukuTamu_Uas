// Import useState untuk mengelola state
import { useState } from "react";
// Import axios untuk melakukan HTTP request ke API
import axios from "axios";

export default function CreateRuangan() {
  // State untuk menyimpan nilai input form
  const [formData, setFormData] = useState({
    nama_ruangan: "",
    lantai: "",
    keterangan: "",
  });

  // State untuk menyimpan pesan error
  const [error, setError] = useState(null);

  // State untuk menandakan proses loading
  const [loading, setLoading] = useState(false);

  // Handle perubahan input field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi input
    if (!formData.nama_ruangan || !formData.lantai || !formData.keterangan) {
      setError("Semua field harus diisi!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Kirim POST request
      const response = await axios.post("/api/ruangan", formData);

      console.log("Ruangan created:", response.data);
      alert("Data ruangan berhasil disimpan!");

      // Reset form setelah berhasil
      setFormData({
        nama_ruangan: "",
        lantai: "",
        keterangan: "",
      });
    } catch (err) {
      console.error("Error creating ruangan:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Terjadi kesalahan saat menyimpan data"
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset form waktu klik tombol Batal
  const handleReset = () => {
    setFormData({
      nama_ruangan: "",
      lantai: "",
      keterangan: "",
    });
    setError(null);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Tambah Ruangan</h2>

      {/* Pesan error */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nama_ruangan" className="form-label">
            Nama Ruangan
          </label>
          <input
            type="text"
            className="form-control"
            id="nama_ruangan"
            name="nama_ruangan"
            value={formData.nama_ruangan}
            onChange={handleChange}
            placeholder="Contoh: Ruang Rapat"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="lantai" className="form-label">
            Lantai
          </label>
          <input
            type="text"
            className="form-control"
            id="lantai"
            name="lantai"
            value={formData.lantai}
            onChange={handleChange}
            placeholder="Contoh: 2"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="keterangan" className="form-label">
            Keterangan
          </label>
          <textarea
            className="form-control"
            id="keterangan"
            name="keterangan"
            value={formData.keterangan}
            onChange={handleChange}
            placeholder="Contoh: Ruangan khusus rapat"
          />
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={loading}
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
