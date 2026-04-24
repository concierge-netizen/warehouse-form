const RESEND_API_KEY = 're_f5x2xUcX_MAP2kEffgWTQop4kCjsNnMwq';
const FROM           = 'HANDS Logistics <concierge@handslogistics.com>';
const REPLY_TO       = 'concierge@handslogistics.com';
const CC             = ['concierge@handslogistics.com'];

function buildEmailHtml(d) {
  const isInbound = d.direction === 'inbound';
  const typeLabel = isInbound ? 'INBOUND RECEIPT' : 'OUTBOUND DISPATCH';
  const accent    = isInbound ? '#4a9eff' : '#f59e0b';
  const dateLabel = isInbound ? 'Date Received' : 'Ship Date';
  const addrLabel = isInbound ? 'Origin Address' : 'Ship-To Address';
  const row = (label, value) => value
    ? `<tr><td style="padding:6px 12px;color:#888;font-size:13px;white-space:nowrap;width:160px;">${label}</td><td style="padding:6px 12px;color:#f0f0f0;font-size:13px;">${value}</td></tr>`
    : '';
  const photos = [d.photoUrl1, d.photoUrl2].filter(Boolean);
  const photoHtml = photos.length
    ? `<tr><td colspan="2" style="padding:16px 12px 8px;"><p style="margin:0 0 8px;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Photos</p><div>${photos.map((u,i)=>`<a href="${u}" target="_blank"><img src="${u}" alt="Photo ${i+1}" style="width:160px;height:110px;object-fit:cover;border-radius:6px;border:1px solid #333;margin-right:10px;"></a>`).join('')}</div></td></tr>`
    : '';
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0d0d0d;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d0d;padding:40px 0;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:12px;overflow:hidden;border:1px solid #2a2a2a;max-width:600px;width:100%;">
<tr><td style="background:#111;padding:28px 32px;border-bottom:3px solid ${accent};">
<table width="100%" cellpadding="0" cellspacing="0"><tr>
<td><p style="margin:0;font-size:11px;color:#888;letter-spacing:2px;text-transform:uppercase;">HANDS Logistics</p><h1 style="margin:4px 0 0;font-size:22px;color:#fff;font-weight:700;">${typeLabel}</h1></td>
<td align="right"><span style="background:${accent};color:#fff;font-size:11px;font-weight:700;padding:6px 14px;border-radius:20px;">${isInbound?'INBOUND':'OUTBOUND'}</span></td>
</tr></table></td></tr>
<tr><td style="background:#222;padding:14px 32px;border-bottom:1px solid #2a2a2a;">
<p style="margin:0;font-size:12px;color:#888;">Purchase Order #</p>
<p style="margin:4px 0 0;font-size:20px;font-weight:700;color:${accent};letter-spacing:1px;">${d.itemId}</p>
</td></tr>
<tr><td style="padding:24px 20px 8px;">
<p style="margin:0 0 10px 12px;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;">Shipment Details</p>
<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
${row('Client',d.clientName)}${row('Account / Brand',d.account)}${row('Project / Event',d.eventProject)}${row('Purpose',d.purpose)}${row(dateLabel,d.deliveryDate)}${row('Carrier',d.carrier)}${row('Tracking #',d.trackingNumber)}${row(addrLabel,d.address)}${row('Cartons',d.cartonCount)}${row('Pallets',d.palletCount)}${row('Contents',d.contentsDescription)}${row('Special Instructions',d.specialInstructions)}${row('Handler',d.receivedShippedBy)}${row('WBS / Invoice Code',d.invoiceCode)}${row('Billing Status',d.billingStatus)}${photoHtml}
</table></td></tr>
<tr><td style="padding:8px 32px 32px;"><a href="https://handslogistics.monday.com/boards/18405667848" target="_blank" style="display:inline-block;background:${accent};color:#fff;font-size:13px;font-weight:700;padding:12px 24px;border-radius:8px;text-decoration:none;">View in Monday.com →</a></td></tr>
<tr><td style="background:#111;padding:18px 32px;border-top:1px solid #2a2a2a;">
<p style="margin:0;font-size:11px;color:#555;text-align:center;">HANDS Logistics · 8540 Dean Martin Dr, Suite 160, Las Vegas NV 89139<br><a href="mailto:concierge@handslogistics.com" style="color:#6dba96;text-decoration:none;">concierge@handslogistics.com</a></p>
</td></tr></table></td></tr></table></body></html>`;
}

exports.handler = async function(event) {
  const CORS = { 'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type' };
  if (event.httpMethod === 'OPTIONS') return { statusCode:200, headers:CORS, body:'' };
  if (event.httpMethod !== 'POST')    return { statusCode:405, headers:CORS, body:'Method not allowed' };
  try {
    const d = JSON.parse(event.body);
    const isInbound = d.direction === 'inbound';
    const subject = isInbound
      ? `[HANDS] Inbound Receipt — ${d.account} · PO #${d.itemId}`
      : `[HANDS] Outbound Dispatch — ${d.account} · PO #${d.itemId}`;
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'Authorization':`Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({ from:FROM, to:[d.clientEmail], cc:CC, reply_to:REPLY_TO, subject, html:buildEmailHtml(d) }),
    });
    if (!resendRes.ok) {
      const e = await resendRes.json().catch(()=>({}));
      throw new Error(e.message||`Resend HTTP ${resendRes.status}`);
    }
    const result = await resendRes.json();
    return { statusCode:200, headers:{...CORS,'Content-Type':'application/json'}, body:JSON.stringify({success:true,id:result.id}) };
  } catch(err) {
    return { statusCode:500, headers:{...CORS,'Content-Type':'application/json'}, body:JSON.stringify({error:err.message}) };
  }
};
