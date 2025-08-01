import Header from "../header/Header";
import NavBar from "../nav/NavBar";
import "./Layout.css";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="layout-wrapper">
      <Header />
      <NavBar />
      {children}
    </div>
);

export default Layout;
