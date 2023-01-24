export default function Button({
  children,
  type = "button",
  onClick,
  disabled,
  variant = "default",
}: {
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  onClick?: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  disabled?: boolean;
  children?: React.ReactNode;
  variant?: "default" | "red" | "green";
}) {
  const classes = () => {
    switch (variant) {
      case "green":
        return "focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800";
      case "red":
        return "focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900";
      default:
        return "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800";
    }
  };

  return (
    <div>
      <button
        type={type}
        className={`${classes()} ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={onClick}
        disabled={disabled}
      >
        {children ? children : "Save"}
      </button>
    </div>
  );
}
