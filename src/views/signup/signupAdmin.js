import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './signupadmin.module.css';

export default function SignupAdmin() {
  const [fields, setFields] = useState({
    nama: '',
    email: '',
    password: '',
    konfirmasi: ''
  });

  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function validate() {
    const e = {};
    if (!fields.nama) e.nama = "Nama wajib diisi";
    if (!fields.email) e.email = "Email wajib diisi";
    if (!fields.password) e.password = "Kata sandi wajib diisi";
    if (!fields.konfirmasi) e.konfirmasi = "Konfirmasi wajib diisi";
    if (fields.password && fields.konfirmasi && fields.password !== fields.konfirmasi) {
      e.konfirmasi = "Konfirmasi tidak cocok";
    }
    return e;
  }

  function handleChange(e) {
    setFields({ ...fields, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    setSubmitted(true);

    if (Object.keys(err).length === 0) {
      try {
        const res = await fetch('/api/registerAdmin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nama: fields.nama,
            email: fields.email,
            password: fields.password
          })
        });

        const data = await res.json();

        if (res.ok) {
          alert('Admin berhasil terdaftar!');
          window.location.href = '/Signin/hal-signAdmin';
        } else {
          alert(data.error || 'Terjadi kesalahan saat mendaftar admin');
        }
      } catch (err) {
        console.error('Error:', err);
        alert('Gagal menghubungi server');
      }
    }
  }

  const bolehDaftar = Object.values(fields).every(Boolean) && fields.password === fields.konfirmasi;

  return (
    <div className={styles.background}>
      <div className={styles.topbar}>
        <div className={styles.logoWrap}>
          <Image
            src="/assets/D'ONE Putih.png"
            alt="D'ONE"
            width={75}
            height={40}
            className={styles.logoDone}
            priority
          />
        </div>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.card}>
          <Image
            src="/assets/BI_Logo.png"
            alt="Bank Indonesia"
            width={120}
            height={34}
            className={styles.logoBI}
            priority
          />

          <div className={styles.cardTitle}>Registrasi Admin</div>
          <div className={styles.cardSubtitle}>Buat akun admin dengan aman</div>

          <form className={styles.form} autoComplete="off" onSubmit={handleSubmit}>
            {/* Nama */}
            <div className={styles.formGroup}>
              <input
                className={styles.input}
                name="nama"
                type="text"
                placeholder="Nama Admin"
                value={fields.nama}
                onChange={handleChange}
              />
              {submitted && errors.nama && <div className={styles.errorMsg}>{errors.nama}</div>}
            </div>

            {/* Email */}
            <div className={styles.formGroup}>
              <input
                className={styles.input}
                name="email"
                type="email"
                placeholder="Email Admin"
                value={fields.email}
                onChange={handleChange}
              />
              {submitted && errors.email && <div className={styles.errorMsg}>{errors.email}</div>}
            </div>

            {/* Password */}
            <div className={styles.formGroup} style={{ position: 'relative' }}>
              <input
                className={styles.input}
                name="password"
                type={showPass ? 'text' : 'password'}
                placeholder="Kata Sandi"
                value={fields.password}
                onChange={handleChange}
              />
              <span className={styles.eyeIcon} onClick={() => setShowPass((x) => !x)} />
              {submitted && errors.password && <div className={styles.errorMsg}>{errors.password}</div>}
            </div>

            {/* Konfirmasi */}
            <div className={styles.formGroup} style={{ position: 'relative' }}>
              <input
                className={styles.input}
                name="konfirmasi"
                type={showConf ? 'text' : 'password'}
                placeholder="Konfirmasi Kata Sandi"
                value={fields.konfirmasi}
                onChange={handleChange}
              />
              <span className={styles.eyeIcon} onClick={() => setShowConf((x) => !x)} />
              {submitted && errors.konfirmasi && <div className={styles.errorMsg}>{errors.konfirmasi}</div>}
            </div>

            <button
              type="submit"
              className={styles.button}
              disabled={!bolehDaftar}
              style={{ opacity: bolehDaftar ? 1 : 0.5, cursor: bolehDaftar ? 'pointer' : 'not-allowed' }}
            >
              Daftar Admin
            </button>
          </form>

          <div className={styles.registerArea}>
            Sudah punya akun admin?
            <Link href="/Signin/hal-signAdmin" className={styles.registerLink}>
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
