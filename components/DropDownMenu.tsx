export function DropDownMenu({
  className,
  onChangeOption,
  children,
  defaultValue,
}: {
  className?: string;
  onChangeOption: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  defaultValue?: string;
}) {
  return (
    <form>
      <select
        id="shape"
        onChange={onChangeOption}
        className={[
          className,
          "px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 outline-none dark:placeholder-gray-400",
        ].join(" ")}
        defaultValue={defaultValue}
      >
        {children}
      </select>
    </form>
  );
}
