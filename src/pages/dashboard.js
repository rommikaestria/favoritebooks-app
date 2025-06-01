import { useEffect, useState } from 'react';
import { getSession, signOut } from 'next-auth/react';
import BookForm from '../components/BookForm';
import BookList from '../components/BookList';

export default function Dashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBooks = async () => {
    try {
      const res = await fetch('/api/books', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin', // gunakan same-origin agar cookie NextAuth dikirim di Next.js
      });
      if (!res.ok) {
        setBooks([]);
        setError('Gagal mengambil data buku.');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setBooks(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setBooks([]);
      setError('Gagal mengambil data buku.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard Buku</h1>
        <button
          onClick={() => signOut()}
          className="text-sm text-red-600 hover:underline">
          Logout
        </button>
      </div>

      <BookForm onBookAdded={loadBooks} />
      <BookList books={books} onDelete={loadBooks} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
