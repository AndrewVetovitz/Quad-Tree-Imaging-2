export function Link({
  href,
  children,
  overrideClassName,
  download,
}: {
  href: string;
  children: React.ReactNode;
  overrideClassName?: string;
  download?: string;
}) {
  return (
    <a
      href={href}
      download={download}
      className={overrideClassName ?? "text-blue-600 dark:text-blue-500 hover:underline"}
    >
      {children}
    </a>
  );
}
