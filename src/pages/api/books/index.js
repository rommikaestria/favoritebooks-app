import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '../../../lib/prisma';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  const userEmail = session.user.email;

  if (req.method === 'GET') {
    const books = await prisma.book.findMany({
      where: { user: { email: userEmail } },
    });
    return res.json(books);
  }

  if (req.method === 'POST') {
    const { title, author, year } = req.body;
    const user = await prisma.user.findUnique({ where: { email: userEmail } });

    const book = await prisma.book.create({
      data: {
        title,
        author,
        year: parseInt(year),
        userId: user.id,
      },
    });
    return res.status(201).json(book);
  }

  res.status(405).end();
}
