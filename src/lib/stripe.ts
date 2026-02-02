import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export const PLANS = {
  pro: {
    name: "FitVibe Pro",
    description: "Unlimited workouts, AI suggestions, and premium features",
    price: 9.99,
    priceId: process.env.STRIPE_PRICE_ID,
    features: [
      "Unlimited workout logging",
      "AI workout suggestions",
      "Advanced analytics & charts",
      "Custom workout templates",
      "Streak tracking & badges",
      "Export workout history",
      "Priority support",
    ],
  },
};

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  return stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
}

export async function createCustomer(email: string, name?: string) {
  return stripe.customers.create({
    email,
    name: name || undefined,
  });
}

export async function createPortalSession(customerId: string, returnUrl: string) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}
