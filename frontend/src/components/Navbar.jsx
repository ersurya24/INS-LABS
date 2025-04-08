// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
// import { Button } from "./ui/button";
// import toast from "react-hot-toast";
// import CRMLogo from "./Logo";

// const Navbar = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     try {
//       logout();
//       toast.success("Logged out successfully");
//       navigate("/login");
//     } catch (error) {
//       toast.error("Failed to logout");
//     }
//   };

//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-2xs">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex items-center">
//             <Link to="/" className="text-xl font-bold text-gray-800">
//               <CRMLogo />
//             </Link>
//           </div>

//           <div className="flex items-center space-x-4">
//             {user ? (
//               <>
//                 <span className="text-gray-600 mr-10">
//                   <span className="ml-3">{user.name.toUpperCase()}</span>
//                   <span className="ml-1 font-semibold">
//                     {user.role.toUpperCase()}
//                   </span>
//                 </span>
//                 <Button onClick={handleLogout} className="  cursor-pointer">
//                   LOGOUT
//                 </Button>
//               </>
//             ) : (
//               <>
//                 <Link to="/login">
//                   <Button variant="secondary" className="cursor-pointer">
//                     LOGIN
//                   </Button>
//                 </Link>
//                 <Link to="/register">
//                   <Button className="cursor-pointer">REGISTER</Button>
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import CRMLogo from "./Logo";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 border-b shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-extrabold text-white tracking-wide">
              <CRMLogo />
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-white mr-10 text-sm font-medium tracking-wide">
                  <span className="ml-3">{user.name.toUpperCase()}</span>
                  <span className="ml-2 px-2 py-1 bg-white text-indigo-600 rounded-full font-semibold text-xs">
                    {user.role.toUpperCase()}
                  </span>
                </span>
                <Button
                  onClick={handleLogout}
                  className="bg-white text-indigo-600 hover:bg-gray-100 transition rounded-xl px-4 py-2 font-semibold"
                >
                  LOGOUT
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="secondary"
                    className="bg-white text-purple-700 hover:bg-gray-100 transition rounded-xl px-4 py-2 font-semibold"
                  >
                    LOGIN
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-indigo-800 text-white hover:bg-indigo-700 transition rounded-xl px-4 py-2 font-semibold">
                    REGISTER
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

