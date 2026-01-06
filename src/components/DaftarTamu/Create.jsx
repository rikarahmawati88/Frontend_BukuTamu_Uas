// Import useState untuk mengelola state
import { useEffect, useState } from "react";
// Import axios untuk melakukan HTTP request ke API
import axios from "axios";

export default function CreateDaftarTamu() {
  // State untuk menyimpan nilai input form
  const [formData, setFormData] = useState({
    nama_tamu: "",
    no_telepon: "",
    keperluan: "",
    waktu_kunjungan: "",
    id_pegawai: "",
  });

  // State untuk menyimpan list pegawai
  const [pegawai, setPegawai] = useState([]);

  // State untuk menyimpan data ruangan dari pegawai terpilih
  const [ruanganPegawai, setRuanganPegawai] = useState(null);

  // State untuk menyimpan pesan error
  const [error, setError] = useState(null);

  // State untuk menandakan proses loading
  const [loading, setLoading] = useState(false);

  // Ambil data pegawai (sudah populate ruangan)
  useEffect(() => {
    axios
      .get("/api/daftarPegawai")
      .then((res) => setPegawai(res.data))
      .catch((err) => console.error("Error fetching pegawai:", err));
  }, []);

  // Handle perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Jika memilih pegawai → set ruangan otomatis
    if (name === "id_pegawai") {
      const selectedPegawai = pegawai.find((p) => p._id === value);
      setRuanganPegawai(selectedPegawai?.id_ruangan || null);
    }

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
      !formData.nama_tamu ||
      !formData.no_telepon ||
      !formData.keperluan ||
      !formData.waktu_kunjungan ||
      !formData.id_pegawai
    ) {
      setError("Semua field harus diisi!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Kirim POST request
      const response = await axios.post("/api/daftarTamu", formData);

      console.log("Tamu created:", response.data);
      alert("Data tamu berhasil disimpan!");

      // Reset form
      setFormData({
        nama_tamu: "",
        no_telepon: "",
        keperluan: "",
        waktu_kunjungan: "",
        id_pegawai: "",
      });
      setRuanganPegawai(null);
    } catch (err) {
      console.error("Error creating tamu:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Terjadi kesalahan saat menyimpan data"
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      nama_tamu: "",
      no_telepon: "",
      keperluan: "",
      waktu_kunjungan: "",
      id_pegawai: "",
    });
    setRuanganPegawai(null);
    setError(null);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Tambah Daftar Tamu</h2>

      {/* Pesan error */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nama Tamu</label>
          <input
            type="text"
            className="form-control"
            name="nama_tamu"
            value={formData.nama_tamu}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">No Telepon</label>
          <input
            type="text"
            className="form-control"
            name="no_telepon"
            value={formData.no_telepon}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Keperluan</label>
          <input
            type="text"
            className="form-control"
            name="keperluan"
            value={formData.keperluan}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Waktu Kunjungan</label>
          <input
            type="datetime-local"
            className="form-control"
            name="waktu_kunjungan"
            value={formData.waktu_kunjungan}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Pegawai Tujuan</label>
          <select
            className="form-control"
            name="id_pegawai"
            value={formData.id_pegawai}
            onChange={handleChange}
          >
            <option value="">-- Pilih Pegawai --</option>
            {pegawai.map((p) => (
              <option key={p._id} value={p._id}>
                {p.nama} - {p.jabatan}
              </option>
            ))}
          </select>
        </div>

        {/* Ruangan otomatis */}
        {ruanganPegawai && (
          <div className="mb-3">
            <label className="form-label">Ruangan</label>
            <input
              type="text"
              className="form-control"
              value={`${ruanganPegawai.nama_ruangan} (Lantai ${ruanganPegawai.lantai})`}
              disabled
            />
          </div>
        )}

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
