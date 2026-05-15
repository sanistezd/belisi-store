import { NextResponse } from 'next/server';
import { serialize } from 'php-serialize';

const CRM_URL = process.env.CRM_URL || "";
const CRM_KEY = process.env.CRM_KEY || "";
const TG_TOKEN = process.env.TG_TOKEN || "";
const TG_CHAT_ID = process.env.TG_CHAT_ID || "";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, question } = body;

    // 1. Send to LP-CRM as a lead
    const formData = new URLSearchParams();
    formData.append('key', CRM_KEY);
    formData.append('order_id', 'Q' + Math.floor(Math.random() * 1000000).toString());
    formData.append('country', 'UA');
    formData.append('office', '1');
    formData.append('bayer_name', name);
    formData.append('phone', phone);
    formData.append('comment', `ЗАПИТАННЯ З САЙТУ:\n${question}`);
    
    // Some CRMs require products array, we send dummy product ID 45 with 0 price/count just in case
    const dummyProduct = { "1": { product_id: "45", count: 0, price: 0 } };
    formData.append('products', encodeURIComponent(serialize(dummyProduct))); 

    await fetch(CRM_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // 2. Send to Telegram
    const tgText = `<b>📞 НОВЕ ПИТАННЯ (React)</b>\n` +
      `💁🏻‍♂️ <b>Ім'я:</b> ${name}\n` +
      `📱 <b>Телефон:</b> ${phone}\n` +
      `❓ <b>Питання:</b>\n${question}`;

    const tgUrl = `https://api.telegram.org/bot${TG_TOKEN}/sendMessage`;
    await fetch(tgUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TG_CHAT_ID,
        text: tgText,
        parse_mode: 'HTML'
      })
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
