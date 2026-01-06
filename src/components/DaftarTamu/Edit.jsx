// Import useState dan useEffect
import { useEffect, useState } from "react";
// Import axios
import axios from "axios";
// Import react-router
import { useNavigate, useParams } from "react-router-dom";

export default function EditDaftarTamu() {
  const navigate = useNavigate();
  const { id } = useParams();

  // State form
  const [formData, setFormData] = useState({
    nama_tamu: "",
    no_telepon: "",
    keperluan: "",
    waktu_kunjungan: "",
    id_pegawai: "",
  });

  // State pegawai (dropdown)
  const [pegawai, setPegawai] = useState([]);

  // State error & loading
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Fetch data daftar tamu & pegawai
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);

        // Ambil data tamu
        const tamuRes = await axios.get(`/api/daftarTamu/${id}`);

        // Ambil data pegawai
        const pegawaiRes = await axios.get("/api/daftarPegawai");

        setFormData({
          nama_tamu: tamuRes.data.nama_tamu,
          no_telepon: tamuRes.data.no_telepon,
          keperluan: tamuRes.data.keperluan,
          waktu_kunjungan: tamuRes.data.waktu_kunjungan?.substring(0, 16),
          id_pegawai: tamuRes.data.id_pegawai?._id,
        });

        setPegawai(pegawaiRes.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching daftar tamu:", err);
        setError(
          err.response?.data?.message || err.message || "Gagal mengambil data"
        );
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

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
      const response = await axios.put(`/api/daftarTamu/${id}`, formData);

      console.log("Daftar tamu updated:", response.data);

      // ✅ Notifikasi berhasil
      alert("Data daftar tamu berhasil diupdate!");

      navigate("/daftar-tamu");
    } catch (err) {
      console.error("Error updating daftar tamu:", err);
      setError(
        err.response?.data?.message || err.message || "Gagal mengupdate data"
      );
    } finally {
      setLoading(false);
    }
  };

  // Loading awal
  if (isLoadingData) {
    return <div className="container mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Edit Daftar Tamu</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nama Tamu</label>
          <input
            type="text"
            className="form-control"
            name="nama_tamu"
            value={formData.nama_tamu}
            onChange={handleChange}
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Pegawai Tujuan</label>
          <select
            className="form-control"
            name="id_pegawai"
            value={formData.id_pegawai}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">-- Pilih Pegawai --</option>
            {pegawai.map((p) => (
              <option key={p._id} value={p._id}>
                {p.nama} - {p.jabatan}
              </option>
            ))}
          </select>
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Mengupdate..." : "Update"}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/daftar-tamu")}
            disabled={loading}
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
