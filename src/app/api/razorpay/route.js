import Razorpay from "razorpay";

const { NEXT_PUBLIC_RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

if (!NEXT_PUBLIC_RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  throw new Error("Razorpay API keys are missing in .env.local");
}

const razorpay = new Razorpay({
  key_id: NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount } = body;

    const numericAmount = Number(amount);
    if (!numericAmount || isNaN(numericAmount) || numericAmount <= 0) {
      return new Response(JSON.stringify({ error: "Invalid amount" }), {
        status: 400,
      });
    }

    const amountInPaise = Math.round(numericAmount * 100); // ensure integer paise

    if (!Number.isInteger(amountInPaise) || amountInPaise <= 0) {
      return new Response(JSON.stringify({ error: "Invalid amount after conversion" }), {
        status: 400,
      });
    }

    const order = await razorpay.orders.create({
      amount: amountInPaise, // integer paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1, // auto-capture payment
    });

    return new Response(JSON.stringify(order), { status: 200 });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return new Response(JSON.stringify({ error: "Unable to create order" }), {
      status: 500,
    });
  }
}
