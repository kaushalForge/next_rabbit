"use client";

import { useState, useMemo } from "react";
import { useCart } from "@/app/context/CartContext";
import { Skeleton } from "../UI/skeleton";
import { Button } from "../UI/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext";
import { Input } from "../UI/input";

const Checkout = () => {
  const { cart, totalPrice } = useCart();
  const { currentUser } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // ---------------- Controlled form fields ----------------
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState(""); // your dropdown state
  const [zipCode, setZipCode] = useState("");

  const [finalOrder, setFinalOrder] = useState(null);

  const isLoading = !cart || cart.length === 0;

  // ---- Calculations ----
  const { subtotalOriginal, subtotalDiscounted, saved } = useMemo(() => {
    let original = 0;
    let discounted = 0;

    cart?.forEach((item) => {
      original += item.price * item.quantity;
      discounted += item.offerPrice * item.quantity;
    });

    return {
      subtotalOriginal: original,
      subtotalDiscounted: discounted,
      saved: original - discounted,
    };
  }, [cart]);

  const shipping = 100;
  const GrandTotalPrice = totalPrice + shipping;

  // ---------------- Handle Order ----------------
  const handleOrder = async (e) => {
    e.preventDefault();

    try {
      // ---------------- Prepare Order Data ----------------
      const orderData = {
        customer: {
          firstName,
          lastName,
          email,
          phone,
          address,
          city,
          state,
          zipCode,
        },
        paymentMethod,
        items: cart,
        pricing: {
          subtotalOriginal,
          subtotalDiscounted,
          saved,
          shipping,
          total: GrandTotalPrice,
        },
      };

      // ---------------- Console & State ----------------
      setFinalOrder(orderData);
      console.log("Final Order:", orderData);

      // ---------------- API Call ----------------
      // Example using fetch (replace with your API endpoint)
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      toast.success("Order placed successfully!");

      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setCity("");
      setState("");
      setZipCode("");
    } catch (error) {
      console.error("Order Error:", error);
      toast.error(
        error.message || "Something went wrong while placing the order!",
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* ================= RIGHT SIDE (FORM FIRST ON MOBILE) ================= */}
        <div className="lg:col-span-2 order-1">
          <h2 className="text-2xl font-bold mb-8">Delivery Details</h2>

          <form onSubmit={handleOrder} className="space-y-10">
            {/* INPUT GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  className="w-full border rounded-lg p-3"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  className="w-full border rounded-lg p-3"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Email</label>
                <Input
                  type="email"
                  value={currentUser?.email || "user@example.com"}
                  disabled
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full border rounded-lg p-3"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone"
                  className="w-full border rounded-lg p-3"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address"
                  className="w-full border rounded-lg p-3"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="w-full border rounded-lg p-3"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">State</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full border rounded-lg p-3"
                  required
                >
                  <option value="">Select State</option>
                  <option value="Province No. 1">Koshi Province</option>
                  <option value="Province No. 2">Province No. 2</option>
                  <option value="Bagmati Province">Bagmati Province</option>
                  <option value="Gandaki Province">Gandaki Province</option>
                  <option value="Lumbini Province">Lumbini Province</option>
                  <option value="Karnali Province">Karnali Province</option>
                  <option value="Sudurpashchim Province">
                    Sudurpashchim Province
                  </option>
                </select>
              </div>
              <div>
                <label className="block mb-2 font-medium">Zip Code</label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="Zip Code"
                  className="w-full border rounded-lg p-3"
                />
              </div>
            </div>

            {/* PAYMENT */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Payment Method</h2>

              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="grid grid-cols-1 sm:grid-cols-2 gap-5"
              >
                {/* COD */}
                <label htmlFor="cod" className="cursor-pointer">
                  <div
                    className={`relative border-2 rounded-2xl p-5 flex items-center gap-5 transition ${
                      paymentMethod === "cod"
                        ? "border-[#ff4500] bg-[#fff3ee] shadow-md"
                        : "border-gray-200 hover:border-[#ff4500]"
                    }`}
                  >
                    <RadioGroupItem
                      value="cod"
                      id="cod"
                      className="absolute top-4 right-4"
                    />

                    <img
                      src="https://cdn-icons-png.flaticon.com/512/2331/2331941.png"
                      className="w-12 h-12 object-contain"
                    />

                    <div>
                      <p className="font-semibold text-lg text-[#ff4500]">
                        Cash On Delivery
                      </p>
                      <p className="text-sm text-gray-500">
                        Pay when product arrives at your door
                      </p>
                    </div>
                  </div>
                </label>
              </RadioGroup>
            </div>

            <Button
              type="submit"
              className="w-full h-14 text-lg bg-[#ff4500] hover:bg-[#e63e00] rounded-lg"
            >
              Place Order — Rs. {GrandTotalPrice}
            </Button>
          </form>
        </div>

        {/* ================= ORDER SUMMARY ================= */}
        <div className="lg:col-span-1 order-2">
          <div className="bg-white border rounded-2xl shadow-lg p-6 lg:sticky lg:top-10">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-5 h-[360px] overflow-auto pr-2">
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex gap-4 p-3">
                      <Skeleton className="w-16 h-16 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/3" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))
                : cart.map((item, idx) => {
                    const original = item.price * item.quantity;
                    const discounted = item.offerPrice * item.quantity;

                    return (
                      <div
                        key={idx}
                        className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition h-[88px]"
                      >
                        <div className="w-24 h-24 bg-gray-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>

                        <div className="flex-1 text-sm overflow-hidden">
                          <h3 className="font-semibold truncate">
                            {item.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity}
                          </p>

                          <div className="flex gap-2 mt-1">
                            <span className="line-through text-gray-400 text-xs">
                              Rs. {original}
                            </span>
                            <span className="font-bold text-[#ff4500]">
                              Rs. {discounted}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
            </div>

            <hr className="my-6" />

            <div className="space-y-3 text-sm">
              {isLoading ? (
                <>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </>
              ) : (
                <>
                  <div className="flex justify-between text-gray-500">
                    <span>Original</span>
                    <span className="line-through">Rs. {subtotalOriginal}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Discounted</span>
                    <span>Rs. {subtotalDiscounted}</span>
                  </div>

                  <div className="flex justify-between bg-[#fff1eb] border border-[#ff4500] text-[#ff4500] px-3 py-2 rounded-lg font-semibold">
                    <span>Saved</span>
                    <span>Rs. {saved}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Rs. {shipping}</span>
                  </div>

                  <div className="flex justify-between text-lg font-bold border-t pt-4">
                    <span>Total</span>
                    <span className="text-[#ff4500]">{GrandTotalPrice}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
