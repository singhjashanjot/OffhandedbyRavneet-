const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixPayments() {
  // Find all leftover payments
  const { data: leftoverPayments, error: fetchErr } = await supabase
    .from('payments')
    .select('id, amount, reference_id, user_id')
    .like('provider_payment_id', 'OFFLINE_LEFTOVER%');

  if (fetchErr) {
    console.error("Fetch err:", fetchErr);
    return;
  }
  
  if (!leftoverPayments || leftoverPayments.length === 0) {
    console.log("No leftover payments found.");
    return;
  }

  console.log(`Found ${leftoverPayments.length} leftover payments to check.`);

  for (const payment of leftoverPayments) {
    // Find the original payment for this booking/user combo
    const { data: origPayments, error: origErr } = await supabase
      .from('payments')
      .select('id, amount')
      .eq('reference_id', payment.reference_id)
      .eq('user_id', payment.user_id)
      .like('provider_payment_id', 'OFFLINE_CONFIRMED%');

    if (origErr || !origPayments || origPayments.length === 0) {
      console.log(`Could not find original payment for leftover payment ${payment.id}`);
      continue;
    }
    
    const originalPayment = origPayments[0];

    // Get the booking
    const { data: bookings, error: bookErr } = await supabase
      .from('bookings')
      .select('tickets, discount_amount, workshops(price)')
      .eq('workshop_id', payment.reference_id)
      .eq('user_id', payment.user_id)
      .eq('status', 'CONFIRMED');
      
    if (bookErr || !bookings || bookings.length === 0) {
       console.log(`Could not find booking for leftover payment ${payment.id}`);
       continue;
    }
    
    const booking = bookings[0];
    const baseTotal = (booking.workshops.price || 0) * (booking.tickets || 1);
    const discount = booking.discount_amount || 0;
    const totalExpected = baseTotal - discount;
    
    const correctLeftoverAmount = totalExpected - originalPayment.amount;
    
    if (payment.amount !== correctLeftoverAmount) {
      console.log(`Payment ${payment.id}: Correcting amount from ${payment.amount} to ${correctLeftoverAmount}`);
      
      const { error: updateErr } = await supabase
        .from('payments')
        .update({ amount: correctLeftoverAmount })
        .eq('id', payment.id);
        
      if (updateErr) {
        console.error(`Failed to update ${payment.id}:`, updateErr);
      } else {
        console.log(`Updated successfully.`);
      }
    } else {
      console.log(`Payment ${payment.id}: Amount ${payment.amount} is already correct.`);
    }
  }
}

fixPayments();
