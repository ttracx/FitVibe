import Stripe from "stripe";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

async function createProduct() {
  console.log("Creating FitVibe Pro product in Stripe...\n");

  // Create product
  const product = await stripe.products.create({
    name: "FitVibe Pro",
    description: "Unlimited workouts, AI suggestions, advanced analytics, and premium features",
    metadata: {
      app: "fitvibe",
    },
  });

  console.log(`✓ Created product: ${product.name} (${product.id})`);

  // Create price ($9.99/month)
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: 999, // $9.99 in cents
    currency: "usd",
    recurring: {
      interval: "month",
    },
    metadata: {
      app: "fitvibe",
    },
  });

  console.log(`✓ Created price: $${(price.unit_amount! / 100).toFixed(2)}/month (${price.id})`);

  // Update .env file
  const envPath = path.join(process.cwd(), ".env");
  let envContent = fs.readFileSync(envPath, "utf-8");
  
  envContent = envContent.replace(
    /STRIPE_PRICE_ID=.*/,
    `STRIPE_PRICE_ID="${price.id}"`
  );

  fs.writeFileSync(envPath, envContent);
  console.log(`\n✓ Updated .env with STRIPE_PRICE_ID`);

  console.log("\n=== Stripe Product Created ===");
  console.log(`Product ID: ${product.id}`);
  console.log(`Price ID: ${price.id}`);
  console.log(`Price: $9.99/month`);
  console.log("\nNext steps:");
  console.log("1. Create a webhook in Stripe Dashboard");
  console.log("2. Point it to: https://your-domain.com/api/stripe/webhook");
  console.log("3. Select events: checkout.session.completed, customer.subscription.*");
  console.log("4. Add STRIPE_WEBHOOK_SECRET to your environment");
}

createProduct().catch(console.error);
