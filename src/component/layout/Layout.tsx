import Header from "../header/Header";
import NavBar from "../nav/NavBar";
import "./Layout.css";

const Layout = ({children}: { children: React.ReactNode }) => {
  return (
      <div className="layout-wrapper">
        <Header/>
        <NavBar/>
        <main className="layout-content">
          {children}
        </main>
      </div>
  );
};

export default Layout;
