import { NextResponse } from 'next/server';
import { serialize } from 'php-serialize';
import { getDbData, setDbData } from '@/lib/db';

const CRM_URL = "https://tallfill.lp-crm.biz/api/addNewOrder.html";
const CRM_KEY = "ecb590414709b5c41659ef2074148b31";
const TG_TOKEN = "8534737837:AAHHsXu05Ly6O2mbUFXCYl8wYpxOBgZpLwE";
const TG_CHAT_ID = "-1002659992192";

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
    const crmComment = orderComment 
      ? `${final_strings.join('\n')}\nКоментар: ${orderComment}`
      : final_strings.join('\n');

    // Формуємо FormData для CRM
    const formData = new URLSearchParams();
    formData.append('key', CRM_KEY);
    formData.append('order_id', Math.floor(Math.random() * 1000000).toString());
    formData.append('country', 'UA');
    formData.append('office', '1');
    
    // В PHP було urlencode(serialize($products_list)). 
    // Оскільки URLSearchParams теж робить urlencode, ми робимо подвійний encodeURIComponent, 
    // щоб на сервері CRM після розшифровки залишився urlencode-рядок, якщо вони викликають urldecode() вручну.
    formData.append('products', encodeURIComponent(serialize(products_list)));
    
    formData.append('bayer_name', name);
    formData.append('phone', phone);
    if (email) formData.append('email', email);
    if (city && address) formData.append('delivery_adress', `${city}, ${address}`);
    
    const dmMap: Record<string, string> = { np_branch: 'Нова Пошта (Відділення)', np_locker: 'Нова Пошта (Поштомат)', ukrpost: 'Укрпошта' };
    const translatedDeliveryMethod = deliveryMethod ? (dmMap[deliveryMethod as keyof typeof dmMap] || deliveryMethod) : 'Не вказано';

    if (deliveryMethod) {
      formData.append('delivery', translatedDeliveryMethod);
    }
    formData.append('comment', crmComment);
    
    // В PHP був sender = urlencode(serialize($_SERVER)). Додаємо пустий аналог, щоб не було помилок валідації.
    formData.append('sender', encodeURIComponent(serialize({ HTTP_HOST: 'belisi-store' })));

    // Відправка в CRM
    try {
      const crmUrlHttps = CRM_URL.replace('http://', 'https://'); 
      await fetch(crmUrlHttps, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });
    } catch (crmErr: any) {
      console.error('CRM Fetch Error:', crmErr);
    }

    // 2. Відправка в Telegram
    let tgText = `<b>🛒 ${isFullCheckout ? 'НОВЕ ЗАМОВЛЕННЯ' : 'ШВИДКЕ ЗАМОВЛЕННЯ'}</b>\n` +
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
