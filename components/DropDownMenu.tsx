export function DropDownMenu({
  className,
  onChangeOption,
  children,
}: {
  className?: string;
  onChangeOption: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      className={[
        className,
        "px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
      ].join(" ")}
      onChange={onChangeOption}
    >
      {children}
    </select>
  );
}
