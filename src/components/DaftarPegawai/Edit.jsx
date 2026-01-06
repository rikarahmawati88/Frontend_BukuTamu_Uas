// Import useState dan useEffect untuk mengelola state dan side effects
import { useEffect, useState } from "react";
// Import axios untuk melakukan HTTP request
import axios from "axios";
// Import useNavigate untuk navigasi dan useParams untuk mengambil parameter URL
import { useNavigate, useParams } from "react-router-dom";

export default function EditDaftarPegawai() {
  // useNavigate hook untuk redirect
  const navigate = useNavigate();
  // useParams hook untuk mengambil id dari URL
  const { id } = useParams();

  // State untuk menyimpan nilai input form
  const [formData, setFormData] = useState({
    id_pegawai: "",
    nama: "",
    tanggal_lahir: "",
    no_telpon: "",
    jabatan: "",
    id_ruangan: "",
  });

  // State list ruangan
  const [ruangan, setRuangan] = useState([]);

  // State untuk menyimpan pesan error
  const [error, setError] = useState(null);

  // State untuk menandakan proses loading saat submit
  const [loading, setLoading] = useState(false);

  // State untuk menandakan proses loading saat fetch data
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Fetch data pegawai & ruangan
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);

        const pegawaiRes = await axios.get(`/api/daftarPegawai/${id}`);

        const ruanganRes = await axios.get("/api/ruangan");

        setFormData({
          id_pegawai: pegawaiRes.data.id_pegawai,
          nama: pegawaiRes.data.nama,
          tanggal_lahir: pegawaiRes.data.tanggal_lahir?.substring(0, 10),
          no_telpon: pegawaiRes.data.no_telpon,
          jabatan: pegawaiRes.data.jabatan,
          id_ruangan: pegawaiRes.data.id_ruangan?._id,
        });

        setRuangan(ruanganRes.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching pegawai:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Terjadi kesalahan saat mengambil data"
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
    setFormData({
      ...formData,
      [name]: value,
    });
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
      const response = await axios.put(`/api/daftarPegawai/${id}`, formData);

      console.log("Pegawai updated:", response.data);

      //  NOTIFIKASI BERHASIL
      alert("Data pegawai berhasil diupdate!");

      // Redirect ke halaman list pegawai
      navigate("/daftar-pegawai");
    } catch (err) {
      console.error("Error updating pegawai:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Terjadi kesalahan saat mengupdate data"
      );
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (isLoadingData) {
    return <div className="container-fluid mt-5">Loading...</div>;
  }

  // Render form edit
  return (
    <div className="container-fluid mt-5">
      <h2 className="mb-4">Edit Pegawai</h2>

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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Ruangan</label>
          <select
            className="form-control"
            name="id_ruangan"
            value={formData.id_ruangan}
            onChange={handleChange}
            disabled={loading}
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
            {loading ? "Mengupdate..." : "Update"}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/daftar-pegawai")}
            disabled={loading}
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
