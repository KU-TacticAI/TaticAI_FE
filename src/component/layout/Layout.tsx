import Header from "../header/Header";
import NavBar from "../nav/NavBar";
import "./Layout.css";

const Layout = ({children}: { children: React.ReactNode }) => {
  return (
      <div className="layout-wrapper">
        <Header/>
        <NavBar/>
        <div className="layout-content-wrapper">
          <div className="layout-content">
            {children}
          </div>
        </div>
      </div>
  );
};

export default Layout;
