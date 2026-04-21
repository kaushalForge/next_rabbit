"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useCart } from "@/app/context/CartContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { createOrderAction } from "@/actions/handleOrder";
import { Spinner } from "../ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Image from "next/image";

/* ─────────────────────────────────────────
   Constants (memoized outside component)
───────────────────────────────────────── */
const PROVINCES = [
  "Koshi Province",
  "Province No. 2",
  "Bagmati Province",
  "Gandaki Province",
  "Lumbini Province",
  "Karnali Province",
  "Sudurpashchim Province",
];

const PAYMENT_OPTIONS = [
  {
    id: "COD",
    label: "Cash on Delivery",
    sub: "Pay when your order arrives",
    icon: "💵",
    available: true,
  },
  {
    id: "eSewa",
    label: "eSewa",
    sub: "Coming soon",
    icon: "🟢",
    available: false,
  },
  {
    id: "Khalti",
    label: "Khalti",
    sub: "Coming soon",
    icon: "🟣",
    available: false,
  },
];

const FIELD_NAMES = [
  "firstName",
  "lastName",
  "phone",
  "address",
  "district",
  "city",
  "state",
  "zipCODe",
];

/* ─────────────────────────────────────────
   Optimized validation (pure functions)
───────────────────────────────────────── */
const onlyLettersAndSpace = (val) => /^[a-zA-Z\s]+$/.test(val.trim());
const isValidPhone = (val) => /^\d{10}$/.test(val.trim());
const isValidZip = (val) => val === "" || /^\d{5}$/.test(val.trim());
const notEmpty = (val) => val.trim().length > 0;

const validate = (data) => {
  const errors = {};
  const {
    firstName,
    lastName,
    phone,
    address,
    district,
    city,
    state,
    zipCODe,
  } = data;

  if (!notEmpty(firstName)) errors.firstName = "First name is required.";
  else if (!onlyLettersAndSpace(firstName))
    errors.firstName = "First name must contain only letters.";

  if (!notEmpty(lastName)) errors.lastName = "Last name is required.";
  else if (!onlyLettersAndSpace(lastName))
    errors.lastName = "Last name must contain only letters.";

  if (!notEmpty(phone)) errors.phone = "Phone number is required.";
  else if (!isValidPhone(phone))
    errors.phone = "Phone must be exactly 10 digits.";

  if (!notEmpty(state)) errors.state = "Please select a province.";
  if (!notEmpty(district)) errors.district = "District is required.";
  else if (district.trim().length < 2)
    errors.district = "Enter a valid district.";

  if (!notEmpty(city)) errors.city = "City is required.";
  else if (city.trim().length < 2) errors.city = "Enter a valid city.";

  if (!notEmpty(address)) errors.address = "Address is required.";
  else if (address.trim().length < 5)
    errors.address = "Please enter a more detailed address.";

  if (!isValidZip(zipCODe)) errors.zipCODe = "Zip code must be 5 digits.";

  return errors;
};

