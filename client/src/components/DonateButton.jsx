import { useState } from "react";
import { useStripe } from "@stripe/react-stripe-js";

const DonateButton = () => {
  const stripe = useStripe();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);

    const response = await fetch(
      `${import.meta.env.VITE_APP_BACKEND_URL}/create-checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: 5 }), 
      }
    );

    const session = await response.json();

    // Redirect to Stripe Checkout
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error(result.error.message);
    }

    setLoading(false);
  };

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? "Processing..." : "Donate $5"}
    </button>
  );
};

export default DonateButton;
