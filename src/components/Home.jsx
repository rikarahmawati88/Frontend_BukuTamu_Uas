import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container mt-5">
      <div className="p-3 mb-4 bg-light rounded-3 shadow-sm">
        <div className="container-fluid py-5 text-center">
          <h1 className="display-5 fw-bold text-primary">Buku Tamu Gen Z</h1>
          <p className="col-md-8 fs-4 mx-auto">
            Selamat datang di sistem manajemen buku tamu modern.
            Kelola data ruangan, pegawai, dan tamu dengan mudah dan efisien.
          </p>
        </div>
      </div>

      {/* 3 Gambar di Tengah */}
      <div className="row mb-4 text-center">
      <div className="col-md-4 mb-3">
        <div className="card shadow rounded-3">
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216"
            className="card-img-top"
            alt="img1"
            style={{ height: "250px", objectFit: "cover" }}
          />
        </div>
      </div>

      <div className="col-md-4 mb-3">
        <div className="card shadow rounded-3">
          <img
            src="https://awsimages.detik.net.id/community/media/visual/2022/09/22/ilustrasi-legalitas-perusahaan_169.jpeg?w=600&q=90"
            className="card-img-top"
            alt="img2"
            style={{ height: "250px", objectFit: "cover" }}
          />
        </div>
      </div>

      <div className="col-md-4 mb-3">
        <div className="card shadow rounded-3">
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
            className="card-img-top"
            alt="img3"
            style={{ height: "250px", objectFit: "cover" }}
          />
        </div>
      </div>
    </div>


      {/* 3 Card */}
      <div className="row align-items-md-stretch">
        <div className="col-md-4 mb-4">
          <div className="h-100 p-5 text-white bg-dark rounded-3 shadow">
            <h2>Ruangan</h2>
            <p>
              Kelola data ruangan kantor, termasuk lokasi lantai dan keterangan.
            </p>
            <Link to="/ruangan" className="btn btn-outline-light">
              Lihat Ruangan
            </Link>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="h-100 p-5 bg-light border rounded-3 shadow-sm">
            <h2>Pegawai</h2>
            <p>
              Manajemen data pegawai, jabatan, dan penempatan ruangan mereka.
            </p>
            <Link to="/daftar-pegawai" className="btn btn-outline-secondary">
              Lihat Pegawai
            </Link>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="h-100 p-5 text-white bg-primary rounded-3 shadow">
            <h2>Tamu</h2>
            <p>
              Catat buku tamu, keperluan kunjungan, dan pegawai yang dituju.
            </p>
            <Link to="/daftar-tamu" className="btn btn-outline-light">
              Lihat Tamu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
