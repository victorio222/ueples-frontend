import { useEffect, useState } from "react";
import { useSidebar } from "../context/SidebarContext";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
// import NotificationDropdown from "../components/header/NotificationDropdown";
import UserDropdown from "../components/header/UserDropdown";
import { UserService } from "../api/services/userService";
import { getCookie } from "../utils/auth";

const AppHeader: React.FC = () => {
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const stored_id = localStorage.getItem("user_id");
      if (!stored_id) {
        setLoading(false);
        return;
      }

      try {
        const response = await UserService.getById(Number(stored_id));
        const result = response.data;

        setUser(result);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleToggle = () => {
    window.innerWidth >= 1024 ? toggleSidebar() : toggleMobileSidebar();
  };

  return (
    // <header
    //   className="sticky top-0 z-50 flex h-16 w-full items-center border-b border-gray-200 
    //   /* Light Mode: Yellow Gradient */
    //   bg-gradient-to-b from-yellow-500 to-yellow-400 
    //   /* Dark Mode: Solid Deep Gray/Black (Original Theme) */
    //   dark:border-gray-800 dark:bg-[#111827] dark:from-transparent dark:to-transparent
    //   px-4 lg:h-20 lg:px-6 transition-colors duration-300"
    // >

    <header
      className="sticky top-0 z-40 flex h-16 w-full items-center border-b-4 border-b-orange-400
      /* Light Mode: Yellow Gradient */
      bg-gradient-to-b bg-blue-950
      /* Dark Mode: Solid Deep Gray/Black (Original Theme) */
      dark:border-gray-800 dark:bg-[#111827] dark:from-transparent dark:to-transparent
      px-4 lg:h-20 lg:px-6 transition-colors duration-300"
    >
      {/* <div className="relative flex w-full items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg text-yellow-100 hover:bg-yellow-500 lg:border lg:border-yellow-200 dark:text-gray-400 dark:hover:bg-gray-800 dark:lg:border-gray-800"
            onClick={handleToggle}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {isMobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h10M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-4">
          <ThemeToggleButton />

          {loading ? (
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="hidden h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700 sm:block" />
            </div>
          ) : (
            <UserDropdown user={user} />
          )}
        </div>
      </div> */}

      <div className="relative flex w-full items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg text-blue-100 hover:bg-blue-900 lg:border lg:border-blue-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:lg:border-gray-800"
            onClick={handleToggle}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {isMobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h10M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-4">
          <ThemeToggleButton />

          {loading ? (
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="hidden h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700 sm:block" />
            </div>
          ) : (
            <UserDropdown user={user} />
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
