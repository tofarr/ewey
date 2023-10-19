import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface LockableLinkProps {
  to: string;
  locked: boolean;
  children: ReactNode;
}

export default function LockableLink({to, locked, children}: LockableLinkProps) {
  if (locked) {
    return <>{children}</>
  }
  return (
    <Link to={to}>
      {children}
    </Link>
  )
}