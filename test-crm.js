const { serialize } = require('php-serialize');

const CRM_URL = "https://tallfill.lp-crm.biz/api/addNewOrder.html";
const CRM_KEY = "ecb590414709b5c41659ef2074148b31";

async function test() {
  const products_list = [];
  products_list.push({ product_id: "45", count: 1, price: 998 });
  
  const formData = new URLSearchParams();
  formData.append('key', CRM_KEY);
  formData.append('order_id', "test_" + Math.floor(Math.random() * 1000000).toString());
  formData.append('country', 'UA');
  formData.append('office', '1');
  
  formData.append('products', encodeURIComponent(serialize(products_list)));
  formData.append('bayer_name', "Test Vercel Bot");
  formData.append('phone', "+380999999999");
  formData.append('sender', encodeURIComponent(serialize({ HTTP_HOST: 'belisi-store' })));
  
  console.log("Sending payload...");
  const res = await fetch(CRM_URL, {
    method: 'POST',
    body: formData,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  console.log("Status:", res.status);
  console.log("Response:", await res.text());
}
test();
