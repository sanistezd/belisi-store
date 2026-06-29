import { NextResponse } from 'next/server';
import { serialize } from 'php-serialize';

const CRM_URL = "https://tallfill.lp-crm.biz/api/addNewOrder.html";
const CRM_KEY = "ecb590414709b5c41659ef2074148b31";
const TG_TOKEN = "8534737837:AAHHsXu05Ly6O2mbUFXCYl8wYpxOBgZpLwE";
const TG_CHAT_ID = "-1002659992192";

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
    formData.append('sender', encodeURIComponent(serialize({ HTTP_HOST: 'belisi.site' })));
    
    // Формуємо масив товарів, як в основних замовленнях, щоб CRM точно прийняла
    const products_list = [{
      product_id: "45",
      count: 1,
      price: 0
    }];
    formData.append('products', encodeURIComponent(serialize(products_list))); 

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
