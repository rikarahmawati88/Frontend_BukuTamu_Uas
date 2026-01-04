// Import hooks dari React untuk state management dan side effects
import { useState, useEffect } from "react";
// Import axios untuk melakukan HTTP request ke API
import axios from "axios";
// Import NavLink dari react-router-dom untuk navigasi
import { NavLink } from "react-router-dom";
// Import SweetAlert2
import Swal from "sweetalert2";

export default function DaftarPegawaiList() {
  // State untuk menyimpan data pegawai dari API
  const [pegawai, setPegawai] = useState([]);
  // State untuk menandakan proses loading data
  const [loading, setLoading] = useState(true);
  // State untuk menyimpan pesan error jika terjadi kesalahan
  const [error, setError] = useState(null);

  // useEffect akan dijalankan sekali saat komponen pertama kali di-render
  useEffect(() => {
    // Fungsi async untuk fetch data dari API
    const fetchPegawai = async () => {
      try {
        // Set loading true sebelum fetch data
        setLoading(true);

        // Mengambil data dari API menggunakan axios
        const response = await axios.get(
          "http://localhost:3000/api/daftarPegawai"
        );

        // Simpan data yang diterima ke state pegawai
        setPegawai(response.data);

        // Reset error jika fetch berhasil
        setError(null);
      } catch (err) {
        // Jika terjadi error, simpan pesan error ke state
        setError(err.message);
        console.error("Error fetching daftar pegawai:", err);
      } finally {
        // Set loading false setelah proses selesai (berhasil atau gagal)
        setLoading(false);
      }
    };

    // Panggil fungsi fetchPegawai
    fetchPegawai();
  }, []);

  // Tampilkan pesan loading jika data masih diambil
  if (loading) return <div>Loading...</div>;
  // Tampilkan pesan error jika ada kesalahan
  if (error) return <div>Error: {error}</div>;

  // Fungsi hapus data pegawai
  const handleDelete = (id, nama) => {
    Swal.fire({
      title: `Yakin mau hapus ${nama}?`,
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:3000/api/daftarPegawai/${id}`)
          .then((response) => {
            // Update state setelah hapus
            setPegawai(pegawai.filter((p) => p._id !== id));

            Swal.fire({
              title: "Deleted!",
              text: response.data.message || "Data berhasil dihapus",
              icon: "success",
            });
          })
          .catch((err) => {
            console.error("Error deleting pegawai:", err);
            Swal.fire("Error", "Gagal menghapus data", "error");
          });
      }
    });
  };

  // Render tabel daftar pegawai
  return (
    <div>
      <h1>Daftar Pegawai</h1>

      <NavLink to="/daftar-pegawai/create" className="btn btn-primary mb-3">
        Tambah Pegawai
      </NavLink>

      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID Pegawai</th>
            <th>Nama</th>
            <th>No Telepon</th>
            <th>Jabatan</th>
            <th>Ruangan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {/* Loop data pegawai dan tampilkan dalam baris tabel */}
          {pegawai.map((p) => (
            <tr key={p._id}>
              <td>{p.id_pegawai}</td>
              <td>{p.nama}</td>
              <td>{p.no_telpon}</td>
              <td>{p.jabatan}</td>
              <td>{p.id_ruangan?.nama_ruangan}</td>
              <td>
                <button
                  className="btn btn-danger me-2"
                  onClick={() => handleDelete(p._id, p.nama)}
                >
                  Hapus
                </button>

                <NavLink
                  to={`/daftar-pegawai/edit/${p._id}`}
                  className="btn btn-warning"
                >
                  Ubah
                </NavLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
