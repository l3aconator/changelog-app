export default function Select({
  value,
  handleChange,
  placeholder,
  inputName,
  label,
  options,
  required,
  disabled,
}: {
  value: string;
  handleChange: React.SelectHTMLAttributes<HTMLSelectElement>["onChange"];
  placeholder: string;
  inputName: string;
  label: string;
  options: { name: string; value: string }[];
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
      <div className="relative">
        <select
          className="block appearance-none w-full bg-white border  px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          value={value}
          name={inputName}
          required={required}
          disabled={disabled}
          onChange={handleChange}
          defaultValue={""}
        >
          <option disabled value="">
            {placeholder}
          </option>
          {options?.map(({ value, name }, index) => (
            <option key={index} value={value}>
              {name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
