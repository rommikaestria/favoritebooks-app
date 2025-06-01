import { prisma } from '../../lib/prisma';
import { hash } from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email, password } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ message: 'Email sudah terdaftar.' });
  }

  const hashedPassword = await hash(password, 10);
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  res.status(201).json({ message: 'Akun berhasil dibuat.' });
}
