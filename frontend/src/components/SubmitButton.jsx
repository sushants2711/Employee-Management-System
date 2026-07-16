const SubmitButton = ({
  children,
  isSubmitting = false,
  disabled = false,
  ...props
}) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting || disabled}
      className="w-full flex justify-center py-3 px-4 rounded-xl shadow-md text-base font-semibold text-white bg-ems-primary hover:bg-blue-700 dark:bg-ems-primary-dark dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ems-primary transition-all cursor-pointer transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      {...props}
    >
      {isSubmitting ? "Processing..." : children}
    </button>
  );
};

export default SubmitButton;
