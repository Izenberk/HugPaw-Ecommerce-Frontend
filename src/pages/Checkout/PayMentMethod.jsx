const PayMentMethod = () => {
  return (
    <section className=" space-y-4">
      <div className="text-center text-lg font-bold text-onPrimary">
        Select Payment Method
      </div>
      <div className="flex flex-col md:flex-row gap-4 justify-center px-4">
        <div className="bg-surface text-onPrimary border-1 border-primary flex items-center gap-4 px-4 py-3 rounded-lg shadow-md w-full max-w-md">
          <img
            src="/src/assets/images/creditCard.png"
            alt="Credit / Debit Card"
            className="w-16 h-16 object-contain"
          />
          <div className="flex-1">
            <h4 className="font-semibold">Credit / Debit Card</h4>
            <p className="text-sm">Pay securely with your card</p>
          </div>
          <input
            type="radio"
            name="payment-method"
            className="w-5 h-5 accent-primary"
          />
        </div>

        <div className="bg-surface text-onPrimary border-1 border-primary flex items-center gap-4 px-4 py-3 rounded-lg shadow-md w-full max-w-md">
          <img
            src="/src/assets/images/promtPay.png"
            alt="PromptPay QR Code"
            className="w-16 h-16 object-contain"
          />
          <div className="flex-1">
            <h4 className="font-semibold">PromptPay QR Code</h4>
            <p className="text-sm">Pay with your mobile banking</p>
          </div>
          <input
            type="radio"
            name="payment-method"
            className="w-5 h-5 accent-primary"
          />
        </div>
      </div>
    </section>
  );
};

export default PayMentMethod;
