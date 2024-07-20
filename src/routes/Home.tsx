import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function Home() {
  const navigate = useNavigate();

  const logOut = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (e) {
      console.log(`error: ${e}`);
    }
  };

  return (
    <div>
      <button onClick={logOut}>Log out</button>
    </div>
  );
}
