import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

interface IProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: IProps) {
  const user = auth.currentUser;

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}
