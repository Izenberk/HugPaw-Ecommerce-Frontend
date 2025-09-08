import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// For checkout page
const UserInfo = () => {
  return (
    <section>
      <div className="flex flex-col items-center">
        <div className="my-4 gap-4 border-2 px-20">
          <div className="my-4  font-[500]">
            <h3>Customer Information</h3>
          </div>
          <div className="md:flex md:gap-4 mb-2">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="firstName">First Name</Label>
              <Input type="firstName" id="firstName" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="lastName">Last Name</Label>
              <Input type="lastName" id="lastName" />
            </div>
          </div>
          <div className="md:flex md:gap-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input type="phoneNumber" id="phoneNumber" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" />
            </div>
          </div>

          <div className="my-4  font-[500]">
            <h3>Billing Address</h3>
          </div>
          <div className="md:flex md:gap-4 mb-2">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="address">Address</Label>
              <Input type="address" id="address" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="district">District</Label>
              <Input type="district" id="district" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="city">City</Label>
              <Input type="city" id="city" />
            </div>
          </div>
          <div className="md:flex md:gap-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="province">Province</Label>
              <Input type="province" id="province" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input type="postalCode" id="postalCode" />
            </div>
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
