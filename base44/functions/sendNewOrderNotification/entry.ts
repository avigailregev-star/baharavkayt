import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const body = await req.json();
        
        const { data: order, event } = body;
        
        if (!order || event?.type !== 'create') {
            return Response.json({ success: true, message: 'Not a create event' });
        }

        const ownerEmail = Deno.env.get("OWNER_EMAIL");
        
        if (!ownerEmail) {
            console.log("OWNER_EMAIL not set, skipping notification");
            return Response.json({ success: true, message: 'Owner email not configured' });
        }

        const trayTypesText = order.tray_types?.length > 0 
            ? order.tray_types.join(', ') 
            : 'לא צוין';

        const emailBody = `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #d97706; border-bottom: 2px solid #d97706; padding-bottom: 10px;">🍽️ הזמנה חדשה התקבלה!</h1>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0;">
                <h2 style="color: #1e293b; margin-top: 0;">פרטי ההזמנה:</h2>
                
                <p><strong>שם הלקוח:</strong> ${order.customer_name || 'לא צוין'}</p>
                <p><strong>טלפון:</strong> ${order.phone || 'לא צוין'}</p>
                <p><strong>תאריך האירוע:</strong> ${order.event_date || 'לא צוין'}</p>
                <p><strong>מספר אנשים:</strong> ${order.guests_count || 'לא צוין'}</p>
                <p><strong>סוגי מגשים:</strong> ${trayTypesText}</p>
                ${order.notes ? `<p><strong>הערות:</strong> ${order.notes}</p>` : ''}
            </div>
            
            <p style="color: #64748b; font-size: 14px;">
                ההזמנה נוספה למערכת בסטטוס "חדש". 
                היכנסו למערכת הניהול לצפייה ועדכון.
            </p>
        </div>
        `;

        await base44.asServiceRole.integrations.Core.SendEmail({
            to: ownerEmail,
            subject: `🍽️ הזמנה חדשה - ${order.customer_name}`,
            body: emailBody
        });

        return Response.json({ success: true, message: 'Notification sent' });
    } catch (error) {
        console.error('Error sending notification:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});