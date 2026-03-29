import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { event, data: order } = await req.json();

    if (!order || !order.id) {
      return Response.json({ error: 'No order data' }, { status: 400 });
    }

    // המתן 3 שניות כדי לוודא שכל OrderItems נוצרו
    await new Promise(resolve => setTimeout(resolve, 3000));

    // משוך את פריטי ההזמנה
    const orderItems = await base44.asServiceRole.entities.OrderItem.filter({ order: order.id });
    
    // משוך את פרטי המוצרים
    const itemsWithProducts = await Promise.all(
      orderItems.map(async (item) => {
        try {
          const product = await base44.asServiceRole.entities.Product.get(item.product);
          return {
            ...item,
            product_name: product.name
          };
        } catch (error) {
          return {
            ...item,
            product_name: 'מוצר לא זמין'
          };
        }
      })
    );

    // חשב סכום כולל
    const totalAmount = itemsWithProducts.reduce((sum, item) => {
      return sum + ((item.price || 0) * (item.quantity || 0));
    }, 0);

    // בנה את רשימת הפריטים
    let itemsList = '';
    if (itemsWithProducts.length > 0) {
      itemsList = itemsWithProducts.map(item => {
        const itemTotal = (item.price || 0) * (item.quantity || 0);
        return `• ${item.product_name} - כמות: ${item.quantity}, מחיר ליחידה: ₪${item.price || 0}, סה״כ: ₪${itemTotal}`;
      }).join('\n');
    } else {
      itemsList = 'אין פריטים בהזמנה';
    }

    // בנה את תוכן המייל
    let emailBody = `
התקבלה הזמנה חדשה! 🎉

📋 פרטי ההזמנה:
━━━━━━━━━━━━━━━━━━━━
מספר הזמנה: ${order.id}
סטטוס: ${order.status || 'חדש'}

👤 פרטי הלקוח:
שם: ${order.customer_name}
טלפון: ${order.phone}

📦 פרטי אספקה:
שיטת אספקה: ${order.delivery_method}
מועד מבוקש: ${order.ready_time ? new Date(order.ready_time).toLocaleString('he-IL') : 'לא צוין'}
${order.delivery_method === 'משלוח' && order.delivery_address ? `כתובת: ${order.delivery_address}` : ''}

${order.is_gift ? `
🎁 זו מתנה!
שם המקבל: ${order.recipient_name || 'לא צוין'}
שם השולח: ${order.sender_name || 'לא צוין'}
טלפון השולח: ${order.sender_phone || 'לא צוין'}
הקדשה: ${order.gift_message || 'אין הקדשה'}
` : ''}

${order.notes ? `📝 הערות: ${order.notes}` : ''}

🛒 פריטים בהזמנה:
━━━━━━━━━━━━━━━━━━━━
${itemsList}

💰 סה״כ הזמנה: ₪${totalAmount}

${order.delivery_method === 'משלוח' ? '⚠️ דמי משלוח ישוקללו במחיר לאחר שיחה טלפונית' : ''}

━━━━━━━━━━━━━━━━━━━━
ליבא - קייטרינג בוטיק 💛
`;

    // שלח את המייל
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: 'avigailregev@gmail.com',
      subject: `התקבלה הזמנה חדשה – ${order.customer_name}`,
      body: emailBody
    });

    return Response.json({ 
      success: true, 
      message: 'Email sent successfully',
      itemsCount: itemsWithProducts.length,
      totalAmount
    });

  } catch (error) {
    console.error('Error sending order email:', error);
    return Response.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
});