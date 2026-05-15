import { NextResponse } from 'next/server';
import { serialize } from 'php-serialize';
import { getDbData, setDbData } from '@/lib/db';

const CRM_URL = process.env.CRM_URL || "";
const CRM_KEY = process.env.CRM_KEY || "";
const TG_TOKEN = process.env.TG_TOKEN || "";
const TG_CHAT_ID = process.env.TG_CHAT_ID || "";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, city, address, deliveryMethod, comment: orderComment, items, totalPrice } = body;

    // 1. Формуємо масив товарів для LP-CRM
    const products_list: any[] = [];
    const final_strings: string[] = [];

    items.forEach((item: any, index: number) => {
      products_list.push({
        product_id: "45",
        count: item.quantity,
        price: item.product.price
      });
      
      const itemStr = `${item.product.name} x${item.quantity}`;
      final_strings.push(itemStr);
    });

    const isFullCheckout = !!city;
    const orderTypeLabel = isFullCheckout ? 'Повне замовлення' : 'Швидке замовлення';
    const crmComment = `${final_strings.join(', ')}\n(${orderTypeLabel} з React)\nКлієнт: ${orderComment || ''}`;

    // Формуємо FormData для CRM
    const formData = new URLSearchParams();
    formData.append('key', CRM_KEY);
    formData.append('order_id', Math.floor(Math.random() * 1000000).toString());
    formData.append('country', 'UA');
    formData.append('office', '1');
    formData.append('products', serialize(products_list));
    formData.append('bayer_name', name);
    formData.append('phone', phone);
    if (email) formData.append('email', email);
    if (city && address) formData.append('delivery_adress', `${city}, ${address}`);
    const dmMap: any = { np_branch: 'Нова Пошта (Відділення)', np_locker: 'Нова Пошта (Поштомат)', ukrpost: 'Укрпошта' };
    const translatedDeliveryMethod = deliveryMethod ? (dmMap[deliveryMethod] || deliveryMethod) : 'Не вказано';

    if (deliveryMethod) {
      formData.append('delivery', translatedDeliveryMethod);
    }
    formData.append('comment', crmComment);

    // Відправка в CRM
    try {
      const crmUrlHttps = CRM_URL.replace('http://', 'https://'); // LP-CRM may drop POST body on HTTP -> HTTPS redirect
      const crmResponse = await fetch(crmUrlHttps, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const crmText = await crmResponse.text();
      console.log('CRM Response:', crmText);
    } catch (crmErr) {
      console.error('CRM Fetch Error:', crmErr);
    }

    // 2. Відправка в Telegram
    let tgText = `<b>🛒 ${isFullCheckout ? 'НОВЕ ЗАМОВЛЕННЯ' : 'ШВИДКЕ ЗАМОВЛЕННЯ'} (React)</b>\n` +
      `💁🏻‍♂️ <b>Ім'я:</b> ${name}\n` +
      `📱 <b>Телефон:</b> ${phone}\n`;
      
    if (email) tgText += `📧 <b>Email:</b> ${email}\n`;
    if (deliveryMethod) tgText += `🚚 <b>Доставка:</b> ${translatedDeliveryMethod}\n`;
    if (city || address) tgText += `📍 <b>Адреса:</b> ${city || ''}, ${address || ''}\n`;
    
    tgText += `💰 <b>Сума:</b> ${totalPrice} грн\n` +
      `📦 <b>Товари:</b>\n${final_strings.join('\n')}`;
      
    if (orderComment) tgText += `\n💬 <b>Коментар:</b> ${orderComment}`;

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

    // 3. Збереження в базу (Redis / JSON fallback) для відображення в адмінці
    try {
      const localOrders = await getDbData('orders', 'orders.json');
      
      const newOrder = {
        id: Math.random().toString(36).substring(2, 9),
        date: new Date().toISOString(),
        customer: { name, phone, email },
        delivery: { method: translatedDeliveryMethod, city, address },
        items: final_strings,
        total: totalPrice,
        status: 'new'
      };
      
      localOrders.unshift(newOrder); // Add to top
      await setDbData('orders', localOrders, 'orders.json');
    } catch (dbError) {
      console.error('Failed to save order to db:', dbError);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error processing order:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
