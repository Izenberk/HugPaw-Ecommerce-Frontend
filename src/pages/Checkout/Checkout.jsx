export default function Checkout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar Section */}
      <section>
        <div className="text-center bg-amber-200 py-4">
          <h1>Payment Confirmation</h1>
        </div>
      </section>

      {/* Summary Section */}
      <section>
        <div className="flex flex-col md:flex-row my-4">
          <div className="md:w-1/2">
            <div className="bg-white border rounded-lg shadow space-y-4 w-[80%] mx-auto py-4 my-4">
              <div className="flex justify-between ml-2 mr-2">
                <span>Sub Total</span>
                <span>฿3,049</span>
              </div>
              <div className="flex justify-between ml-2 mr-2">
                <span>Discount</span>
                <span>-฿300</span>
              </div>
              <div className="flex justify-between ml-2 mr-2">
                <span>Shipping Cost</span>
                <span>฿50</span>
              </div>
              <div className="flex justify-between ml-2 mr-2">
                <span>Total</span>
                <span>2,799</span>
              </div>
            </div>
          </div>

          <div className="md:w-1/2">
            <img
              src="/src/assets/images/promtPay.png"
              alt="PromptPay QR"
              className="w-48 h-48 mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Purchase Detail */}
      <section>
        <div className="md:w-1/2">
          <div className="w-[90%] mx-auto">
            <div className="bg-white border rounded-lg shadow w-[80%] mx-auto p-5">
              <h3 className="text-center">Purchase Date &amp; Time</h3>
              <p className="text-center">July 13, 2025 at 05.52 PM</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Information */}
      <section>
        <div className="md:w-1/2">
          <div className="flex flex-col items-center">
            <div className="my-10 gap-4 border-2 px-12">
              <div className="my-4">
                <h3>Customer Information</h3>
              </div>
              <div className="md:flex md:gap-4">
                <div className="my-2">
                  <p>Full Name</p>
                  <input type="text" className="border-2" />
                </div>
                <div className="my-2">
                  <p>Phone Number</p>
                  <input type="text" className="border-2" />
                </div>
              </div>
              <div className="my-2">
                <p>Email Address</p>
                <input type="text" className="border-2" />
              </div>
              <div className="my-4">
                <h3>Billing Address</h3>
              </div>
              <div className="md:flex md:gap-4">
                <div className="my-2">
                  <p>Address</p>
                  <input type="text" className="border-2" />
                </div>
                <div className="my-2">
                  <p>City</p>
                  <input type="text" className="border-2" />
                </div>
                <div className="my-2">
                  <p>Postal code</p>
                  <input type="text" className="border-2" />
                </div>
              </div>
              <div>
                <p>Province</p>
                <input type="text" className="border-2" />
              </div>

              <div className="flex justify-center my-4">
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-8 rounded-md shadow-md">
                  Purchase
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
