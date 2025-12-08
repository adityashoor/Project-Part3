const API_URL = 'http://localhost:5000/api';
let currentUser = null;
let allBooks = [];
let userBorrowRecords = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  loadBooks();
});

// Check authentication
function checkAuth() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (token && user) {
    currentUser = JSON.parse(user);
    updateUserUI();
    showAuthenticatedNav();
    navigateTo('dashboard');
  } else {
    showAuthNav();
    navigateTo('login');
  }
}

// Update user UI
function updateUserUI() {
  const userName = document.getElementById('userName');
  const memberIdDisplay = document.getElementById('memberIdDisplay');
  if (userName && currentUser) {
    userName.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    memberIdDisplay.textContent = currentUser.memberId || '-';
  }
}

// Show authenticated navigation
function showAuthenticatedNav() {
  const sidebar = document.querySelector('.sidebar');
  if (currentUser && currentUser.role === 'librarian' || currentUser.role === 'admin') {
    document.getElementById('addBookNav').style.display = 'block';
  }
}

// Show auth navigation
function showAuthNav() {
  document.getElementById('addBookNav').style.display = 'none';
}

// Toggle authentication sections
function toggleAuth() {
  document.getElementById('loginSection').classList.toggle('active');
  document.getElementById('registerSection').classList.toggle('active');
}

// Handle login
async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      currentUser = data.user;
      showToast('Login successful!', 'success');
      updateUserUI();
      showAuthenticatedNav();
      navigateTo('dashboard');
      loadDashboard();
    } else {
      showToast(data.message || 'Login failed', 'error');
    }
  } catch (error) {
    showToast('Connection error', 'error');
    console.error('Login error:', error);
  }
}

// Handle registration
async function handleRegister(event) {
  event.preventDefault();

  const firstName = document.getElementById('regFirstName').value;
  const lastName = document.getElementById('regLastName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const phone = document.getElementById('regPhone').value;

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password, phone })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      currentUser = data.user;
      showToast('Registration successful!', 'success');
      updateUserUI();
      showAuthenticatedNav();
      navigateTo('dashboard');
      loadDashboard();
    } else {
      showToast(data.message || 'Registration failed', 'error');
    }
  } catch (error) {
    showToast('Connection error', 'error');
    console.error('Registration error:', error);
  }
}

// Load books
async function loadBooks() {
  try {
    const response = await fetch(`${API_URL}/books`);
    const data = await response.json();

    if (data.success) {
      allBooks = data.data;
      displayBooks(allBooks);
    }
  } catch (error) {
    console.error('Error loading books:', error);
  }
}