/* ─────────────────────────────────────────
   Optimized Field component (memoized)
───────────────────────────────────────── */
const Field = ({ label, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
      {label}
    </label>
    {children}
    {error && (
      <p className="text-[11px] text-red-500 font-medium mt-0.5 flex items-center gap-1">
        <span>⚠</span> {error}
      </p>
    )}
  </div>
);

const inputCls = (hasError) =>
  `w-full border ${hasError ? "border-red-400 bg-red-50 focus:ring-red-400" : "border-gray-200 bg-gray-50 hover:bg-white focus:bg-white focus:ring-gray-900"} rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:border-transparent transition-all duration-150`;

/* ════════════════════════════════════════
   Main Checkout Component
════════════════════════════════════════ */
const Checkout = () => {
  const { cart, refreshCart } = useCart();
  const router = useRouter();
  const { currentUser } = useAuth();

  // Single state object for form data (better performance)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    district: "",
    city: "",
    state: "",
    zipCODe: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isLoading, setIsLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Refs for scroll optimization
  const formRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  // Memoized field updater
  const updateField = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      setCartLoading(true);
      await refreshCart();
      setCartLoading(false);
    };
    loadCart();
  }, [refreshCart]);

  // Optimized validation with useMemo
  const validationErrors = useMemo(() => {
    if (Object.keys(touched).length === 0) return {};
    const allErrors = validate(formData);
    return Object.fromEntries(
      Object.entries(allErrors).filter(([key]) => touched[key]),
    );
  }, [formData, touched]);

  // Sync errors
  useEffect(() => {
    setErrors(validationErrors);
  }, [validationErrors]);

  const markTouched = useCallback((field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  // Memoized price calculations
  const { subtotalOriginal, subtotalDiscounted, saved, shipmentTotal } =
    useMemo(() => {
      let original = 0,
        discounted = 0;
      if (cart) {
        for (const item of cart) {
          original += item.price * item.quantity;
          discounted += item.offerPrice * item.quantity;
        }
      }
      const shipping = 100;
      return {
        subtotalOriginal: original,
        subtotalDiscounted: discounted,
        saved: original - discounted,
        shipmentTotal: discounted + shipping,
      };
    }, [cart]);

  const resetForm = useCallback(() => {
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      district: "",
      zipCODe: "",
    });
    setErrors({});
    setTouched({});
  }, []);

  const handlePaymentSelect = useCallback((value) => {
    setPaymentMethod(value);
    const option = PAYMENT_OPTIONS.find((o) => o.id === value);
    if (!option?.available) {
      toast.info("We are working on it! Available soon!", {
        description: `${option.label} payment will be available shortly.`,
        duration: 3000,
      });
    }
  }, []);

  const scrollToError = useCallback((fieldName) => {
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      const element = document.getElementById(fieldName);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus({ preventScroll: true });
      }
    }, 100);
  }, []);

  const handleOrder = useCallback(
    async (e) => {
      e.preventDefault();

      // Mark all fields touched
      const allTouched = Object.fromEntries(FIELD_NAMES.map((k) => [k, true]));
      setTouched(allTouched);

      const validationErrors = validate(formData);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        toast.error("Please fix the errors before placing your order.");
        scrollToError(Object.keys(validationErrors)[0]);
        return;
      }

      if (paymentMethod !== "COD") {
        toast.info("We are working on it! Available soon!");
        return;
      }

      if (!cart?.length) {
        toast.error("Your cart is empty. Add items before placing an order.");
        return;
      }

      setIsLoading(true);
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
            shippingFee: 100,
            quantity: item.quantity,
          })),
          totalPrice: shipmentTotal,
          customer: {
            fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
            email: currentUser?.email,
            phone: formData.phone.trim(),
          },
          delivery: {
            province: formData.state,
            district: formData.district.trim(),
            city: formData.city.trim(),
            ward: formData.zipCODe.trim(),
            landmark: formData.address.trim(),
            notes: "",
          },
          payment: { method: paymentMethod },
        };

        const { status, message } = await createOrderAction(orderData);

        if (status === 200 || status === 201) {
          toast.success(message || "Order placed successfully! 🎉");
          resetForm();
          await refreshCart();
          router.push("/profile");
        } else {
          toast.error(message || "Failed to place order. Please try again.");
        }
      } catch (error) {
        console.error("Order Error:", error);
        toast.error(error.message || "Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [
      formData,
      paymentMethod,
      cart,
      shipmentTotal,
      currentUser,
      resetForm,
      refreshCart,
      router,
      scrollToError,
    ],
  );

  // Loading overlay
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm gap-4">
        <Spinner className="w-12 h-12 text-gray-900" />
        <p className="text-sm font-semibold text-gray-500 tracking-wide animate-pulse">
          Placing your order…
        </p>
      </div>
    );
  }

  // Empty cart guard
  if (!cartLoading && !cart?.length) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-32 h-32 mx-auto mb-6 opacity-40 relative">
            <Image
              src="/assets/empty-cart.svg"
              alt="Empty Cart"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-sm text-gray-400 mb-8">
            Add some items before you check out.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push("/collections/all")}
              className="px-6 py-2.5 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition"
            >
              Browse Products
            </button>
            <button
              onClick={() => router.push("/profile")}
              className="px-6 py-2.5 rounded-full border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition"
            >
              My Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-gray-400 font-semibold mb-1">
            Almost there
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
            Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT - FORM */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                Delivery Details
              </h2>

              <form
                ref={formRef}
                id="checkout-form"
                onSubmit={handleOrder}
                noValidate
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {FIELD_NAMES.map((field) =>
                    field === "state" ? (
                      <Field key={field} label="Province" error={errors.state}>
                        <Select
                          value={formData.state}
                          onValueChange={(val) => {
                            updateField("state", val);
                            markTouched("state");
                          }}
                        >
                          <SelectTrigger
                            id="state"
                            className={inputCls(!!errors.state)}
                          >
                            <SelectValue placeholder="Select Province" />
                          </SelectTrigger>
                          <SelectContent>
                            {PROVINCES.map((p) => (
                              <SelectItem key={p} value={p}>
                                {p}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    ) : field === "email" ? (
                      <Field key={field} label="Email">
                        <input
                          type="email"
                          value={currentUser?.email || ""}
                          disabled
                          className={`${inputCls(false)} opacity-50 cursor-not-allowed`}
                        />
                      </Field>
                    ) : field !== "zipCODe" ? (
                      <Field
                        key={field}
                        label={
                          field === "zipCODe"
                            ? "Zip Code"
                            : field.charAt(0).toUpperCase() + field.slice(1)
                        }
                        error={errors[field]}
                      >
                        <input
                          id={field}
                          value={formData[field]}
                          onChange={(e) => {
                            let val = e.target.value;
                            if (field === "phone" || field === "zipCODe") {
                              val = val
                                .replace(/\D/g, "")
                                .slice(0, field === "phone" ? 10 : 5);
                            }
                            updateField(field, val);
                          }}
                          onBlur={() => markTouched(field)}
                          placeholder={
                            field === "firstName"
                              ? "John"
                              : field === "lastName"
                                ? "Doe"
                                : field === "phone"
                                  ? "98XXXXXXXX"
                                  : field === "zipCODe"
                                    ? "44600"
                                    : field === "district"
                                      ? "Kathmandu"
                                      : field === "city"
                                        ? "Thamel"
                                        : field === "address"
                                          ? "Street, building, landmark…"
                                          : ""
                          }
                          maxLength={
                            field === "phone"
                              ? 10
                              : field === "zipCODe"
                                ? 5
                                : undefined
                          }
                          className={inputCls(!!errors[field])}
                        />
                      </Field>
                    ) : (
                      <div key={field} className="sm:col-span-2">
                        <Field
                          label="Landmark / Address"
                          error={errors.address}
                        >
                          <input
                            id="address"
                            value={formData.address}
                            onChange={(e) =>
                              updateField("address", e.target.value)
                            }
                            onBlur={() => markTouched("address")}
                            placeholder="Street, building, landmark…"
                            className={inputCls(!!errors.address)}
                          />
                        </Field>
                      </div>
                    ),
                  )}
                </div>
              </form>
            </div>

            {/* Payment section */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                Payment Method
              </h2>

              <RadioGroup
                value={paymentMethod}
                onValueChange={handlePaymentSelect}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                {PAYMENT_OPTIONS.map((option) => (
                  <label
                    key={option.id}
                    htmlFor={option.id}
                    className="cursor-pointer"
                  >
                    <div
                      className={`relative flex flex-col items-start gap-3 rounded-2xl border-2 p-5 transition-all duration-150
                      ${
                        paymentMethod === option.id
                          ? option.available
                            ? "border-gray-900 bg-gray-900 shadow-md"
                            : "border-gray-400 bg-gray-800 shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <RadioGroupItem
                        value={option.id}
                        id={option.id}
                        className="absolute top-4 right-4"
                      />
                      <span className="text-2xl">{option.icon}</span>
                      <div>
                        <p
                          className={`font-bold text-sm ${paymentMethod === option.id ? "text-white" : "text-gray-900"}`}
                        >
                          {option.label}
                        </p>
                        <p
                          className={`text-xs mt-0.5 ${paymentMethod === option.id ? "text-white/50" : "text-gray-400"}`}
                        >
                          {option.sub}
                        </p>
                      </div>
                      {!option.available && (
                        <span className="absolute bottom-3 right-3 text-[9px] font-bold uppercase tracking-widest bg-orange-100 text-orange-500 px-2 py-0.5 rounded-full">
                          Soon
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </RadioGroup>

              {paymentMethod !== "COD" && (
                <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-orange-50 border border-orange-100">
                  <span className="text-orange-400">⚠</span>
                  <p className="text-xs text-orange-600 font-medium">
                    {PAYMENT_OPTIONS.find((o) => o.id === paymentMethod)?.label}{" "}
                    is not available yet.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT - ORDER SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:sticky lg:top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-5 pb-4 border-b border-gray-100">
                Order Summary
              </h2>

              {cartLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-16 h-16 rounded-xl bg-gray-200 shrink-0" />
                      <div className="flex-1 space-y-2 pt-1">
                        <div className="h-3 bg-gray-200 rounded-full w-3/4" />
                        <div className="h-3 bg-gray-200 rounded-full w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1 mb-6">
                    {cart?.map((item, idx) => {
                      const discounted = item.offerPrice * item.quantity;
                      const original = item.price * item.quantity;
                      return (
                        <div
                          key={idx}
                          className="flex gap-3 p-2.5 rounded-2xl hover:bg-gray-50 transition"
                        >
                          <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0 relative">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate leading-snug">
                              {item.name}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              {item.mainCategory === "Fashion"
                                ? `Qty ${item.quantity} · ${item.size} · ${item.color}`
                                : `Qty ${item.quantity} · ${item.weight}`}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-xs text-gray-400 line-through">
                                Rs.{original}
                              </span>
                              <span className="text-xs font-bold text-gray-900">
                                Rs.{discounted}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-2.5 text-sm border-t border-gray-100 pt-5">
                    <div className="flex justify-between text-gray-400">
                      <span>Subtotal</span>
                      <span className="line-through">
                        Rs. {subtotalOriginal}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>After discount</span>
                      <span>Rs. {subtotalDiscounted}</span>
                    </div>
                    {saved > 0 && (
                      <div className="flex justify-between text-green-600 bg-green-50 border border-green-100 px-3 py-2 rounded-xl font-semibold">
                        <span>You save</span>
                        <span>Rs. {saved}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-400">
                      <span>Shipping</span>
                      <span>Rs. 100</span>
                    </div>
                    <div className="flex justify-between text-base font-black text-gray-900 border-t border-gray-100 pt-3 mt-1">
                      <span>Total</span>
                      <span>Rs. {shipmentTotal}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    form="checkout-form"
                    disabled={isLoading || paymentMethod !== "COD"}
                    className={`mt-6 w-full font-bold text-sm py-4 rounded-2xl transition-all duration-150 flex items-center justify-center gap-2
                      ${paymentMethod !== "COD" ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gray-900 hover:bg-gray-700 text-white"}`}
                  >
                    {isLoading ? (
                      <Spinner className="w-5 h-5" />
                    ) : paymentMethod !== "COD" ? (
                      "Select COD to place order"
                    ) : (
                      <>
                        Place Order{" "}
                        <span className="text-white/60">
                          Rs. {shipmentTotal}
                        </span>
                      </>
                    )}
                  </button>

                  {paymentMethod === "COD" && (
                    <p className="text-center text-[11px] text-gray-400 mt-3">
                      🔒 Secure checkout · Free returns up to 45 days
                    </p>
                  )}
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
