const SUPABASE_URL = 'YOUR_URL';
const SUPABASE_KEY = 'YOUR_KEY';

const supabaseClient = (window as any).supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// จำลอง user login
const MY_NAME: string = 'Somchai Prasert';

type Payment = {
  id: string;
  amount: number;
  method: string;
  status: string;
};

async function loadPayments() {
  const { data, error } = await supabaseClient
    .from('payments')
    .select('*')
    .eq('customer_name', MY_NAME)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const table = document.getElementById('table')!;

  if (!data.length) {
    table.innerHTML = `
      <tr>
        <td colspan="4" class="text-center py-10 text-muted">
          No payment history
        </td>
      </tr>
    `;
    return;
  }

  table.innerHTML = data.map((p: Payment) => `
    <tr>
      <td>${p.id.substring(0,8)}...</td>
      <td>฿${Number(p.amount).toLocaleString()}</td>
      <td>${p.method}</td>
      <td>${p.status}</td>
    </tr>
  `).join('');
}

loadPayments();