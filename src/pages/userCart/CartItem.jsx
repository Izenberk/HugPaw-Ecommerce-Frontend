export default function CartItem() {
  return (
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
          <h3 className="font-semibold">Pedigree Grilled Chicken & Liver</h3>
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
  );
}
