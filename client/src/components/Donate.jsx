import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import DonateButton from "./DonateButton.jsx";

// Stripe public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const DonateSection = () => {
  return (
    <Elements stripe={stripePromise}>
      <div style={{ textAlign: "center", margin: "20px" }}>
        <h2>Support Wizard&apos;s Apprentice</h2>
        <p>Your donations help support ongoing game development. Thank you!</p>
        <DonateButton />
      </div>
    </Elements>
  );
};

export default DonateSection;
