import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '../../../lib/prisma';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  const bookId = req.query.id;

  if (req.method === 'DELETE') {
    await prisma.book.delete({ where: { id: bookId } });
    return res.status(204).end();
  }

  res.status(405).end();
}
