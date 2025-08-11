

export default function UserCart() {
  return (
    <>
      <section>
        <div className="text-center py-4">
          <h1 className="text-3xl font-semibold text-onSecondary">
            Cart and Order Confirmation
          </h1>
        </div>
      </section>

      {/* Order Summary Bar */}
      <section className="md:w-[100%]">
        <div className="bg-surface flex justify-between w-[80%] mx-auto items-center px-4 py-2 rounded-lg shadow mt-4 border-1">
          <h2 className="text-lg font-bold text-onPrimary">Order Summary</h2>
          <button className="text-onPrimary hover:text-orange-600">
            {/* Desktop icon */}
            <svg
              className="hidden md:block"
              xmlns="http://www.w3.org/2000/svg"
              width="32px"
              height="32px"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M3 6.524c0-.395.327-.714.73-.714h4.788c.006-.842.098-1.995.932-2.793A3.68 3.68 0 0 1 12 2a3.68 3.68 0 0 1 2.55 1.017c.834.798.926 1.951.932 2.793h4.788c.403 0 .73.32.73.714a.72.72 0 0 1-.73.714H3.73A.72.72 0 0 1 3 6.524"
              />
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M11.596 22h.808c2.783 0 4.174 0 5.08-.886c.904-.886.996-2.34 1.181-5.246l.267-4.187c.1-1.577.15-2.366-.303-2.866c-.454-.5-1.22-.5-2.753-.5H8.124c-1.533 0-2.3 0-2.753.5s-.404 1.289-.303 2.866l.267 4.188c.185 2.906.277 4.36 1.182 5.245c.905.886 2.296.886 5.079.886m-1.35-9.811c-.04-.434-.408-.75-.82-.707c-.413.043-.713.43-.672.864l.5 5.263c.04.434.408.75.82.707c.413-.044.713-.43.672-.864zm4.329-.707c.412.043.713.43.671.864l-.5 5.263c-.04.434-.409.75-.82.707c-.413-.044-.713-.43-.672-.864l.5-5.264c.04-.433.409-.75.82-.707"
                clipRule="evenodd"
              />
            </svg>
            {/* Mobile icon */}
            <svg
              className="md:hidden"
              xmlns="http://www.w3.org/2000/svg"
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M3 6.524c0-.395.327-.714.73-.714h4.788c.006-.842.098-1.995.932-2.793A3.68 3.68 0 0 1 12 2a3.68 3.68 0 0 1 2.55 1.017c.834.798.926 1.951.932 2.793h4.788c.403 0 .73.32.73.714a.72.72 0 0 1-.73.714H3.73A.72.72 0 0 1 3 6.524"
              />
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M11.596 22h.808c2.783 0 4.174 0 5.08-.886c.904-.886.996-2.34 1.181-5.246l.267-4.187c.1-1.577.15-2.366-.303-2.866c-.454-.5-1.22-.5-2.753-.5H8.124c-1.533 0-2.3 0-2.753.5s-.404 1.289-.303 2.866l.267 4.188c.185 2.906.277 4.36 1.182 5.245c.905.886 2.296.886 5.079.886m-1.35-9.811c-.04-.434-.408-.75-.82-.707c-.413.043-.713.43-.672.864l.5 5.263c.04.434.408.75.82.707c.413-.044.713-.43.672-.864zm4.329-.707c.412.043.713.43.671.864l-.5 5.263c-.04.434-.409.75-.82.707c-.413-.044-.713-.43-.672-.864l.5-5.264c.04-.433.409-.75.82-.707"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </section>

      {/* Cart Items + Desktop Order Summary */}
      <section className="mt-4 md:flex md:items-center md:flex-row">
        <div className="md:w-[60%] mt-6">
          {/* Example Cart Item */}
          <div className="w-[80%] max-w-4xl flex gap-4 bg-accent p-4 rounded-lg shadow mx-auto bg-surface border-1 mb-4">
            <div className="w-24 h-24 flex-shrink-0">
              <img
                src="/src/assets/images/pedigree.webp"
                alt="Pedigree Grilled Chicken & Liver"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div className="text-sm lg:text-base text-onPrimary">
                <h3 className="font-semibold">
                  Pedigree Grilled Chicken & Liver
                </h3>
                <p>Kibble</p>
                <p>Size: 1.5 Kg</p>
                <p>฿239.00 / Piece</p>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="flex gap-2">
                  <button className="px-2 bg-white border rounded hover:bg-gray-100">
                    -
                  </button>
                  <span>1</span>
                  <button className="px-2 bg-white border rounded hover:bg-gray-100">
                    +
                  </button>
                </div>
                <button className="text-red-500 hover:text-red-700">
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Order Summary */}
        <div className="md:w-[40%] mt-6 hidden md:block">
          <div className="bg-surface border rounded-lg shadow space-y-4 p-4 max-w-xl mx-auto">
            <div className="flex justify-between gap-2">
              <input
                type="text"
                placeholder="Enter promo code here"
                className="flex-1 border px-3 py-2 rounded"
              />
              <button className="bg-primary text-onPrimary px-4 py-2 rounded hover:bg-primaryHover font-semibold">
                Apply
              </button>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-onPrimary">
                <span>Sub Total</span>
                <span>฿3,049</span>
              </div>
              <div className="flex justify-between text-onPrimary">
                <span>Discount</span>
                <span>-฿300</span>
              </div>
              <div className="flex justify-between text-onPrimary">
                <span>Shipping</span>
                <span>฿50</span>
              </div>
              <div className="flex justify-between font-semibold text-onPrimary">
                <span>Total</span>
                <span>฿2,799</span>
              </div>
            </div>
            <button className="w-full bg-primary text-onPrimary py-3 rounded-lg shadow hover:bg-primaryHover font-semibold">
              Checkout
            </button>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="mt-6 space-y-4">
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

      {/* Mobile Order Summary */}
      <section className="md:hidden mt-6">
        <div className="bg-surface border rounded-lg shadow space-y-4 p-4 max-w-xl mx-auto">
          <div className="flex justify-between gap-2">
            <input
              type="text"
              placeholder="Enter promo code here"
              className="flex-1 border px-3 py-2 rounded"
            />
            <button className="bg-primary text-onPrimary px-4 py-2 rounded hover:bg-primaryHover font-semibold">
              Apply
            </button>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-onPrimary">
              <span>Sub Total</span>
              <span>฿3,049</span>
            </div>
            <div className="flex justify-between text-onPrimary">
              <span>Discount</span>
              <span>-฿300</span>
            </div>
            <div className="flex justify-between text-onPrimary">
              <span>Shipping</span>
              <span>฿50</span>
            </div>
            <div className="flex justify-between font-semibold text-onPrimary">
              <span>Total</span>
              <span>฿2,799</span>
            </div>
          </div>
          <button className="w-full bg-primary text-onPrimary py-3 rounded-lg shadow hover:bg-primaryHover font-semibold">
            Checkout
          </button>
        </div>
      </section>
    </>
  );
}
