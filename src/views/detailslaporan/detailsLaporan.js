import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './detailsLaporan.module.css';
import { FaHome, FaClipboardList, FaCog, FaSignOutAlt, FaFilePdf, FaArrowLeft, FaUsers } from 'react-icons/fa';
import SidebarAdmin from '@/components/SidebarAdmin/SidebarAdmin';
import LogoutPopup from '@/components/LogoutPopup/LogoutPopup';

// --- Helper Functions ---
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
};
const formatDuration = (start, end) => {
    if (!start || !end) return 'N/A';
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} Hari | ${startDate.toLocaleDateString('id-ID')} - ${endDate.toLocaleDateString('id-ID')}`;
};

// --- Konfigurasi Status ---
const STATUS_CONFIG = {
    '1': { text: 'Pending', className: styles.statusPending, dot: styles.dotPending },
    '2': { text: 'Approved', className: styles.statusApproved, dot: styles.dotApproved },
    '3': { text: 'Rejected', className: styles.statusRejected, dot: styles.dotRejected },
};


export default function DetailsLaporan() {
    const handleLogout = () => {
      localStorage.removeItem('admin');
      router.push('/Login/hal-login');
  };
    const router = useRouter();
    const { id } = router.query;

    // --- State Management ---
    const [booking, setBooking] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Fetch data booking spesifik saat komponen dimuat atau ID berubah
    useEffect(() => {
        if (!id) return; // Jangan fetch jika ID belum ada

        const fetchBookingDetail = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/bookings-with-vehicle?bookingId=${id}`);
                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.error || `Gagal memuat data booking.`);
                }
                const data = await res.json();
                setBooking(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookingDetail();
    }, [id]);

    // Fungsi untuk approve/reject
    const handleUpdateStatus = async (newStatusId) => {
        setIsUpdating(true);
        try {
            const res = await fetch('/api/booking', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingId: id, newStatusId: newStatusId }),
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Gagal mengubah status.");
            }
            setShowSuccess(true);
            router.push('/Persetujuan/hal-persetujuan'); // Arahkan kembali ke halaman list
        } catch (err) {
            alert(`Error: ${err.message}`);
        } finally {
            setIsUpdating(false);
        }
    };

    // Tampilan saat loading atau error
    if (isLoading) return <div className={styles.loadingState}>Memuat detail laporan...</div>;
    if (error) return <div className={styles.errorState}>Error: {error}</div>;
    if (!booking) return <div className={styles.loadingState}>Data booking tidak ditemukan.</div>;
    
    const statusInfo = STATUS_CONFIG[booking.status_id] || STATUS_CONFIG['1'];

    return (
        <div className={styles.background}>
            {/* SIDEBAR (tetap sama) */}
            <SidebarAdmin onLogoutClick={() => setShowLogoutPopup(true)} />

            {showSuccess && (
              <div className={styles.popupOverlay}>
                <div className={styles.popupBox}>
                  <div className={styles.popupIcon}>
                    <svg width="70" height="70" viewBox="0 0 70 70">
                      <circle cx="35" cy="35" r="35" fill="#7EDC89" />
                      <polyline points="23,36 33,46 48,29" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className={styles.popupMsg}><b>Berhasil Mengubah Status</b></div>
                </div>
              </div>
            )}

            {/* MAIN CONTENT */}
            <main className={styles.mainContent}>
                {/* HEADER (tetap sama) */}
                <div className={styles.header}>
                    {/* ... kode header ... */}
                </div>

                <div className={styles.titleBox}>
                    <button className={styles.backBtn} onClick={() => router.back()}>
                        <FaArrowLeft style={{ marginRight: 7, fontSize: 18 }} /> Kembali
                    </button>
                    <div className={styles.title}>DETAIL LAPORAN BOOKING</div>
                </div>

                <div className={styles.detailCard}>
                    <div className={styles.topRow}>
                        <div className={styles.leftTitle}>
                            <div className={styles.bookingTitle}>{`Booking D'MOVE | ${booking.tujuan}`}</div>
                            <div className={styles.metaInfo}>
                                <span className={styles.metaLabel}>TANGGAL PENGAJUAN</span>
                                <span className={styles.metaValue}>{formatDate(booking.created_at)}</span>
                                <span className={statusInfo.className}>
                                    <span className={statusInfo.dot} /> {statusInfo.text}
                                </span>
                            </div>
                        </div>
                        {/* VIEW AVAILABILITY bisa diintegrasikan dengan API lain jika ada */}
                    </div>

                    <div className={styles.detailRow}>
                        <div className={styles.detailColLeft}>
                            <div className={styles.detailLabel}>NAMA PENGAJU</div>
                            <div className={styles.detailValue}>{booking.user_name}</div>
                            <div className={styles.detailLabel}>TUJUAN</div>
                            <div className={styles.detailValue}>{booking.tujuan}</div>
                            <div className={styles.detailLabel}>KETERANGAN</div>
                            <div className={styles.detailValue}>{booking.keterangan || '-'}</div>
                            {booking.file_link && (
                                <>
                                <div className={styles.detailLabel}>FILE LAMPIRAN</div>
                                <div className={styles.fileBox}>
                                    <FaFilePdf className={styles.fileIcon} />
                                    <a href={booking.file_link} target="_blank" rel="noopener noreferrer" className={styles.fileName}>
                                        Lihat Lampiran
                                    </a>
                                </div>
                                </>
                            )}
                        </div>
                        <div className={styles.detailColRight}>
                            <div className={styles.detailLabel}>JENIS KENDARAAN</div>
                            <div className={styles.detailValue}>{booking.vehicle_types.map(v => v.name).join(', ') || '-'}</div>
                            <div className={styles.detailLabel}>DURASI PEMESANAN</div>
                            <div className={styles.detailValue}>{formatDuration(booking.start_date, booking.end_date)}</div>
                            <div className={styles.detailLabel}>JUMLAH ORANG</div>
                            <div className={styles.detailValue}>{booking.jumlah_orang || 'N/A'}</div>
                            <div className={styles.detailLabel}>JUMLAH KENDARAAN</div>
                            <div className={styles.detailValue}>

                            {booking.vehicle_types && booking.vehicle_types.length > 0 ? (
                            <div>
                                {booking.vehicle_types.map((v, index) => (
                                <div key={index}>
                                    {v.name}: {v.quantity}
                                </div>
                                ))}
                            </div>
                            ) : (
                            'N/A'
                            )}

                            </div>
                            <div className={styles.detailLabel}>VOLUME BARANG</div>
                            <div className={styles.detailValue}>{booking.volume_kg ? `${booking.volume_kg} Kg` : 'N/A'}</div>
                             <div className={styles.detailLabel}>No HP</div>
                             <div className={styles.detailValue}>{booking.phone}</div>
                        </div>
                    </div>

                    {/* Tombol hanya tampil jika status masih 'Pending' */}
                    {booking.status_id === 1 && (
                        <div className={styles.actionBtnRow}>
                            <button className={styles.btnTolak} onClick={() => handleUpdateStatus(3)} disabled={isUpdating}>
                                {isUpdating ? 'Memproses...' : 'Tolak'}
                            </button>
                            <button className={styles.btnSetujui} onClick={() => handleUpdateStatus(2)} disabled={isUpdating}>
                                {isUpdating ? 'Memproses...' : 'Setujui'}
                            </button>
                        </div>
                    )}
                </div>
            </main>
            <LogoutPopup
                open={showLogoutPopup}
                onCancel={() => setShowLogoutPopup(false)}
                onLogout={handleLogout}
            />
        </div>
    );
}