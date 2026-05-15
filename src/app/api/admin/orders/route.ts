import { NextResponse } from 'next/server';
import { getDbData, setDbData } from '@/lib/db';

export async function GET() {
  try {
    const orders = await getDbData('orders', 'orders.json');
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read orders' }, { status: 500 });
  }
}

// Allow updating order status (e.g. mark as completed)
export async function POST(request: Request) {
  try {
    const { id, status } = await request.json();
    
    const orders = await getDbData('orders', 'orders.json');
    
    const updatedOrders = orders.map((order: any) => 
      order.id === id ? { ...order, status } : order
    );
    
    await setDbData('orders', updatedOrders, 'orders.json');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
