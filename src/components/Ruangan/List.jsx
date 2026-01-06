// Import hooks dari React untuk state management dan side effects
import { useState, useEffect } from "react";
// Import axios untuk melakukan HTTP request ke API
import axios from "axios";
// Import NavLink dari react-router-dom untuk navigasi
import { NavLink } from "react-router-dom";
// Import SweetAlert2
import Swal from "sweetalert2";

export default function RuanganList() {
  // State untuk menyimpan data ruangan dari API
  const [ruangan, setRuangan] = useState([]);
  // State untuk menandakan proses loading data
  const [loading, setLoading] = useState(true);
  // State untuk menyimpan pesan error jika terjadi kesalahan
  const [error, setError] = useState(null);
  // State untuk keyword pencarian
  const [search, setSearch] = useState("");

  // Ambil token user dari localStorage
  const token = localStorage.getItem("authToken");

  // useEffect akan dijalankan sekali saat komponen pertama kali di-render
  useEffect(() => {
    const fetchRuangan = async () => {
      try {
        if (!token) {
          throw new Error("Token tidak ditemukan. Silakan login ulang.");
        }

        setLoading(true);

        const response = await axios.get(
          "/api/ruangan",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRuangan(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching ruangan:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRuangan();
  }, [token]);

  // Tampilkan pesan loading jika data masih diambil
  if (loading) return <div>Loading...</div>;
  // Tampilkan pesan error jika ada kesalahan
  if (error) return <div>Error: {error}</div>;

  // FILTER DATA RUANGAN (AMAN)
  const filteredRuangan = ruangan.filter((r) => {
    const keyword = search.toLowerCase();

    return (
      (r.nama_ruangan?.toLowerCase() || "").includes(keyword) ||
      (r.lantai?.toString() || "").includes(search) ||
      (r.keterangan?.toLowerCase() || "").includes(keyword)
    );
  });

  // Fungsi hapus data ruangan
  const handleDelete = (id, nama_ruangan) => {
    Swal.fire({
      title: `Yakin mau hapus ${nama_ruangan} ?`,
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/api/ruangan/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setRuangan(ruangan.filter((r) => r._id !== id));

            Swal.fire({
              title: "Deleted!",
              text: response.data.message || "Data berhasil dihapus",
              icon: "success",
            });
          })
          .catch((err) => {
            console.error("Error deleting ruangan:", err);
            Swal.fire("Error", "Gagal menghapus data", "error");
          });
      }
    });
  };

  // Render tabel ruangan
  return (
    <div>
      <h1>Ruangan List</h1>

      {/* SEARCH BAR */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Cari ruangan..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TOMBOL TAMBAH */}
      <NavLink to="/ruangan/create" className="btn btn-primary mb-3">
        Tambah Ruangan
      </NavLink>

      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Nama Ruangan</th>
            <th>Lantai</th>
            <th>Keterangan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredRuangan.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                Data ruangan tidak ditemukan
              </td>
            </tr>
          ) : (
            filteredRuangan.map((r) => (
              <tr key={r._id}>
                <td>{r.nama_ruangan}</td>
                <td>{r.lantai}</td>
                <td>{r.keterangan || "-"}</td>
                <td>
                  <button
                    className="btn btn-danger me-2"
                    onClick={() =>
                      handleDelete(r._id, r.nama_ruangan)
                    }
                  >
                    Hapus
                  </button>

                  <NavLink
                    to={`/ruangan/edit/${r._id}`}
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