// Display books
function displayBooks(books) {
  const booksList = document.getElementById('booksList');

  if (books.length === 0) {
    booksList.innerHTML = '<p class="no-data">No books found</p>';
    return;
  }

  booksList.innerHTML = books.map(book => `
    <div class="book-card" onclick="viewBookDetails('${book._id}')">
      <div class="book-cover">📖</div>
      <div class="book-info">
        <h3>${book.title}</h3>
        <p class="book-author">by ${book.author}</p>
        <span class="book-category">${book.category}</span>
        <p class="book-copies">Available: ${book.availableCopies}/${book.totalCopies}</p>
        <div class="book-actions">
          ${book.availableCopies > 0 ? 
            `<button class="btn btn-primary btn-small" onclick="borrowBookModal('${book._id}')" style="flex: 1;">Borrow</button>` : 
            '<button class="btn btn-secondary btn-small" disabled>Not Available</button>'
          }
          <button class="btn btn-secondary btn-small" onclick="viewBookDetails('${book._id}')">Details</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Search books
function searchBooks() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const filtered = allBooks.filter(book =>
    book.title.toLowerCase().includes(query) ||
    book.author.toLowerCase().includes(query) ||
    book.isbn.toLowerCase().includes(query)
  );
  displayBooks(filtered);
}

// Filter books
function filterBooks() {
  const category = document.getElementById('categoryFilter').value;
  const filtered = category ? allBooks.filter(book => book.category === category) : allBooks;
  displayBooks(filtered);
}

// View book details
function viewBookDetails(bookId) {
  const book = allBooks.find(b => b._id === bookId);
  if (book) {
    const modal = document.getElementById('bookModal');
    const modalBody = document.getElementById('bookModalBody');
    modalBody.innerHTML = `
      <h2>${book.title}</h2>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>ISBN:</strong> ${book.isbn}</p>
      <p><strong>Publisher:</strong> ${book.publisher}</p>
      <p><strong>Category:</strong> ${book.category}</p>
      <p><strong>Pages:</strong> ${book.pages || 'N/A'}</p>
      <p><strong>Language:</strong> ${book.language}</p>
      <p><strong>Available Copies:</strong> ${book.availableCopies}/${book.totalCopies}</p>
      <p><strong>Description:</strong> ${book.description}</p>
      ${book.availableCopies > 0 ? 
        `<button class="btn btn-primary" onclick="borrowBookModal('${book._id}')">Borrow This Book</button>` : 
        '<p style="color: var(--danger-color);">This book is currently unavailable</p>'
      }
    `;
    modal.classList.add('show');
  }
}

// Borrow book modal
function borrowBookModal(bookId) {
  closeBookModal();
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);
  const dueDateString = dueDate.toISOString().split('T')[0];

  const modal = document.getElementById('bookModal');
  const modalBody = document.getElementById('bookModalBody');
  modalBody.innerHTML = `
    <h2>Borrow Book</h2>
    <form onsubmit="confirmBorrow(event, '${bookId}')">
      <div class="form-group">
        <label for="borrowDueDate">Due Date</label>
        <input type="date" id="borrowDueDate" value="${dueDateString}" required>
      </div>
      <button type="submit" class="btn btn-primary">Confirm Borrow</button>
    </form>
  `;
  modal.classList.add('show');
}

// Confirm borrow
async function confirmBorrow(event, bookId) {
  event.preventDefault();
  const dueDate = document.getElementById('borrowDueDate').value;
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${API_URL}/borrow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ bookId, dueDate })
    });

    const data = await response.json();

    if (response.ok) {
      showToast('Book borrowed successfully!', 'success');
      closeBookModal();
      loadBooks();
      loadUserBorrowRecords();
    } else {
      showToast(data.message || 'Failed to borrow book', 'error');
    }
  } catch (error) {
    showToast('Connection error', 'error');
    console.error('Borrow error:', error);
  }
}

// Close book modal
function closeBookModal() {
  document.getElementById('bookModal').classList.remove('show');
}

// Load dashboard
async function loadDashboard() {
  await loadUserBorrowRecords();
  updateDashboardStats();
}

// Load user borrow records
async function loadUserBorrowRecords() {
  if (!currentUser) return;

  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}/borrow/user/${currentUser.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();
    if (data.success) {
      userBorrowRecords = data.data;
      updateDashboardStats();
      displayMyBooks();
    }
  } catch (error) {
    console.error('Error loading borrow records:', error);
  }
}

// Update dashboard stats
function updateDashboardStats() {
  const totalBooksCount = document.getElementById('totalBooksCount');
  const activeBorrowCount = document.getElementById('activeBorrowCount');

  if (totalBooksCount) {
    totalBooksCount.textContent = allBooks.length;
  }
  if (activeBorrowCount) {
    activeBorrowCount.textContent = userBorrowRecords.filter(r => r.status === 'active').length;
  }

  displayRecentActivity();
}

// Display recent activity
function displayRecentActivity() {
  const recentActivityList = document.getElementById('recentActivityList');
  if (!recentActivityList) return;

  const recent = userBorrowRecords.slice(0, 5);
  if (recent.length === 0) {
    recentActivityList.innerHTML = '<p class="no-data">No recent activity</p>';
    return;
  }

  recentActivityList.innerHTML = recent.map(record => {
    const bookTitle = record.bookId?.title || 'Unknown Book';
    const status = record.status === 'active' ? '📖 Borrowed' : '✅ Returned';
    return `<div class="activity-item">${status} ${bookTitle}</div>`;
  }).join('');
}

// Display my books
function displayMyBooks() {
  const myBooksList = document.getElementById('myBooksList');
  if (!myBooksList) return;

  const active = userBorrowRecords.filter(r => r.status === 'active');

  if (active.length === 0) {
    myBooksList.innerHTML = '<p class="no-data">No books borrowed</p>';
    return;
  }

  myBooksList.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Book Title</th>
          <th>Due Date</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${active.map(record => `
          <tr>
            <td>${record.bookId?.title || 'Unknown'}</td>
            <td>${new Date(record.dueDate).toLocaleDateString()}</td>
            <td><span class="status-badge status-${record.status}">${record.status.toUpperCase()}</span></td>
            <td>
              <button class="btn btn-success btn-small" onclick="returnBook('${record._id}')">Return</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// Filter borrowed books
function filterBorrowedBooks(status) {
  const myBooksList = document.getElementById('myBooksList');
  if (!myBooksList) return;

  const filtered = userBorrowRecords.filter(r => r.status === status);

  if (filtered.length === 0) {
    myBooksList.innerHTML = `<p class="no-data">No ${status} books</p>`;
    return;
  }

  myBooksList.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Book Title</th>
          <th>${status === 'active' ? 'Due Date' : 'Return Date'}</th>
          <th>Status</th>
          ${status === 'active' ? '<th>Action</th>' : ''}
        </tr>
      </thead>
      <tbody>
        ${filtered.map(record => `
          <tr>
            <td>${record.bookId?.title || 'Unknown'}</td>
            <td>${new Date(status === 'active' ? record.dueDate : record.returnDate).toLocaleDateString()}</td>
            <td><span class="status-badge status-${record.status}">${record.status.toUpperCase()}</span></td>
            ${status === 'active' ? `<td><button class="btn btn-success btn-small" onclick="returnBook('${record._id}')">Return</button></td>` : ''}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent.toLowerCase() === status) {
      btn.classList.add('active');
    }
  });
}

// Return book
async function returnBook(borrowId) {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${API_URL}/borrow/${borrowId}/return`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();

    if (response.ok) {
      showToast('Book returned successfully!', 'success');
      loadBooks();
      loadUserBorrowRecords();
    } else {
      showToast(data.message || 'Failed to return book', 'error');
    }
  } catch (error) {
    showToast('Connection error', 'error');
    console.error('Return error:', error);
  }
}

// Handle add book (for librarians)
async function handleAddBook(event) {
  event.preventDefault();
  const token = localStorage.getItem('token');

  const bookData = {
    title: document.getElementById('bookTitle').value,
    author: document.getElementById('bookAuthor').value,
    isbn: document.getElementById('bookISBN').value,
    publisher: document.getElementById('bookPublisher').value,
    category: document.getElementById('bookCategory').value,
    totalCopies: parseInt(document.getElementById('bookCopies').value),
    pages: parseInt(document.getElementById('bookPages').value) || null,
    language: document.getElementById('bookLanguage').value,
    description: document.getElementById('bookDescription').value,
    publicationDate: new Date().toISOString().split('T')[0]
  };

  try {
    const response = await fetch(`${API_URL}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookData)
    });

    const data = await response.json();

    if (response.ok) {
      showToast('Book added successfully!', 'success');
      event.target.reset();
      loadBooks();
    } else {
      showToast(data.message || 'Failed to add book', 'error');
    }
  } catch (error) {
    showToast('Connection error', 'error');
    console.error('Add book error:', error);
  }
}

// Handle update profile
async function handleUpdateProfile(event) {
  event.preventDefault();
  const token = localStorage.getItem('token');

  const profileData = {
    firstName: document.getElementById('profileFirstName').value,
    lastName: document.getElementById('profileLastName').value,
    phone: document.getElementById('profilePhone').value,
    address: {
      city: document.getElementById('profileCity').value,
      country: document.getElementById('profileCountry').value
    }
  };

  try {
    const response = await fetch(`${API_URL}/auth/users/${currentUser.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });

    const data = await response.json();

    if (response.ok) {
      showToast('Profile updated successfully!', 'success');
    } else {
      showToast(data.message || 'Failed to update profile', 'error');
    }
  } catch (error) {
    showToast('Connection error', 'error');
    console.error('Update profile error:', error);
  }
}

// Navigate to page
function navigateTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pageElement = document.getElementById(page);
  if (pageElement) {
    pageElement.classList.add('active');

    if (page === 'dashboard') {
      loadDashboard();
    } else if (page === 'books') {
      loadBooks();
    } else if (page === 'myBooks') {
      loadUserBorrowRecords();
    } else if (page === 'profile') {
      loadProfileData();
    }
  }

  // Close sidebar on mobile
  const sidebar = document.querySelector('.sidebar');
  if (sidebar.classList.contains('active')) {
    sidebar.classList.remove('active');
  }
}

// Load profile data
function loadProfileData() {
  if (currentUser) {
    document.getElementById('profileFirstName').value = currentUser.firstName || '';
    document.getElementById('profileLastName').value = currentUser.lastName || '';
    document.getElementById('profileEmail').value = currentUser.email || '';
    document.getElementById('profilePhone').value = currentUser.phone || '';
  }
}

// Toggle sidebar
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('active');
}

// Logout
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    currentUser = null;
    showAuthNav();
    navigateTo('login');
    showToast('Logged out successfully!', 'success');
  }
}

// Show toast notification
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Close toast when clicked
document.addEventListener('click', (e) => {
  if (e.target.id === 'bookModal') {
    closeBookModal();
  }
});
