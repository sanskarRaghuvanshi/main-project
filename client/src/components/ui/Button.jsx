export const PrimaryButton = ({ children, className = '', ...props }) => (
  <button className={`btn-primary ${className}`} {...props}>{children}</button>
);
export const SecondaryButton = ({ children, className = '', ...props }) => (
  <button className={`btn-secondary ${className}`} {...props}>{children}</button>
);
export const GhostButton = ({ children, className = '', ...props }) => (
  <button className={`btn-ghost ${className}`} {...props}>{children}</button>
);
export const IconButton = ({ children, className = '', ...props }) => (
  <button className={`btn-icon ${className}`} {...props}>{children}</button>
);
