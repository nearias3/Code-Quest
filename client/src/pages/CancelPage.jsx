const CancelPage = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Donation Cancelled</h2>
      <p>
        You have canceled your donation. To return to the donation page, click below.
      </p>
      <button onClick={() => (window.location.href = "/contact")}>
        Return
      </button>
    </div>
  );
};

export default CancelPage;
