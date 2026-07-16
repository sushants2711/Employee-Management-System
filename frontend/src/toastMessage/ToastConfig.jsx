import { Toaster } from "react-hot-toast";

export default function ToastConfig() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        className: "dark:bg-slate-800 dark:text-white",
      }}
    />
  );
}
