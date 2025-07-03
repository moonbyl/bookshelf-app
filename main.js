let books = [];

// Ambil elemen DOM yang diperlukan
const bookForm = document.getElementById('bookForm');
const incompleteBookshelfList = document.getElementById('incompleteBookList');
const completeBookshelfList = document.getElementById('completeBookList');
const searchForm = document.getElementById('searchBook');
const searchInput = document.getElementById('searchBookTitle');
const toggleButton = document.getElementById('darkModeToggle');

// Cek jika elemen penting tidak ditemukan
if (!bookForm || !incompleteBookshelfList || !completeBookshelfList || !searchForm || !searchInput) {
  console.error('❌ Ada elemen yang tidak ditemukan di HTML.');
}

// Saat halaman dimuat, ambil data buku dari localStorage
document.addEventListener('DOMContentLoaded', () => {
  const savedBooks = localStorage.getItem('books');
  if (savedBooks) books = JSON.parse(savedBooks);
  renderBooks();
});

// Simpan buku ke localStorage
function saveBooks() {
  localStorage.setItem('books', JSON.stringify(books));
}

// Render buku berdasarkan rak (lengkap/tidak lengkap) dan filter pencarian
function renderBooks(filter = '') {
  if (!incompleteBookshelfList || !completeBookshelfList) return;

  incompleteBookshelfList.innerHTML = '';
  completeBookshelfList.innerHTML = '';

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(filter.toLowerCase())
  );

  for (const book of filteredBooks) {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookshelfList.appendChild(bookElement);
    } else {
      incompleteBookshelfList.appendChild(bookElement);
    }
  }
}

// Buat elemen buku
function createBookElement(book) {
  const container = document.createElement('div');
  container.setAttribute('data-bookid', book.id);
  container.setAttribute('data-testid', 'bookItem');

  const title = document.createElement('h3');
  title.setAttribute('data-testid', 'bookItemTitle');
  title.textContent = book.title;

  const author = document.createElement('p');
  author.setAttribute('data-testid', 'bookItemAuthor');
  author.textContent = `Penulis: ${book.author}`;

  const year = document.createElement('p');
  year.setAttribute('data-testid', 'bookItemYear');
  year.textContent = `Tahun: ${book.year}`;

  const buttons = document.createElement('div');

  // Tombol ubah status
  const toggleButton = document.createElement('button');
  toggleButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
  toggleButton.textContent = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
  toggleButton.addEventListener('click', () => {
    book.isComplete = !book.isComplete;
    saveBooks();
    renderBooks(searchInput.value);
  });

  // Tombol hapus
  const deleteButton = document.createElement('button');
  deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
  deleteButton.textContent = 'Hapus Buku';
  deleteButton.addEventListener('click', () => {
    books = books.filter(b => b.id !== book.id);
    saveBooks();
    renderBooks(searchInput.value);
  });

  // Tombol edit
  const editButton = document.createElement('button');
  editButton.setAttribute('data-testid', 'bookItemEditButton');
  editButton.textContent = 'Edit Buku';
  editButton.addEventListener('click', () => {
    document.getElementById('bookFormTitle').value = book.title;
    document.getElementById('bookFormAuthor').value = book.author;
    document.getElementById('bookFormYear').value = book.year;
    document.getElementById('bookFormIsComplete').checked = book.isComplete;

    // Hapus dulu buku lama agar tidak dobel setelah edit
    books = books.filter(b => b.id !== book.id);
    saveBooks();
    renderBooks(searchInput.value);
  });

  // Gabungkan tombol
  buttons.appendChild(toggleButton);
  buttons.appendChild(deleteButton);
  buttons.appendChild(editButton);

  // Gabungkan semua elemen
  container.appendChild(title);
  container.appendChild(author);
  container.appendChild(year);
  container.appendChild(buttons);

  return container;
}

// Fitur Dark Mode Toggle
if (toggleButton) {
  toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    const isDark = document.body.classList.contains('dark-mode');
    toggleButton.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
  });
}

// Tambahkan buku baru
if (bookForm) {
  bookForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = parseInt(document.getElementById('bookFormYear').value);
    const isComplete = document.getElementById('bookFormIsComplete').checked;

    if (!title || !author || isNaN(year)) {
      alert('Mohon isi semua bidang dengan benar!');
      return;
    }

    const newBook = {
      id: +new Date(),
      title,
      author,
      year,
      isComplete
    };

    books.push(newBook);
    saveBooks();
    renderBooks(searchInput.value);
    bookForm.reset();
  });
}

// Fitur pencarian buku
if (searchForm) {
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    renderBooks(searchInput.value);
  });
}
