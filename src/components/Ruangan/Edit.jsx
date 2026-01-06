// Import useState dan useEffect untuk mengelola state dan side effects
import { useEffect, useState } from "react";
// Import axios untuk melakukan HTTP request
import axios from "axios";
// Import useNavigate untuk navigasi dan useParams untuk mengambil parameter URL
import { useNavigate, useParams } from "react-router-dom";

export default function EditRuangan() {
  // useNavigate hook untuk redirect
  const navigate = useNavigate();
  // useParams hook untuk mengambil id dari URL
  const { id } = useParams();

  // State untuk menyimpan nilai input form
  const [formData, setFormData] = useState({
    nama_ruangan: "",
    lantai: "",
    keterangan: "",
  });

  // State untuk menyimpan pesan error
  const [error, setError] = useState(null);

  // State untuk menandakan proses loading saat submit
  const [loading, setLoading] = useState(false);

  // State untuk menandakan proses loading saat fetch data
  const [isLoadingData, setIsLoadingData] = useState(true);

  // useEffect untuk fetch data ruangan berdasarkan id
  useEffect(() => {
    const fetchRuangan = async () => {
      try {
        setIsLoadingData(true);

        const response = await axios.get(`/api/ruangan/${id}`);

        // Set data ke form
        setFormData({
          nama_ruangan: response.data.nama_ruangan,
          lantai: response.data.lantai,
          keterangan: response.data.keterangan,
        });

        setError(null);
      } catch (err) {
        console.error("Error fetching ruangan:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Terjadi kesalahan saat mengambil data"
        );
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchRuangan();
  }, [id]);

  // Handle perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
      // PATCH / PUT request untuk update ruangan
      const response = await axios.put(`/api/ruangan/${id}`, {
        nama_ruangan: formData.nama_ruangan,
        lantai: formData.lantai,
        keterangan: formData.keterangan,
      });

      console.log("Ruangan updated:", response.data);

      // ✅ NOTIFIKASI BERHASIL (seperti di Create)
      alert("Data ruangan berhasil diupdate!");

      // Redirect ke halaman list ruangan
      navigate("/ruangan");
    } catch (err) {
      console.error("Error updating ruangan:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Terjadi kesalahan saat mengupdate data"
      );
    } finally {
      setLoading(false);
    }
  };

  // Tampilkan loading saat data sedang diambil
  if (isLoadingData) {
    return <div className="container-fluid mt-5">Loading...</div>;
  }

  // Render form edit
  return (
    <div className="container-fluid mt-5">
      <h2 className="mb-4">Edit Ruangan</h2>

      {/* Pesan error */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nama Ruangan</label>
          <input
            type="text"
            className="form-control"
            name="nama_ruangan"
            value={formData.nama_ruangan}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Lantai</label>
          <input
            type="text"
            className="form-control"
            name="lantai"
            value={formData.lantai}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Keterangan</label>
          <textarea
            className="form-control"
            name="keterangan"
            value={formData.keterangan}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Mengupdate..." : "Update"}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/ruangan")}
            disabled={loading}
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
