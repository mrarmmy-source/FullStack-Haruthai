const SUPABASE_URL = 'YOUR_URL';
const SUPABASE_KEY = 'YOUR_KEY';

const supabaseClient = (window as any).supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// จำลอง user login
const MY_NAME: string = 'Somchai Prasert';

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

async function fetchMyOrders() {
  const { data, error } = await supabaseClient
    .from('orders')
    .select('*')
    .eq('customer_name', MY_NAME)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  render(data);
}

function render(data: Order[]) {
  const grid = document.getElementById('grid')!;

  if (!data.length) {
    grid.innerHTML = `<p class="text-muted text-center py-10 col-span-3">You have no orders yet.</p>`;
    return;
  }

  grid.innerHTML = data.map(o => `
    <div class="bg-card/60 border border-border rounded-2xl p-5 card-hover">
      <div class="flex justify-between mb-2">
        <span>${o.order_time}</span>
        <span>${o.status}</span>
      </div>
      <p>${o.table_number}</p>
      <p>${o.items.join(', ')}</p>
      <span>฿${o.total.toLocaleString()}</span>
    </div>
  `).join('');
}

fetchMyOrders();