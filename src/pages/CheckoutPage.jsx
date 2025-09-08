import CardPaymentMethod from "@/components/payment-method-01";
import UserInfo from "../components/userCart/UserInfo";
import PurchaseDetail from "./PurchaseDetail";
import { useState } from "react";
import OrderSummary from "@/components/userCart/OrderSummary";

const CheckoutPage = () => {
  const [purchaseTime, setPurchaseTime] = useState(null);
  return (
    <section>
      <header>
        <div className="text-center py-10">
          <h1 className="text-3xl font-semibold text-onSecondary">
            Checkout Confirmation
          </h1>
        </div>
      </header>

      <main>
        <div className="flex flex-col-reverse gap-4 md:flex-row ">
          <section className="md:w-[60%] md:ml-4 ">
            <div className="md:flex md:flex-col md:items-center">
              <CardPaymentMethod setPurchaseTime={setPurchaseTime} />
            </div>
            <div className="md:flex md:flex-col md:items-center">
              <div className="w-3/5 mx-auto pt-4">
                <PurchaseDetail dateTime={purchaseTime}/>
              </div>
            </div>
            <div>
              <UserInfo />
            </div>
          </section>
          <section className="md:w-[40%] md:flex md:flex-col md:items-center">
            <div className="md:w-[80%] ">
              <OrderSummary showPromo={false} showCheckoutBtn={false} />
            </div>
          </section>
        </div>
      </main>
    </section>
  );
};

export default CheckoutPage;
