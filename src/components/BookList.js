export default function BookList({ books, onDelete }) {
  const handleDelete = async (id) => {
    if (confirm('Hapus buku ini?')) {
      await fetch(`/api/books/${id}`, { method: 'DELETE' });
      onDelete();
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Daftar Buku Favorit</h2>
      {books.length === 0 ? (
        <p>Belum ada buku.</p>
      ) : (
        <ul className="space-y-2">
          {books.map((book) => (
            <li
              key={book.id}
              className="border p-4 rounded flex justify-between items-center">
              <div>
                <p className="font-semibold">{book.title}</p>
                <p className="text-sm text-gray-600">
                  {book.author} - {book.year}
                </p>
              </div>
              <button
                onClick={() => handleDelete(book.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                Hapus
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
