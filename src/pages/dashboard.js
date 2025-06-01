import { useEffect, useState } from 'react';
import { getSession, signOut } from 'next-auth/react';
import BookForm from '../components/BookForm';
import BookList from '../components/BookList';

export default function Dashboard() {
  const [books, setBooks] = useState([]);

  const loadBooks = async () => {
    const res = await fetch('/api/books');
    const data = await res.json();
    setBooks(data);
  };

  useEffect(() => {
    loadBooks();
  }, []);

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
