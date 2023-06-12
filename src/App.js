import "./styles.css";
import { useContext, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  Navigate,
  Outlet,
  useNavigate
} from "react-router-dom";
import { AuthContext } from "./AuthContext";

/**
 * https://stackoverflow.com/questions/75907311/redirect-to-home-after-login-using-react-react-router-and-usenavigate-not-workin
 */

const Loading = () => <h1>Loading...</h1>;

const Login = () => {
  const [inputs, setInputs] = useState({
    email: "",
    password: ""
  });
  const [err, setErr] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // state variable for loading spinner

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true); // set loading to true
      await login(inputs);
      // setTimeout(navigate, 0, "/");
      navigate("/", { replace: true });
    } catch (err) {
      setErr(err.response.data);
    } finally {
      setIsLoading(false); // set loading back to false
    }
  };

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>SocialMica</h1>
          <p>Make connecting with friends easy and fun</p>
          <span>Dont have an account yet?</span>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form action="">
            <input
              type="email"
              placeholder="email"
              name="email"
              onChange={handleChange}
            ></input>
            <input
              type="password"
              placeholder="password"
              name="password"
              onChange={handleChange}
            />
            {err && "invalid email or password"}

            <button onClick={handleLogin} disabled={isLoading}>
              {isLoading ? <Loading /> : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const Home = () => <h1>Home</h1>;
const Profile = () => <h1>Profile</h1>;
const Register = () => <h1>Register</h1>;

const Navbar = () => (
  <ul>
    <li>
      <Link to="/">Home</Link>
    </li>
    <li>
      <Link to="/login">Login</Link>
    </li>
    <li>
      <Link to="/register">Register</Link>
    </li>
    <li>
      <Link to="/profile/123">Profile 123</Link>
    </li>
  </ul>
);

const Layout = () => {
  return (
    <div>
      <Navbar />
      <div style={{ display: "flex" }}>
        {/* <LeftBar /> */}
        <div style={{ flex: 6 }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <Home />
        },
        {
          path: "/profile/:id",
          element: <Profile />
        }
      ]
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/register",
      element: <Register />
    }
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}
