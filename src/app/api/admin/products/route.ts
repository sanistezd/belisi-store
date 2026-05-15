import { NextResponse } from 'next/server';
import { getDbData, setDbData } from '@/lib/db';

export async function GET() {
  try {
    const products = await getDbData('products', 'products.json');
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const products = await request.json();
    
    // Validate we got an array
    if (!Array.isArray(products)) {
      return NextResponse.json({ error: 'Expected an array of products' }, { status: 400 });
    }

    await setDbData('products', products, 'products.json');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save products' }, { status: 500 });
  }
}
