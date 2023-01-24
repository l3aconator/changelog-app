export default function Toggle({
  value,
  handleChange,
  inputName,
  label,
  required,
  disabled,
}: {
  value: boolean;
  handleChange: React.InputHTMLAttributes<HTMLInputElement>["onChange"];
  inputName: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="mb-4">
      <label className="inline-flex relative items-center cursor-pointer">
        <input
          type="checkbox"
          checked={!!value}
          value={value as any}
          name={inputName}
          required={required}
          disabled={disabled}
          className="sr-only peer"
          onChange={handleChange}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        <span className="ml-3 text-sm font-medium text-gray-900">{label}</span>
      </label>
    </div>
  );
}
