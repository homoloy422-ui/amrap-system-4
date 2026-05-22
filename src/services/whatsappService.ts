import { Member } from '../types';

export const WHATSAPP_TEMPLATES = [
  { id: 'welcome', label: 'Welcome To AMRAP', icon: 'UserPlus' },
  { id: 'payment_received', label: 'Payment Confirmation', icon: 'CheckCircle' },
  { id: 'due_reminder', label: 'Fee Reminder (Soon)', icon: 'Clock' },
  { id: 'expiry_reminder', label: 'Membership Expired', icon: 'AlertCircle' },
];

export const getWhatsAppLink = (member: Member, type: string, amount?: number) => {
  let message = "";
  
  switch(type) {
    case 'welcome':
      message = `Hello ${member.fullName}, welcome to AMRAP THE GYM! We are excited to have you on board. Let's crush those goals!`;
      break;
    case 'payment_received':
      message = `Hello ${member.fullName}, your payment of ₹${amount} has been received successfully. Thank you for being part of AMRAP the gym. Stay Strong!`;
      break;
    case 'expiry_reminder':
      message = `Hello ${member.fullName}, your gym membership at AMRAP expires on ${member.dueDate}. Please renew to continue training without interruption. Stay Titan!`;
      break;
    case 'due_reminder':
      message = `Hello ${member.fullName}, your AMRAP gym fee is pending. Kindly complete the payment of ₹${amount || ''} before ${member.dueDate} to avoid late fees.`;
      break;
    default:
      message = `Hello ${member.fullName}, this is a message from AMRAP THE GYM.`;
  }

  // Clean phone number: remove non-digits
  const cleanPhone = member.phone.replace(/\D/g, '');
  // If no country code, assume India (+91)
  const finalPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  return `https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`;
};

export const sendWhatsAppMessage = async (member: Member, type: string, amount?: number) => {
  let message = "";
  
  switch(type) {
    case 'welcome':
      message = `Hello ${member.fullName}, welcome to AMRAP THE GYM! We are excited to have you on board. Let's crush those goals!`;
      break;
    case 'payment_received':
      message = `Hello ${member.fullName}, your payment of ₹${amount} has been received successfully. Thank you for being part of AMRAP the gym.`;
      break;
    case 'expiry_reminder':
      message = `Hello ${member.fullName}, your gym membership at AMRAP expires on ${member.dueDate}. Please renew to continue training.`;
      break;
    case 'due_reminder':
      message = `Hello ${member.fullName}, your AMRAP gym fee is pending. Kindly complete payment before ${member.dueDate}.`;
      break;
    default:
      message = `Hello ${member.fullName}, this is a reminder from AMRAP THE GYM.`;
  }

  try {
    const response = await fetch('/api/whatsapp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: member.whatsapp, message })
    });
    return await response.json();
  } catch (error) {
    console.error('WhatsApp service error:', error);
    return { error: 'Failed to connect to server' };
  }
};
