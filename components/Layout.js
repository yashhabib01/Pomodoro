import Navbar from "./navbar/Navbar.js";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};
export default Layout;
