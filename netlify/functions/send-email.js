// HANDS Logistics — I/O Form Email
// Server-side Netlify function → Resend API. No Zapier involved.
const RESEND_API_KEY = 're_Xi5en35b_9XFtdPxMhPrZ2bLfSE2jtRwD';
const FROM     = 'HANDS Logistics <concierge@handslogistics.com>';
const REPLY_TO = 'concierge@handslogistics.com';
const BCC      = ['concierge@handslogistics.com'];
const LOGO     = 'https://res.cloudinary.com/dxkpbjicu/image/upload/v1774556178/HANDS_Logo_BlackBG_HiRes_qtkac8.png';

function esc(s) { return s ? String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') : ''; }

function buildEmailHtml(d) {
  var isInbound  = d.direction === 'inbound';
  var bannerText = isInbound ? 'Inbound Receipt' : 'Outbound Dispatch';
  var headline   = isInbound ? 'Your shipment has been received.' : 'Your shipment has been dispatched.';
  var dateLabel  = isInbound ? 'Date Received' : 'Ship Date';
  var addrLabel  = isInbound ? 'Origin Address' : 'Ship-To Address';
  var row  = function(lbl,val) { return val ? '<tr><td style="padding:11px 18px;font-size:12px;color:#888;border-bottom:1px solid #e0e0e0;width:38%;text-transform:uppercase;letter-spacing:0.5px;">'+lbl+'</td><td style="padding:11px 18px;font-size:13px;color:#0a0a0a;border-bottom:1px solid #e0e0e0;">'+esc(val)+'</td></tr>' : ''; };
  var rowL = function(lbl,val) { return val ? '<tr><td style="padding:11px 18px;font-size:12px;color:#888;width:38%;text-transform:uppercase;letter-spacing:0.5px;">'+lbl+'</td><td style="padding:11px 18px;font-size:13px;color:#0a0a0a;">'+esc(val)+'</td></tr>' : ''; };
  var photos = [d.photoUrl1, d.photoUrl2].filter(Boolean);
  var photoSection = photos.length ? '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0"><tr>'+photos.map(function(u,i){return '<td style="padding:0 4px;"><table cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#a0d6b4;border-radius:8px;"><a href="'+esc(u)+'" target="_blank" style="display:inline-block;padding:14px 28px;font-size:13px;font-weight:700;color:#0a0a0a;text-decoration:none;letter-spacing:1px;text-transform:uppercase;">View Photo '+(i+1)+'</a></td></tr></table></td>';}).join('')+'</tr></table></td></tr></table>' : '';
  return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>'+bannerText+'</title></head>'
    +'<body style="margin:0;padding:0;background-color:#f2f2f2;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;">'
    +'<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#e0e0e0;padding:32px 0;"><tr><td align="center">'
    +'<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">'
    +'<tr><td style="background-color:#0a0a0a;padding:32px 40px 28px;">'
    +'<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>'
    +'<td><img src="'+LOGO+'" alt="HANDS Logistics" width="145" style="display:block;border:0;"></td>'
    +'<td align="right"><p style="margin:0;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#555;">Brand Activations<br>Concierge Logistics</p></td>'
    +'</tr></table>'
    +'<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;"><tr>'
    +'<td width="68%" height="3" style="background-color:#1a1a1a;font-size:0;line-height:0;">&nbsp;</td>'
    +'<td width="32%" height="3" style="background-color:#a0d6b4;font-size:0;line-height:0;">&nbsp;</td>'
    +'</tr></table></td></tr>'
    +'<tr><td style="background-color:#a0d6b4;padding:14px 40px;"><p style="margin:0;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#0a0a0a;text-align:center;">'+bannerText+'</p></td></tr>'
    +'<tr><td style="padding:36px 40px 0;">'
    +'<p style="margin:0 0 8px;font-size:22px;font-weight:800;color:#0a0a0a;letter-spacing:-0.5px;">'+headline+'</p>'
    +'<p style="margin:0 0 28px;font-size:14px;color:#444;line-height:1.6;">Hi '+esc(d.clientName)+', your '+(isInbound?'inbound shipment has been received and logged':'outbound shipment has been processed and dispatched')+'. Review the details below and contact us with any questions.</p>'
    +'<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;border:1px solid #d0d0d0;border-radius:6px;overflow:hidden;">'
    +'<tr><td colspan="2" style="background-color:#e2e2e2;padding:10px 18px;border-bottom:1px solid #d0d0d0;"><p style="margin:0;font-size:9.5px;font-weight:900;letter-spacing:3px;text-transform:uppercase;color:#a0d6b4;">01 &mdash; Order Information</p></td></tr>'
    +row('Client',d.clientName)+row('Account / Brand',d.account)+row('PO Number',d.itemId)+row('Project / Event',d.eventProject)+rowL('Purpose',d.purpose)
    +'</table>'
    +'<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;border:1px solid #d0d0d0;border-radius:6px;overflow:hidden;">'
    +'<tr><td colspan="2" style="background-color:#e2e2e2;padding:10px 18px;border-bottom:1px solid #d0d0d0;"><p style="margin:0;font-size:9.5px;font-weight:900;letter-spacing:3px;text-transform:uppercase;color:#a0d6b4;">02 &mdash; Shipment Details</p></td></tr>'
    +row(dateLabel,d.deliveryDate)+row('Carrier',d.carrier)+row('Tracking #',d.trackingNumber)+row(addrLabel,d.address)+row('Cartons',d.cartonCount)+row('Pallets',d.palletCount)+row('Weight (lbs)',d.weight)+rowL('Contents',d.contentsDescription)
    +'</table>'
    +(d.specialInstructions?'<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;border:1px solid #d0d0d0;border-radius:6px;overflow:hidden;"><tr><td style="background-color:#e2e2e2;padding:10px 18px;border-bottom:1px solid #d0d0d0;"><p style="margin:0;font-size:9.5px;font-weight:900;letter-spacing:3px;text-transform:uppercase;color:#a0d6b4;">03 &mdash; Special Instructions</p></td></tr><tr><td style="padding:16px 18px;"><p style="margin:0;font-size:13px;color:#0a0a0a;line-height:1.9;white-space:pre-line;">'+esc(d.specialInstructions)+'</p></td></tr></table>':'')
    +photoSection
    +'</td></tr>'
    +'<tr><td style="padding:24px 40px;text-align:center;">'
    +'<table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;"><tr><td style="background-color:#a0d6b4;border-radius:8px;">'
    +'<a href="https://assignpurpose.netlify.app/?po='+d.itemId+'" target="_blank" style="display:inline-block;padding:14px 32px;font-size:13px;font-weight:700;color:#0a0a0a;text-decoration:none;letter-spacing:1px;text-transform:uppercase;white-space:nowrap;">Assign Purpose &rarr;</a>'
    +'</td></tr></table>'
    +'<p style="margin:8px 0 0;font-size:11px;color:#888;">Let us know how you\'d like these materials used.</p>'
    +'</td></tr>'
    +'<tr><td style="background-color:#e8e8e8;padding:20px 40px;border-top:1px solid #d5d5d5;">'
    +'<p style="margin:0;font-size:12px;color:#888;line-height:1.7;text-align:center;">Questions? Contact <a href="mailto:concierge@handslogistics.com" style="color:#a0d6b4;text-decoration:none;">concierge@handslogistics.com</a> &mdash; please report any discrepancies within 48 hours.</p>'
    +'</td></tr>'
    +'<tr><td style="padding:0;font-size:0;line-height:0;">'
    +'<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr>'
    +'<td width="68%" height="3" style="background-color:#1a1a1a;font-size:0;line-height:0;">&nbsp;</td>'
    +'<td width="32%" height="3" style="background-color:#a0d6b4;font-size:0;line-height:0;">&nbsp;</td>'
    +'</tr></table>'
    +'<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr><td style="background-color:#0a0a0a;">'
    +'<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:rgba(5,5,5,0.90);"><tr><td style="padding:32px 40px 36px;">'
    +'<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>'
    +'<td width="38%" style="vertical-align:top;padding-right:32px;border-right:1px solid rgba(255,255,255,0.12);">'
    +'<p style="margin:0 0 6px;font-family:Georgia,serif;font-size:20px;color:#fff;line-height:1.2;">Concierge Desk</p>'
    +'<p style="margin:0 0 20px;font-size:9px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#a0d6b4;">HANDS Logistics</p>'
    +'<table cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#a0d6b4;border-radius:6px;">'
    +'<a href="https://scheduleadelivery.netlify.app/" target="_blank" style="display:inline-block;padding:13px 20px;font-size:11px;font-weight:700;color:#0a0a0a;text-decoration:none;letter-spacing:1px;text-transform:uppercase;white-space:nowrap;">Book Another Delivery</a>'
    +'</td></tr></table></td>'
    +'<td width="62%" style="vertical-align:top;padding-left:32px;">'
    +'<p style="margin:0 0 18px;font-family:Georgia,serif;font-size:13px;font-style:italic;color:rgba(255,255,255,0.85);padding-bottom:18px;border-bottom:1px solid rgba(255,255,255,0.12);">Your logistics are in better HANDS.</p>'
    +'<table width="100%" cellpadding="0" cellspacing="0" border="0">'
    +'<tr><td width="22" style="padding-bottom:12px;"><span style="color:#a0d6b4;">&#9993;</span></td><td style="padding-bottom:12px;"><a href="mailto:concierge@handslogistics.com" style="font-size:12px;color:#fff;text-decoration:none;">concierge@handslogistics.com</a></td></tr>'
    +'<tr><td width="22" style="padding-bottom:12px;"><span style="color:#a0d6b4;">&#9832;</span></td><td style="padding-bottom:12px;"><a href="https://www.handslogistics.com" style="font-size:12px;color:#fff;text-decoration:none;">www.handslogistics.com</a></td></tr>'
    +'<tr><td width="22"><span style="color:#a0d6b4;">&#9679;</span></td><td><span style="font-size:11px;color:rgba(255,255,255,0.75);line-height:1.5;">8540 Dean Martin Drive<br>Suite 160, Las Vegas, NV 89139</span></td></tr>'
    +'</table></td></tr></table>'
    +'<p style="margin:20px 0 0;font-size:8px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.35);">Brand Activations &nbsp;&middot;&nbsp; Events &nbsp;&middot;&nbsp; Concierge Logistics</p>'
    +'</td></tr></table></td></tr></table></td></tr>'
    +'</table></td></tr></table></body></html>';
}

exports.handler = async function(event) {
  var CORS = {'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type'};
  if (event.httpMethod === 'OPTIONS') return {statusCode:200, headers:CORS, body:''};
  if (event.httpMethod !== 'POST')    return {statusCode:405, headers:CORS, body:'Method not allowed'};
  try {
    var d = JSON.parse(event.body);
    var isInbound = d.direction === 'inbound';
    var subject = isInbound
      ? 'Inbound Receipt \u2014 ' + d.account + ' | PO #' + d.itemId
      : 'Outbound Dispatch \u2014 ' + d.account + ' | PO #' + d.itemId;
    var r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {'Content-Type':'application/json','Authorization':'Bearer '+RESEND_API_KEY},
      body: JSON.stringify({from:FROM, to:[d.clientEmail], bcc:BCC, reply_to:REPLY_TO, subject:subject, html:buildEmailHtml(d)}),
    });
    if (!r.ok) {
      var e = await r.json().catch(function(){return {};});
      throw new Error(e.message || 'Resend HTTP ' + r.status);
    }
    var result = await r.json();
    return {statusCode:200, headers:Object.assign({},CORS,{'Content-Type':'application/json'}), body:JSON.stringify({success:true, id:result.id})};
  } catch(err) {
    return {statusCode:500, headers:Object.assign({},CORS,{'Content-Type':'application/json'}), body:JSON.stringify({error:err.message})};
  }
};
