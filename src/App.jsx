import React, { Suspense, useState } from "react";
import {
  NavLink,
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";

import Logout from "./components/Logout";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy loading pages
const Home = React.lazy(() => import("./components/Home"));
const Login = React.lazy(() => import("./components/Login"));
const Register = React.lazy(() => import("./components/Register"));

const RuanganList = React.lazy(() => import("./components/Ruangan/List"));
const RuanganCreate = React.lazy(() => import("./components/Ruangan/Create"));
const RuanganEdit = React.lazy(() => import("./components/Ruangan/Edit"));

const DaftarPegawaiList = React.lazy(() =>
  import("./components/DaftarPegawai/List")
);
const DaftarPegawaiCreate = React.lazy(() =>
  import("./components/DaftarPegawai/Create")
);
const DaftarPegawaiEdit = React.lazy(() =>
  import("./components/DaftarPegawai/Edit")
);

const DaftarTamuList = React.lazy(() => import("./components/DaftarTamu/List"));
const DaftarTamuCreate = React.lazy(() =>
  import("./components/DaftarTamu/Create")
);
const DaftarTamuEdit = React.lazy(() => import("./components/DaftarTamu/Edit"));

import axios from "axios";

function App() {
  const [token, setToken] = useState(localStorage.getItem("authToken"));

  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }

  return (
    <Router>
      {/* NAVBAR */}
      {token && (
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
          <div className="container">
            <NavLink className="navbar-brand" to="/">
              Buku Tamu
            </NavLink>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <NavLink className="nav-link" to="/ruangan">
                    Ruangan
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/daftar-pegawai">
                    Daftar Pegawai
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/daftar-tamu">
                    Daftar Tamu
                  </NavLink>
                </li>
              </ul>

              <ul className="navbar-nav">
                <li className="nav-item">
                  <NavLink className="nav-link" to="/logout">
                    Logout
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      )}

      {/* CONTENT */}
      <div className="container">
        <Suspense
          fallback={
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status" />
              <p className="mt-2">Loading...</p>
            </div>
          }
        >
          <Routes>
            {/* HOME (PROTECTED) */}
            <Route
              path="/"
              element={
                token ? (
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* PUBLIC */}
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout setToken={setToken} />} />

            {/* PROTECTED ROUTES */}
            <Route
              path="/ruangan"
              element={
                <ProtectedRoute>
                  <RuanganList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ruangan/create"
              element={
                <ProtectedRoute>
                  <RuanganCreate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ruangan/edit/:id"
              element={
                <ProtectedRoute>
                  <RuanganEdit />
                </ProtectedRoute>
              }
            />

            <Route
              path="/daftar-pegawai"
              element={
                <ProtectedRoute>
                  <DaftarPegawaiList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/daftar-pegawai/create"
              element={
                <ProtectedRoute>
                  <DaftarPegawaiCreate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/daftar-pegawai/edit/:id"
              element={
                <ProtectedRoute>
                  <DaftarPegawaiEdit />
                </ProtectedRoute>
              }
            />

            <Route
              path="/daftar-tamu"
              element={
                <ProtectedRoute>
                  <DaftarTamuList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/daftar-tamu/create"
              element={
                <ProtectedRoute>
                  <DaftarTamuCreate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/daftar-tamu/edit/:id"
              element={
                <ProtectedRoute>
                  <DaftarTamuEdit />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>

        <footer className="mt-4 text-center">
          &copy; 2025 Kelompok 2 PAW2
        </footer>
      </div>
    </Router>
  );
}

export default App;
