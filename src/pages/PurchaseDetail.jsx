import { format } from "date-fns";

const PurchaseDetail = ({dateTime}) => {
const formatted = dateTime
    ? format(dateTime, "MMMM d, yyyy 'at' hh:mm:ss a")
    : "—";

  return (
    <section>
      <div className="bg-white border rounded-lg shadow p-5">
        <h3 className="text-center font-[500]">Payment Completed At:</h3>
        <p className="text-center text-green-600">{formatted}</p>
      </div>
    </section>
  );
};

export default PurchaseDetail;
