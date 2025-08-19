import OrderSummary from "../userCart/OrderSummary";
import PayMentMethod from "./PayMentMethod";
import UserInfo from "./UserInfo";

const Checkout = () => {
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
        <div className="flex ">
          <section className="w-[70%] ml-4 flex flex-col items-center">
            <PayMentMethod />
            <UserInfo />
          </section>
          <section className="w-[30%] mr-4 ">
            <OrderSummary showPromo={false} showCheckoutBtn={false} />
          </section>
        </div>
        

      </main>

    </section>
  );
};

export default Checkout;
