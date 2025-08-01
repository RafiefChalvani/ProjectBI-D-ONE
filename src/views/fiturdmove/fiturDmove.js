import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './fiturDmove.module.css';
import { FaHome, FaClipboardList, FaHistory, FaCog, FaSignOutAlt, FaArrowLeft } from 'react-icons/fa';
import { addDays } from 'date-fns';
import idLocale from 'date-fns/locale/id';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const JENIS_KENDARAAN_OPTIONS = [
  "Mobil SUV", "Mobil MPV", "Truck", "Minibus", "Double Cabin", "Kaskeliling", "Edukator"
];

export default function FiturDmove() {
  // State form
  const [fields, setFields] = useState({
    jumlahDriver: '',
    jenisKendaraan: [],
    lokasi: 'Malang',
    jumlahOrang: '6 Orang',
    jumlahKendaraan: '1',
    volumeBarang: '5 Kg',
    noHp: '0812345678910',
    keterangan: 'Kebutuhan Dinas di Kota Malang',
    attachment: null,
    startDate: new Date(),
    endDate: addDays(new Date(), 2),
  });

  // Multi-select kendaraan
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Availability dropdown
  const [showAvailability, setShowAvailability] = useState(false);
  const availabilityRef = useRef();
  const availabilityData = [
    { jenis: 'Driver', jumlah: 10 },
    { jenis: 'Vehicles', jumlah: 20 }
  ];

  // Error & success state
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Click outside close dropdowns
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (availabilityRef.current && !availabilityRef.current.contains(e.target)) setShowAvailability(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle input change
  function handleChange(e) {
    const { name, value, files } = e.target;
    if (name === "attachment" && files && files[0]) {
      const file = files[0];
      if (
        !(file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"))
      ) {
        setErrors((prev) => ({
          ...prev,
          attachment: "Hanya file PDF yang diperbolehkan"
        }));
        setFields((prev) => ({ ...prev, attachment: null }));
        return;
      }
      setFields((prev) => ({ ...prev, [name]: file }));
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    } else {
      setFields({ ...fields, [name]: files ? files[0] : value });
      setErrors({ ...errors, [name]: undefined });
    }
  }

  function handleJenisKendaraanChange(option) {
    let baru;
    if (fields.jenisKendaraan.includes(option)) {
      baru = fields.jenisKendaraan.filter(item => item !== option);
    } else {
      baru = [...fields.jenisKendaraan, option];
    }
    setFields({ ...fields, jenisKendaraan: baru });
    setErrors({ ...errors, jenisKendaraan: undefined });
  }

  function handleDateChange(date, field) {
    setFields({ ...fields, [field]: date });
    setErrors({ ...errors, [field]: undefined });
  }

  // Validasi
  function validate() {
    const err = {};
    if (!fields.jumlahDriver || Number(fields.jumlahDriver) < 1) err.jumlahDriver = 'Isi jumlah driver yang diperlukan';
    if (!fields.jenisKendaraan.length) err.jenisKendaraan = 'Pilih minimal satu kendaraan';
    if (!fields.lokasi) err.lokasi = 'Isi lokasi atau tujuan';
    if (!fields.jumlahOrang) err.jumlahOrang = 'Isi jumlah orang';
    if (!fields.jumlahKendaraan) err.jumlahKendaraan = 'Isi jumlah kendaraan';
    if (!fields.volumeBarang) err.volumeBarang = 'Isi volume barang';
    if (!fields.startDate) err.startDate = 'Isi tanggal & jam mulai';
    if (!fields.endDate) err.endDate = 'Isi tanggal & jam selesai';
    if (fields.endDate && fields.startDate && fields.endDate < fields.startDate) err.endDate = 'End Date harus setelah Start Date';
    if (!fields.noHp) err.noHp = 'Isi nomor HP';
    if (!fields.keterangan) err.keterangan = 'Isi keterangan booking';
    if (!fields.attachment) err.attachment = 'Lampirkan file';
    return err;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length === 0) {
      setShowSuccess(true);
    }
  }

  function closeSuccess() {
    setShowSuccess(false);
    window.location.href = "/HalamanUtama/hal-utamauser";
  }

  return (
    <div className={styles.background}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.logoSidebar}>
          <Image src="/assets/BI_Logo.png" alt="Bank Indonesia" width={110} height={36} className={styles.logoDone} priority />
        </div>
        <nav className={styles.navMenu}>
          <ul>
            <li className={styles.active}><FaHome className={styles.menuIcon} /><Link href='/HalamanUtama/hal-utamauser'>Beranda</Link></li>
            <li><FaClipboardList className={styles.menuIcon} /><Link href='/StatusBooking/hal-statusBooking'>Status Booking</Link></li>
            <li><FaHistory className={styles.menuIcon} /><Link href='/HalamanUtama/hal-utamauser#'>Riwayat Pesanan</Link></li>
            <li><FaCog className={styles.menuIcon} /><Link href='/EditProfile/hal-editprofile'>Pengaturan</Link></li>
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
            <Image src="/assets/D'ONE.png" alt="D'ONE" width={170} height={34} className={styles.logoBI} priority />
          </div>
          <form className={styles.searchBar}>
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

        {/* D'MOVE FORM BOX */}
        <div className={styles.formBox}>
          <div className={styles.topRow}>
            <button className={styles.backBtn}><FaArrowLeft /> <Link href="/HalamanUtama/hal-utamauser" passHref legacyBehavior>Kembali</Link></button>
            <div className={styles.logoDmoveWrapper}>
              <Image src="/assets/D'MOVE.png" alt="D'MOVE" width={120} height={85} className={styles.logoDmove} priority />
            </div>
            {/* Availability */}
            <div className={styles.availabilitySection}>
              <div className={styles.availabilityLabel}>Availability</div>
              <div className={styles.availabilityDropdownWrap} ref={availabilityRef}>
                <button
                  type="button"
                  className={styles.availabilityDropdownBtn}
                  onClick={() => setShowAvailability(v => !v)}
                >
                  Lihat Ketersediaan
                  <span className={styles.availChevron}>▼</span>
                </button>
                {showAvailability && (
                  <div className={styles.availabilityDropdown}>
                    <table>
                      <thead>
                        <tr>
                          <th>Jenis</th>
                          <th>Jumlah</th>
                        </tr>
                      </thead>
                      <tbody>
                        {availabilityData.map(row => (
                          <tr key={row.jenis}>
                            <td>{row.jenis}</td>
                            <td>{row.jumlah}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          <form className={styles.formGrid} autoComplete="off" onSubmit={handleSubmit}>
            {/* JUMALAH DRIVER */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="jumlahDriver">Jumlah Driver</label>
                <input
                  id="jumlahDriver"
                  name="jumlahDriver"
                  type="number"
                  min={1}
                  value={fields.jumlahDriver}
                  onChange={handleChange}
                  className={errors.jumlahDriver ? styles.errorInput : ''}
                  placeholder="Masukkan jumlah driver"
                />
                {errors.jumlahDriver && <span className={styles.errorMsg}>{errors.jumlahDriver}</span>}
              </div>
            </div>

            {/* Jenis Kendaraan & Lokasi */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="jenisKendaraan">Jenis Kendaraan</label>
                <div className={`${styles.multiSelectBox} ${errors.jenisKendaraan ? styles.errorInput : ''}`}
                  ref={dropdownRef}
                  tabIndex={0}
                  onClick={() => setDropdownOpen(open => !open)}>
                  <span className={fields.jenisKendaraan.length ? styles.selectedText : styles.placeholder}>
                    {fields.jenisKendaraan.length
                      ? fields.jenisKendaraan.join(', ')
                      : 'Pilih Kendaraan'}
                  </span>
                  <span className={styles.chevron}>&#9662;</span>
                  {dropdownOpen && (
                    <div className={styles.multiSelectDropdown}>
                      {JENIS_KENDARAAN_OPTIONS.map(option => (
                        <label key={option} className={styles.multiSelectOption}>
                          <input
                            type="checkbox"
                            checked={fields.jenisKendaraan.includes(option)}
                            onChange={() => handleJenisKendaraanChange(option)}
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                {errors.jenisKendaraan && <span className={styles.errorMsg}>{errors.jenisKendaraan}</span>}
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="lokasi">Lokasi atau Tujuan</label>
                <input id="lokasi" name="lokasi" type="text" value={fields.lokasi} onChange={handleChange} className={errors.lokasi ? styles.errorInput : ''} />
                {errors.lokasi && <span className={styles.errorMsg}>{errors.lokasi}</span>}
              </div>
            </div>
            {/* Jumlah Orang, Jumlah Kendaraan, Volume Barang */}
            <div className={styles.formRow3}>
              <div className={styles.formGroup}>
                <label htmlFor="jumlahOrang">Jumlah Orang</label>
                <input id="jumlahOrang" name="jumlahOrang" type="text" value={fields.jumlahOrang} onChange={handleChange} className={errors.jumlahOrang ? styles.errorInput : ''} />
                {errors.jumlahOrang && <span className={styles.errorMsg}>{errors.jumlahOrang}</span>}
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="jumlahKendaraan">Jumlah Kendaraan</label>
                <input id="jumlahKendaraan" name="jumlahKendaraan" type="number" value={fields.jumlahKendaraan} onChange={handleChange} className={errors.jumlahKendaraan ? styles.errorInput : ''} />
                {errors.jumlahKendaraan && <span className={styles.errorMsg}>{errors.jumlahKendaraan}</span>}
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="volumeBarang">Volume Barang (Kg)</label>
                <input id="volumeBarang" name="volumeBarang" type="text" value={fields.volumeBarang} onChange={handleChange} className={errors.volumeBarang ? styles.errorInput : ''} />
                {errors.volumeBarang && <span className={styles.errorMsg}>{errors.volumeBarang}</span>}
              </div>
            </div>
            {/* Start Date & End Date */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="startDate">Start Date & Time</label>
                <DatePicker
                  id="startDate"
                  selected={fields.startDate}
                  onChange={(date) => handleDateChange(date, "startDate")}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="dd MMMM yyyy HH:mm"
                  timeCaption="Jam"
                  className={errors.startDate ? styles.errorInput : ''}
                  placeholderText="Pilih tanggal & jam mulai"
                  minDate={new Date()}
                  locale={idLocale}
                />
                {errors.startDate && <span className={styles.errorMsg}>{errors.startDate}</span>}
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="endDate">End Date & Time</label>
                <DatePicker
                  id="endDate"
                  selected={fields.endDate}
                  onChange={(date) => handleDateChange(date, "endDate")}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="dd MMMM yyyy HH:mm"
                  timeCaption="Jam"
                  className={errors.endDate ? styles.errorInput : ''}
                  placeholderText="Pilih tanggal & jam selesai"
                  minDate={fields.startDate}
                  locale={idLocale}
                />
                {errors.endDate && <span className={styles.errorMsg}>{errors.endDate}</span>}
              </div>
            </div>
            {/* No HP */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="noHp">No HP</label>
                <input id="noHp" name="noHp" type="text" value={fields.noHp} onChange={handleChange} className={errors.noHp ? styles.errorInput : ''} />
                {errors.noHp && <span className={styles.errorMsg}>{errors.noHp}</span>}
              </div>
            </div>
            {/* Keterangan & Attachments */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="keterangan">Keterangan Booking</label>
                <textarea id="keterangan" name="keterangan" rows={2} value={fields.keterangan} onChange={handleChange} className={errors.keterangan ? styles.errorInput : ''} />
                {errors.keterangan && <span className={styles.errorMsg}>{errors.keterangan}</span>}
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="attachment">Attachments</label>
                <div className={styles.inputFileWrapper}>
                  <input
                    id="attachment"
                    name="attachment"
                    type="file"
                    accept=".pdf,application/pdf"
                    className={`${styles.inputFile} ${errors.attachment ? styles.errorInput : ''}`}
                    onChange={handleChange}
                  />
                  <span className={styles.fileIcon}>📎</span>
                  {fields.attachment && !errors.attachment && (
                    <span style={{ marginLeft: 8, fontSize: 13, color: '#444' }}>
                      {fields.attachment.name}
                    </span>
                  )}
                </div>
                {errors.attachment && <span className={styles.errorMsg}>{errors.attachment}</span>}
              </div>
            </div>
            {/* Tombol Booking */}
            <div className={styles.buttonWrapper}>
              <button type="submit" className={styles.bookingBtn}>Booking</button>
            </div>
          </form>
        </div>
        {/* Modal Pop Up Booking Berhasil */}
        {showSuccess && (
          <div className={styles.popupOverlay}>
            <div className={styles.popupBox}>
              <button className={styles.popupClose} onClick={closeSuccess} title="Tutup">&times;</button>
              <div className={styles.popupIcon}>
                <svg width="70" height="70" viewBox="0 0 70 70">
                  <circle cx="35" cy="35" r="35" fill="#7EDC89" />
                  <polyline points="23,36 33,46 48,29" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className={styles.popupMsg}><b>Booking DMOVE Telah Berhasil!</b></div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
