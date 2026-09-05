import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import API from "../../api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface UserDropdownProps {
  user: any;
}

export default function UserDropdown({ user }: UserDropdownProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const handleLogout = async () => {
    try {
      // Call the Backend to clear HttpOnly cookies
      await API.auth.logout(user.email);
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_role');
      
      navigate("/signin");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-300">
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          {user.user_image ? (
            <img src={`${API_BASE_URL}/uploads/user_profiles/${user.user_image}`} alt={`${user.first_name} ${user.last_name}`} className="h-full w-full object-cover" />
          ) : (
            <span className="text-sm font-semibold text-gray-500">{user.first_name[0]}{user.last_name[0]}</span>
          )}
        </span>
        <span className="block mr-1 text-gray-200 font-medium text-theme-sm">{`${user.first_name} ${user.last_name}`}</span>
        {/* <span className="block mr-1 text-gray-700 font-medium text-theme-sm">{`${user.first_name} ${user.last_name}`}</span> */}
        <svg className={`transition-transform ${isOpen ? "rotate-180" : ""}`} width="18" height="20" viewBox="0 0 18 20" fill="none" stroke="white">
          <path d="M4.3125 8.65625L9 13.3437L13.6875 8.65625" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <Dropdown isOpen={isOpen} onClose={closeDropdown} className="absolute right-0 mt-[17px] w-[260px] p-3">
        <div className="px-3 py-2">
          <span className="block font-medium text-gray-700 dark:text-gray-300">{user.first_name} {user.last_name}</span>
          <span className="mt-0.5 block text-theme-xs text-gray-400">{user.email}</span>
        </div>
        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem tag="a" to="/profile" onItemClick={closeDropdown} className="flex items-center gap-3 px-3 py-2 text-theme-sm dark:text-gray-300 dark:hover:text-gray-800 rounded-sm">
               Edit profile
            </DropdownItem>
          </li>
        </ul>
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 mt-3 text-theme-sm text-gray-700 dark:text-gray-300 hover:cursor-pointer">Sign out</button>
      </Dropdown>
    </div>
  );
}