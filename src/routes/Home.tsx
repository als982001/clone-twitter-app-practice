import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function Home() {
  const navigate = useNavigate();

  const logOut = async () => {
    try {
      await auth.signOut();
    } catch (e) {
      console.log(e);
    } finally {
      navigate("/");
    }
  };

  return (
    <div>
      <button onClick={logOut}>Log out</button>
    </div>
  );
}
