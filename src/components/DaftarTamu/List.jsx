// Import hooks dari React untuk state management dan side effects
import { useState, useEffect } from "react";
// Import axios untuk melakukan HTTP request ke API
import axios from "axios";
// Import NavLink dari react-router-dom untuk navigasi
import { NavLink } from "react-router-dom";
// Import SweetAlert2
import Swal from "sweetalert2";

export default function DaftarTamuList() {
  // State untuk menyimpan data tamu dari API
  const [tamu, setTamu] = useState([]);
  // State untuk menandakan proses loading data
  const [loading, setLoading] = useState(true);
  // State untuk menyimpan pesan error jika terjadi kesalahan
  const [error, setError] = useState(null);
  // State untuk keyword pencarian
  const [search, setSearch] = useState("");

  // useEffect akan dijalankan sekali saat komponen pertama kali di-render
  useEffect(() => {
    // Fungsi async untuk fetch data dari API
    const fetchTamu = async () => {
      try {
        setLoading(true);

        // GET daftar tamu + populate pegawai & ruangan
        const response = await axios.get("/api/daftarTamu");

        setTamu(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching daftar tamu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTamu();
  }, []);

  // Loading & error handler
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // FILTER DATA TAMU (AMAN)
  const filteredTamu = tamu.filter((t) => {
    const keyword = search.toLowerCase();

    return (
      (t.nama_tamu?.toLowerCase() || "").includes(keyword) ||
      (t.no_telepon || "").includes(search) ||
      (t.keperluan?.toLowerCase() || "").includes(keyword) ||
      (t.id_pegawai?.nama?.toLowerCase() || "").includes(keyword) ||
      (t.id_pegawai?.id_ruangan?.nama_ruangan?.toLowerCase() || "").includes(keyword)
    );
  });

  // Fungsi hapus data tamu
  const handleDelete = (id, nama) => {
    Swal.fire({
      title: `Yakin mau hapus tamu ${nama}?`,
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/api/daftarTamu/${id}`)
          .then((response) => {
            // Update state setelah hapus
            setTamu(tamu.filter((t) => t._id !== id));

            Swal.fire({
              title: "Deleted!",
              text: response.data.message || "Data berhasil dihapus",
              icon: "success",
            });
          })
          .catch((err) => {
            console.error("Error deleting tamu:", err);
            Swal.fire("Error", "Gagal menghapus data", "error");
          });
      }
    });
  };

  // Render tabel daftar tamu
  return (
    <div>
      <h1>Daftar Tamu</h1>

      {/* SEARCH BAR */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Cari tamu..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <NavLink to="/daftar-tamu/create" className="btn btn-primary mb-3">
        Tambah Tamu
      </NavLink>

      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Nama Tamu</th>
            <th>No Telepon</th>
            <th>Keperluan</th>
            <th>Waktu Kunjungan</th>
            <th>Pegawai Tujuan</th>
            <th>Ruangan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredTamu.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">
                Data tamu tidak ditemukan
              </td>
            </tr>
          ) : (
            filteredTamu.map((t) => (
              <tr key={t._id}>
                <td>{t.nama_tamu}</td>
                <td>{t.no_telepon}</td>
                <td>{t.keperluan}</td>
                <td>
                  {new Date(t.waktu_kunjungan).toLocaleString("id-ID")}
                </td>
                <td>{t.id_pegawai?.nama || "-"}</td>
                <td>{t.id_pegawai?.id_ruangan?.nama_ruangan || "-"}</td>
                <td>
                  <button
                    className="btn btn-danger me-2"
                    onClick={() => handleDelete(t._id, t.nama_tamu)}
                  >
                    Hapus
                  </button>

                  <NavLink
                    to={`/daftar-tamu/edit/${t._id}`}
                    className="btn btn-warning"
                  >
                    Ubah
                  </NavLink>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

