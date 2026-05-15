import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/products.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const products = await request.json();
    const filePath = path.join(process.cwd(), 'src/data/products.json');
    
    // Validate we got an array
    if (!Array.isArray(products)) {
      return NextResponse.json({ error: 'Expected an array of products' }, { status: 400 });
    }

    fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf8');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save products' }, { status: 500 });
  }
}
