const SUPABASE_URL = 'YOUR_URL';
const SUPABASE_KEY = 'YOUR_KEY';

const supabaseClient = (window as any).supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

type Order = {
  id: string;
  customer_name: string;
  table_number: string;
  items: string[];
  total: number;
  status: string;
  order_time: string;
};

const colorMap: Record<string, string> = {
  pending: 'bg-warning',
  preparing: 'bg-accent',
  completed: 'bg-success'
};

async function fetchOrders() {
  const search = (document.getElementById('search') as HTMLInputElement).value.toLowerCase();
  const filter = (document.getElementById('filter') as HTMLSelectElement).value;

  let query = supabaseClient.from('orders').select('*');

  if (filter !== 'all') {
    query = query.eq('status', filter);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return;
  }

  const filtered = data.filter((o: Order) =>
    o.customer_name.toLowerCase().includes(search)
  );

  render(filtered);
}

function render(data: Order[]) {
  const grid = document.getElementById('grid')!;

  grid.innerHTML = data.map(o => `
    <div class="card">
      <h3>${o.customer_name}</h3>
      <p>${o.items.join(', ')}</p>
      <span>${o.status}</span>
    </div>
  `).join('');
}

function openModal() {
  const modal = document.getElementById('modal')!;
  modal.style.display = 'flex';
}

function closeModal() {
  const modal = document.getElementById('modal')!;
  modal.style.display = 'none';
}

// Events
document.getElementById('search')!.addEventListener('input', fetchOrders);
document.getElementById('filter')!.addEventListener('change', fetchOrders);

fetchOrders();