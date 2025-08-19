const UserInfo = () => {
  return (
    <section>

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
              <button className="bg-primary text-onPrimary hover:bg-primaryHover cursor-pointer font-medium py-2 px-8 rounded-md shadow-md">
                Purchase
              </button>
            </div>
          </div>
        </div>

    </section>
  );
};

export default UserInfo;
