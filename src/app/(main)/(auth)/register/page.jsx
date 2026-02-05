import Register from "@/components/pages/Register";
import { Suspense } from "react";

const page = () => {
  return (
    <div>
      <Suspense>
        <Register />
      </Suspense>
    </div>
  );
};

export default page;
