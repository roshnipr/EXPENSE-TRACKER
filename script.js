const expenseForm = document.getElementById('expense-form');
const expenseTable = document.querySelector('#expense-table tbody');
const categoryFilter = document.getElementById('filter-category');
const monthlyTotal = document.getElementById('monthly-total');
const yearlyTotal = document.getElementById('yearly-total');
const themeToggle = document.getElementById('theme-toggle');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

const saveExpenses = () => {
  localStorage.setItem('expenses', JSON.stringify(expenses));
};

const renderExpenses = () => {
  expenseTable.innerHTML = '';
  const filtered = categoryFilter.value === 'All'
    ? expenses
    : expenses.filter(e => e.category === categoryFilter.value);

  filtered.forEach((exp, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${exp.date}</td>
      <td>${exp.amount}</td>
      <td>${exp.category}</td>
      <td>${exp.description}</td>
      <td><button onclick="deleteExpense(${index})">Delete</button></td>
    `;
    expenseTable.appendChild(tr);
  });
  updateSummary();
};

window.deleteExpense = (index) => {
  expenses.splice(index, 1);
  saveExpenses();
  renderExpenses();
};

expenseForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const date = document.getElementById('date').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  const description = document.getElementById('description').value;

  expenses.push({ date, amount, category, description });
  saveExpenses();
  expenseForm.reset();
  renderExpenses();
});

categoryFilter.addEventListener('change', renderExpenses);

const updateSummary = () => {
  const now = new Date();
  const month = now.getMonth(), year = now.getFullYear();

  const thisMonth = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });
  const thisYear = expenses.filter(e => new Date(e.date).getFullYear() === year);

  const monthTotal = thisMonth.reduce((sum, e) => sum + e.amount, 0);
  const yearTotal = thisYear.reduce((sum, e) => sum + e.amount, 0);

  monthlyTotal.textContent = monthTotal.toFixed(2);
  yearlyTotal.textContent = yearTotal.toFixed(2);
};

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const mode = document.body.classList.contains('dark') ? 'dark' : 'light';
  localStorage.setItem('theme', mode);
});

const loadTheme = () => {
  const theme = localStorage.getItem('theme') || 'light';
  if (theme === 'dark') {
    document.body.classList.add('dark');
  }
};

loadTheme();
renderExpenses();
