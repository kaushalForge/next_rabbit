"use client";

import { useState, useMemo, useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { createOrderAction } from "@/actions/handleOrder";
import { Loading, Spinner } from "../ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const Checkout = () => {
  const { cart, totalPrice, refreshCart } = useCart();
  const router = useRouter();
  const { currentUser } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // ---------------- Controlled form fields ----------------
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [finalOrder, setFinalOrder] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCart = async () => {
      await refreshCart();
    };
    loadCart();
  }, []);

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

  // ---------------- Handle Order ----------------
  let shipmentTotal = null;
  let shipping = 100;
  if (totalPrice) {
    shipmentTotal = Number(totalPrice) + Number(shipping);
  }

  const handleOrder = async (e) => {
    e.preventDefault();

    try {
      const orderData = {
        products: cart.map((item) => ({
          productId: item.productId,
          name: item.name,
          image: item.image,
          price: item.price,
          offerPrice: item.offerPrice,
          mainCategory: item.mainCategory,
          size: item.size,
          color: item.color,
          sku: item.sku,
          gender: item.gender,
          foodType: item.foodType,
          weight: item.weight,
          taste: item.taste,
          shippingFee: shipping,
          quantity: item.quantity,
        })),
        totalPrice: shipmentTotal,
        customer: {
          fullName: `${firstName} ${lastName}`,
          email: currentUser?.email,
          phone,
        },
        delivery: {
          province: state,
          district: district,
          city: city,
          ward: zipCode,
          landmark: address,
          notes: "",
        },
        payment: {
          method: paymentMethod,
        },
      };

      setFinalOrder(orderData);

      setIsLoading(true);
      const { status, message } = await createOrderAction(orderData);
      if (status === 200 || status === 201) {
        toast.success(message || "Order placed successfully!");
        setFirstName("");
        setLastName("");
        setPhone("");
        setAddress("");
        setCity("");
        setState("");
        setDistrict("");
        setCity("");
        setAddress("");
        setZipCode("");
        refreshCart();
        setIsLoading(false);
      } else {
        toast.error(message || "Failed to place order");
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Order Error:", error);
      toast.error(error.message || "Something went wrong!");
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
        <Spinner className="w-14 h-14 text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full lg:px-8 py-8 lg:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start h-full justify-center">
        {/* ================= RIGHT SIDE (FORM FIRST ON MOBILE) ================= */}
        {/* ================= ORDER SUMMARY ================= */}
        <div className="lg:col-span-1 lg:order-2 order-1">
          <div className="flex flex-col h-full min-h-125 border border-[#eaeaea] rounded-2xl shadow-lg p-4 lg:sticky lg:top-10 bg-white">
            {/* ================= LOADING ================= */}
            {isLoading ? (
              <div className="flex flex-1 items-center justify-center">
                <Spinner className="w-14 h-14" />
              </div>
            ) : cart && cart.length > 0 ? (
              <>
                {/* ================= SCROLLABLE ITEMS ================= */}
                <div className="flex-1 overflow-y-auto pr-2">
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                  <div className="space-y-4">
                    {cart.map((item, idx) => {
                      const original = item.price * item.quantity;
                      const discounted = item.offerPrice * item.quantity;

                      return (
                        <div
                          key={idx}
                          className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition"
                        >
                          <div className="w-20 h-20 bg-gray-100 overflow-hidden flex items-center justify-center shrink-0 rounded-lg">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 text-sm overflow-hidden">
                            <h3 className="font-semibold truncate">
                              {item.name}
                            </h3>
                            {item.mainCategory === "Fashion" ? (
                              <p className="text-xs text-gray-500">
                                Qty: {item.quantity} | Size: {item.size} |
                                Color: {item.color}
                              </p>
                            ) : (
                              <p className="text-xs text-gray-500">
                                Qty: {item.quantity} | Weight: {item.weight}
                              </p>
                            )}
                            <div className="flex items-center justify-start gap-1 mt-1">
                              <span className="line-through text-gray-400 text-xs">
                                Rs.{original}
                              </span>
                              <span className="font-bold text-[#ff4500]">
                                Rs.{discounted}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ================= PRICE SUMMARY (STICK BOTTOM) ================= */}
                <div className="pt-6 border-t border-[#eaeaea] space-y-3 text-sm">
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

                  <div className="flex justify-between text-lg font-bold pt-4 border-t border-[#eaeaea]">
                    <span>Total</span>
                    <span className="text-[#ff4500]">Rs. {shipmentTotal}</span>
                  </div>
                </div>
              </>
            ) : (
              /* ================= EMPTY CART ================= */
              <div className="flex flex-1 flex-col items-center justify-center text-center space-y-4">
                <img
                  src="/assets/empty-cart.svg"
                  alt="Empty Cart"
                  className="w-32 h-32 object-contain"
                />

                <h3 className="text-lg font-semibold text-gray-700">
                  Your cart is empty
                </h3>

                <p className="text-gray-500 text-sm px-4">
                  Looks like you haven’t added any products yet.
                </p>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => router.push("/collections/all")}
                    className="bg-[#ff4500] hover:bg-black text-white px-5 py-2 rounded-lg font-semibold transition"
                  >
                    Browse Products
                  </button>

                  <button
                    onClick={() => router.push("/profile")}
                    className="bg-black hover:bg-[#ff4500] text-white px-5 py-2 rounded-lg font-semibold transition"
                  >
                    My Orders
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-2 lg:order-1 order-2">
          <h2 className="text-2xl font-bold mb-8">Delivery Details</h2>

          <form onSubmit={handleOrder} className="space-y-10">
            {/* INPUT GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Input
                  label="First Name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  className="w-full border rounded-lg p-3"
                  required
                />
              </div>
              <div>
                <Input
                  label="Last Name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  className="w-full border rounded-lg p-3"
                  required
                />
              </div>
              <div>
                <Input
                  label="E-mail"
                  type="email"
                  value={currentUser?.email || "user@example.com"}
                  disabled
                  placeholder="Email"
                  className="w-full border rounded-lg p-3"
                  required
                />
              </div>
              <div>
                <Input
                  label="Phone"
                  type="number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contact Number"
                  className="w-full border rounded-lg p-3"
                  required
                />
              </div>
              <div className="w-full">
                <Select value={state} onValueChange={setState} required>
                  <SelectTrigger className="w-full border rounded-lg p-3">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Province No. 1">
                      Koshi Province
                    </SelectItem>
                    <SelectItem value="Province No. 2">
                      Province No. 2
                    </SelectItem>
                    <SelectItem value="Bagmati Province">
                      Bagmati Province
                    </SelectItem>
                    <SelectItem value="Gandaki Province">
                      Gandaki Province
                    </SelectItem>
                    <SelectItem value="Lumbini Province">
                      Lumbini Province
                    </SelectItem>
                    <SelectItem value="Karnali Province">
                      Karnali Province
                    </SelectItem>
                    <SelectItem value="Sudurpashchim Province">
                      Sudurpashchim Province
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Input
                  label="District"
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="City"
                  className="w-full border rounded-lg p-3"
                  required
                />
              </div>
              <div>
                <Input
                  label="City"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="w-full border rounded-lg p-3"
                  required
                />
              </div>

              <div>
                <Input
                  label="Address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address"
                  className="w-full border rounded-lg p-3"
                  required
                />
              </div>
              <div>
                <Input
                  label="Zip Code"
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
              className="w-full h-14 text-lg bg-[#ff4500]/80 hover:bg-[#e63e00] rounded-lg"
            >
              {cart === undefined ? (
                <Spinner className="cursor-not-allowed w-6 h-6" />
              ) : (
                <span className="cursor-not-allowed">
                  Place Order Rs.{shipmentTotal || 0}
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
