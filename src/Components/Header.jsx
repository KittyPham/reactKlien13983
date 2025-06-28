import Button from "@/Components/Button";
import { confirmLogout } from "@/Utils/Helpers/SwalHelpers";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const Header = () => {
  const { user, setUser } = useAuthStateContext();

  const toggleProfileMenu = () => {
    const menu = document.getElementById("profileMenu");
    if (menu) menu.classList.toggle("hidden");
  };

  const handleLogout = () => {
    confirmLogout(() => {
      setUser(null); // Hapus user dari context (otomatis hapus dari localStorage juga)
      location.href = "/";
    });
  };

  return (
    <header className="bg-white shadow-md">
      <div className="flex justify-between items-center px-6 py-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Welcome</h1>
          <p className="text-sm text-gray-600">
            Login sebagai: <strong>{user?.role || "Guest"}</strong>
          </p>
        </div>
        <div className="relative">
          <Button onClick={toggleProfileMenu} className="w-8 h-8 rounded-full bg-gray-300 focus:outline-none flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">{user?.name?.charAt(0).toUpperCase() || "U"}</span>
          </Button>
          <div id="profileMenu" className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2 hidden">
            <div className="px-4 py-2 text-sm text-gray-500 border-b">{user?.name || "Unknown User"}</div>
            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Profile
            </a>
            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
