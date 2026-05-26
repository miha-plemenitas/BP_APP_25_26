export default function Button({ children, className = '', variant = 'default', ...props }) {
  return (
    <button className={`ui-button ui-button-${variant} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
