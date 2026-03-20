const SUPABASE_URL = 'YOUR_URL';
const SUPABASE_KEY = 'YOUR_KEY';

const supabaseClient = (window as any).supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

type Payment = {
  id: string;
  customer_name: string;
  amount: number;
  method: string;
  status: string;
};

async function loadPayments() {
  const { data, error } = await supabaseClient
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  // Stats
  const total = data.reduce((s: number, p: Payment) => s + Number(p.amount), 0);

  const completed = data
    .filter((p: Payment) => p.status === 'completed')
    .reduce((s: number, p: Payment) => s + Number(p.amount), 0);

  const pending = data
    .filter((p: Payment) => p.status === 'pending')
    .reduce((s: number, p: Payment) => s + Number(p.amount), 0);

  (document.getElementById('t1') as HTMLElement).innerText = `฿${total.toLocaleString()}`;
  (document.getElementById('t2') as HTMLElement).innerText = `฿${completed.toLocaleString()}`;
  (document.getElementById('t3') as HTMLElement).innerText = `฿${pending.toLocaleString()}`;
  (document.getElementById('t4') as HTMLElement).innerText = data.length.toString();

  // Table
  const table = document.getElementById('table')!;

  table.innerHTML = data.map((p: Payment) => `
    <tr>
      <td>${p.id.substring(0,8)}...</td>
      <td>${p.customer_name}</td>
      <td>฿${Number(p.amount).toLocaleString()}</td>
      <td>${p.method}</td>
      <td>${p.status}</td>
    </tr>
  `).join('');
}

loadPayments();