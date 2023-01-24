export default function Input({
  value,
  handleChange,
  placeholder,
  inputName,
  label,
  required,
  disabled,
}: {
  value: string;
  handleChange: React.InputHTMLAttributes<HTMLInputElement>["onChange"];
  placeholder: string;
  inputName: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="mb-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor={inputName}
      >
        {label}
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id={inputName}
        type="text"
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        name={inputName}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}
