import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/orders.json');
    if (!fs.existsSync(filePath)) {
      return NextResponse.json([]);
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return NextResponse.json(JSON.parse(data || '[]'));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read orders' }, { status: 500 });
  }
}

// Allow updating order status (e.g. mark as completed)
export async function POST(request: Request) {
  try {
    const { id, status } = await request.json();
    const filePath = path.join(process.cwd(), 'src/data/orders.json');
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Orders not found' }, { status: 404 });
    }
    
    const data = fs.readFileSync(filePath, 'utf8');
    const orders = JSON.parse(data || '[]');
    
    const updatedOrders = orders.map((order: any) => 
      order.id === id ? { ...order, status } : order
    );
    
    fs.writeFileSync(filePath, JSON.stringify(updatedOrders, null, 2), 'utf8');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
