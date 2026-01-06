// Import useState untuk mengelola state
import { useEffect, useState } from "react";
// Import axios untuk melakukan HTTP request ke API
import axios from "axios";

export default function CreateDaftarPegawai() {
  // State untuk menyimpan nilai input form
  const [formData, setFormData] = useState({
    id_pegawai: "",
    nama: "",
    tanggal_lahir: "",
    no_telpon: "",
    jabatan: "",
    id_ruangan: "",
  });

  // State untuk menyimpan list ruangan
  const [ruangan, setRuangan] = useState([]);

  // State untuk menyimpan pesan error
  const [error, setError] = useState(null);

  // State untuk menandakan proses loading
  const [loading, setLoading] = useState(false);

  // Ambil data ruangan untuk dropdown
  useEffect(() => {
    axios
      .get("/api/ruangan")
      .then((res) => setRuangan(res.data))
      .catch((err) => console.error("Error fetching ruangan:", err));
  }, []);

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
    if (
      !formData.id_pegawai ||
      !formData.nama ||
      !formData.tanggal_lahir ||
      !formData.no_telpon ||
      !formData.jabatan ||
      !formData.id_ruangan
    ) {
      setError("Semua field harus diisi!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Kirim POST request
      const response = await axios.post("/api/daftarPegawai", formData);

      console.log("Pegawai created:", response.data);
      alert("Data pegawai berhasil disimpan!");

      // Reset form setelah berhasil
      setFormData({
        id_pegawai: "",
        nama: "",
        tanggal_lahir: "",
        no_telpon: "",
        jabatan: "",
        id_ruangan: "",
      });
    } catch (err) {
      console.error("Error creating pegawai:", err);
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
      id_pegawai: "",
      nama: "",
      tanggal_lahir: "",
      no_telpon: "",
      jabatan: "",
      id_ruangan: "",
    });
    setError(null);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Tambah Pegawai</h2>

      {/* Pesan error */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">ID Pegawai</label>
          <input
            type="text"
            className="form-control"
            name="id_pegawai"
            value={formData.id_pegawai}
            onChange={handleChange}
            placeholder="Contoh: PG001"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Nama Pegawai</label>
          <input
            type="text"
            className="form-control"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Tanggal Lahir</label>
          <input
            type="date"
            className="form-control"
            name="tanggal_lahir"
            value={formData.tanggal_lahir}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">No Telepon</label>
          <input
            type="text"
            className="form-control"
            name="no_telpon"
            value={formData.no_telpon}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Jabatan</label>
          <input
            type="text"
            className="form-control"
            name="jabatan"
            value={formData.jabatan}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Ruangan</label>
          <select
            className="form-control"
            name="id_ruangan"
            value={formData.id_ruangan}
            onChange={handleChange}
          >
            <option value="">-- Pilih Ruangan --</option>
            {ruangan.map((r) => (
              <option key={r._id} value={r._id}>
                {r.nama_ruangan} (Lantai {r.lantai})
              </option>
            ))}
          </select>
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
