// pages/api/register.js
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { nama, nim, hp, email, password } = req.body;

  if (!nama || !nim || !hp || !email || !password) {
    return res.status(400).json({ error: 'Semua field wajib diisi' });
  }

  try {
    // Cek apakah email sudah terdaftar
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email sudah terdaftar' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke database
    await db.query(
      `INSERT INTO users (name, email, phone, nip, password) VALUES (?, ?, ?, ?, ?)`,
      [nama, email, hp, nim, hashedPassword]
    );

    return res.status(201).json({ message: 'Registrasi berhasil' });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Terjadi kesalahan di server' });
  }
}
