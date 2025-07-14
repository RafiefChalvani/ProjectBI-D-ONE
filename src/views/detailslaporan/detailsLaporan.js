import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router'; // Tambah ini!
import styles from './detailsLaporan.module.css';
import { FaHome, FaClipboardList, FaCog, FaSignOutAlt, FaFilePdf, FaArrowLeft } from 'react-icons/fa';

export default function DetailsLaporan() {
  const router = useRouter();
  const { id } = router.query;

  // Data dummy seluruh booking (nanti bisa diambil dari backend/props)
  const dataLaporan = [
    {
      id: 1,
      title: "Booking D'MOVE | Malang",
      tglPengajuan: "8 Juli 2025 17:25:30",
      status: "Pending",
      nama: "Athalla Rayya Genaro",
      jenisKendaraan: "Mobil SUV dan Mobil MPV",
      jumlahOrang: "10 Orang",
      jumlahKendaraan: "2",
      tujuan: "Malang",
      keterangan: "Kebutuhan Dinas Ke Malang, 1 Mobil SUV dan 1 Mobil MPV",
      file: { name: "Bookdmove.pdf", url: "#" },
      durasi: "12 Hari | 1 Juli 2025 - 12 Juli 2025",
      volume: "5 Kg",
      noHp: "0812345678910"
    },
    {
      id: 2,
      title: "Booking D'MOVE | Malang",
      tglPengajuan: "9 Juli 2025 12:15:00",
      status: "Pending",
      nama: "Indra Aulia",
      jenisKendaraan: "Mobil SUV",
      jumlahOrang: "6 Orang",
      jumlahKendaraan: "1",
      tujuan: "Surabaya",
      keterangan: "Rapat Dinas ke Surabaya",
      file: { name: "Bookdmove2.pdf", url: "#" },
      durasi: "5 Hari | 2 Juli 2025 - 7 Juli 2025",
      volume: "2 Kg",
      noHp: "082145678910"
    },
    // ...tambahkan sesuai kebutuhan
  ];

  // Temukan detail berdasarkan id
  const detail = dataLaporan.find(item => item.id === Number(id)) || dataLaporan[0];

  return (
    <div className={styles.background}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.logoSidebar}>
          <Image
            src="/assets/BI_Logo.png"
            alt="Bank Indonesia"
            width={110}
            height={36}
            className={styles.logoDone}
            priority
          />
        </div>
        <nav className={styles.navMenu}>
          <ul>
            <li className={styles.active}><FaHome className={styles.menuIcon} /><Link href='/HalamanUtama/hal-utamaAdmin'>Beranda</Link></li>
            <li><FaClipboardList className={styles.menuIcon} /><Link href='/Persetujuan/hal-persetujuan'>Persetujuan Booking</Link></li>
            <li><FaCog className={styles.menuIcon} /><Link href='/Pengaturan/hal-pengaturan'>Pengaturan</Link></li>
          </ul>
        </nav>
        <div className={styles.logout}>
          <Link href="/Login/hal-login" passHref legacyBehavior>
            <FaSignOutAlt className={styles.logoutIcon} />
          </Link>
          Logout
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={styles.mainContent}>
        {/* HEADER NAVBAR */}
        <div className={styles.header}>
          <div className={styles.logoBIWrapper}>
            <Image
              src="/assets/D'ONE.png"
              alt="D'ONE"
              width={170}
              height={34}
              className={styles.logoBI}
              priority
            />
          </div>
          <form className={styles.searchBar} onSubmit={e => e.preventDefault()}>
            <input type="text" placeholder="Search" />
            <button type="submit">
              <svg width="20" height="20" fill="#2F4D8E">
                <circle cx="9" cy="9" r="8" stroke="#2F4D8E" strokeWidth="2" fill="none" />
                <line x1="15" y1="15" x2="19" y2="19" stroke="#2F4D8E" strokeWidth="2" />
              </svg>
            </button>
            <span className={styles.searchLabel}></span>
          </form>
        </div>

        <div className={styles.titleBox}>
          <button className={styles.backBtn}><FaArrowLeft /> <Link href="/HalamanUtama/hal-utamaAdmin" passHref legacyBehavior>Kembali</Link></button>
          <div className={styles.pageTitle}>DETAIL LAPORAN BOOKING</div>
        </div>

        <div className={styles.detailCard}>
          {/* Judul dan status */}
          <div className={styles.topRow}>
            <div className={styles.leftTitle}>
              <div className={styles.bookingTitle}>{detail.title}</div>
              <div className={styles.metaInfo}>
                <span className={styles.metaLabel}>TANGGAL PENGAJUAN</span>
                <span className={styles.metaValue}>{detail.tglPengajuan}</span>
                <span className={styles.statusPending}>
                  <span className={styles.dotPending} /> Pending
                </span>
              </div>
            </div>
          </div>

          {/* Isi detail */}
          <div className={styles.detailRow}>
            <div className={styles.detailColLeft}>
              <div className={styles.detailLabel}>NAMA</div>
              <div className={styles.detailValue}>{detail.nama}</div>
              <div className={styles.detailLabel}>JUMLAH ORANG</div>
              <div className={styles.detailValue}>{detail.jumlahOrang}</div>
              <div className={styles.detailLabel}>JUMLAH KENDARAAN</div>
              <div className={styles.detailValue}>{detail.jumlahKendaraan}</div>
              <div className={styles.detailLabel}>Tujuan</div>
              <div className={styles.detailValue}>{detail.tujuan}</div>
              <div className={styles.detailLabel}>KETERANGAN</div>
              <div className={styles.detailValue}>{detail.keterangan}</div>
              <div className={styles.detailLabel}>FILE UPLOAD</div>
              <div className={styles.fileBox}>
                <FaFilePdf className={styles.fileIcon} />
                <a href={detail.file.url} className={styles.fileName} download>
                  {detail.file.name}
                </a>
              </div>
            </div>
            <div className={styles.detailColRight}>
              <div className={styles.detailLabel}>JENIS KENDARAAN</div>
              <div className={styles.detailValue}>{detail.jenisKendaraan}</div>
              <div className={styles.detailLabel}>Durasi Pemesanan</div>
              <div className={styles.detailValue}>{detail.durasi}</div>
              <div className={styles.detailLabel}>Volume Barang</div>
              <div className={styles.detailValue}>{detail.volume}</div>
              <div className={styles.detailLabel}>No HP</div>
              <div className={styles.detailValue}>{detail.noHp}</div>
            </div>
          </div>

          {/* Button action */}
          <div className={styles.actionBtnRow}>
            <Link href="#" className={styles.btnSetujui}>Setujui</Link>
            <Link href="#" className={styles.btnTolak}>Tolak</Link>
          </div>
        </div>
      </main>
    </div>
  );
}