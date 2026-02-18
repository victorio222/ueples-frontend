// import { useCallback, useEffect, useRef, useState } from "react";
// import { Link, useLocation } from "react-router";

// // Assume these icons are imported from an icon library
// import {
//   BoxCubeIcon,
//   CalenderIcon,
//   ChevronDownIcon,
//   DocsIcon,
//   FolderIcon,
//   GridIcon,
//   HorizontaLDots,
//   ListIcon,
//   PageIcon,
//   PieChartIcon,
//   PlugInIcon,
//   TableIcon,
//   UserCircleIcon,
//   UserIcon,
// } from "../icons";
// import { useSidebar } from "../context/SidebarContext";
// // import SidebarWidget from "./SidebarWidget";

// type NavItem = {
//   name: string;
//   icon: React.ReactNode;
//   path?: string;
//   subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
// };

// const navItems: NavItem[] = [
//   {
//     icon: <GridIcon />,
//     name: "Dashboard",
//     path: "/",
//     // subItems: [{ name: "Ecommerce", path: "/", pro: false }],
//   },
//   {
//     icon: <DocsIcon />,
//     name: "Upload Documents",
//     path: "/upload-documents",
//   },
//   {
//     icon: <FolderIcon />,
//     name: "Form 137",
//     path: "/form-137",
//   },
//     {
//     icon: <UserIcon />,
//     name: "User Management",
//     path: "/users",
//   },
//   // {
//   //   icon: <UserCircleIcon />,
//   //   name: "User Profile",
//   //   path: "/profile",
//   // },
//   // {
//   //   name: "Forms",
//   //   icon: <ListIcon />,
//   //   subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
//   // },
//   // {
//   //   name: "Tables",
//   //   icon: <TableIcon />,
//   //   subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
//   // },
//   // {
//   //   name: "Pages",
//   //   icon: <PageIcon />,
//   //   subItems: [
//   //     { name: "Blank Page", path: "/blank", pro: false },
//   //     { name: "404 Error", path: "/error-404", pro: false },
//   //   ],
//   // },
// ];

// const othersItems: NavItem[] = [
//   // {
//   //   icon: <PieChartIcon />,
//   //   name: "Charts",
//   //   subItems: [
//   //     { name: "Line Chart", path: "/line-chart", pro: false },
//   //     { name: "Bar Chart", path: "/bar-chart", pro: false },
//   //   ],
//   // },
//   // {
//   //   icon: <BoxCubeIcon />,
//   //   name: "UI Elements",
//   //   subItems: [
//   //     { name: "Alerts", path: "/alerts", pro: false },
//   //     { name: "Avatar", path: "/avatars", pro: false },
//   //     { name: "Badge", path: "/badge", pro: false },
//   //     { name: "Buttons", path: "/buttons", pro: false },
//   //     { name: "Images", path: "/images", pro: false },
//   //     { name: "Videos", path: "/videos", pro: false },
//   //   ],
//   // },
//   // {
//   //   icon: <PlugInIcon />,
//   //   name: "Authentication",
//   //   subItems: [
//   //     { name: "Sign In", path: "/signin", pro: false },
//   //     { name: "Sign Up", path: "/signup", pro: false },
//   //   ],
//   // },
// ];

// const AppSidebar: React.FC = () => {
//   const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
//   const location = useLocation();

//   const [openSubmenu, setOpenSubmenu] = useState<{
//     type: "main" | "others";
//     index: number;
//   } | null>(null);
//   const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
//     {},
//   );
//   const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

//   // const isActive = (path: string) => location.pathname === path;
//   const isActive = useCallback(
//     (path: string) => location.pathname === path,
//     [location.pathname],
//   );

//   useEffect(() => {
//     let submenuMatched = false;
//     ["main", "others"].forEach((menuType) => {
//       const items = menuType === "main" ? navItems : othersItems;
//       items.forEach((nav, index) => {
//         if (nav.subItems) {
//           nav.subItems.forEach((subItem) => {
//             if (isActive(subItem.path)) {
//               setOpenSubmenu({
//                 type: menuType as "main" | "others",
//                 index,
//               });
//               submenuMatched = true;
//             }
//           });
//         }
//       });
//     });

//     if (!submenuMatched) {
//       setOpenSubmenu(null);
//     }
//   }, [location, isActive]);

//   useEffect(() => {
//     if (openSubmenu !== null) {
//       const key = `${openSubmenu.type}-${openSubmenu.index}`;
//       if (subMenuRefs.current[key]) {
//         setSubMenuHeight((prevHeights) => ({
//           ...prevHeights,
//           [key]: subMenuRefs.current[key]?.scrollHeight || 0,
//         }));
//       }
//     }
//   }, [openSubmenu]);

//   const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
//     setOpenSubmenu((prevOpenSubmenu) => {
//       if (
//         prevOpenSubmenu &&
//         prevOpenSubmenu.type === menuType &&
//         prevOpenSubmenu.index === index
//       ) {
//         return null;
//       }
//       return { type: menuType, index };
//     });
//   };

//   const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
//     <ul className="flex flex-col gap-4">
//       {items.map((nav, index) => (
//         <li key={nav.name}>
//           {nav.subItems ? (
//             <button
//               onClick={() => handleSubmenuToggle(index, menuType)}
//               className={`menu-item group ${
//                 openSubmenu?.type === menuType && openSubmenu?.index === index
//                   ? "menu-item-active"
//                   : "menu-item-inactive"
//               } cursor-pointer ${
//                 !isExpanded && !isHovered
//                   ? "lg:justify-center"
//                   : "lg:justify-start"
//               }`}
//             >
//               <span
//                 className={`menu-item-icon-size  ${
//                   openSubmenu?.type === menuType && openSubmenu?.index === index
//                     ? "menu-item-icon-active"
//                     : "menu-item-icon-inactive"
//                 }`}
//               >
//                 {nav.icon}
//               </span>
//               {(isExpanded || isHovered || isMobileOpen) && (
//                 <span className="menu-item-text">{nav.name}</span>
//               )}
//               {(isExpanded || isHovered || isMobileOpen) && (
//                 <ChevronDownIcon
//                   className={`ml-auto w-5 h-5 transition-transform duration-200 ${
//                     openSubmenu?.type === menuType &&
//                     openSubmenu?.index === index
//                       ? "rotate-180 text-brand-500"
//                       : ""
//                   }`}
//                 />
//               )}
//             </button>
//           ) : (
//             nav.path && (
//               <Link
//                 to={nav.path}
//                 className={`menu-item group ${
//                   isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
//                 }`}
//               >
//                 <span
//                   className={`menu-item-icon-size ${
//                     isActive(nav.path)
//                       ? "menu-item-icon-active"
//                       : "menu-item-icon-inactive"
//                   }`}
//                 >
//                   {nav.icon}
//                 </span>
//                 {(isExpanded || isHovered || isMobileOpen) && (
//                   <span className="menu-item-text">{nav.name}</span>
//                 )}
//               </Link>
//             )
//           )}
//           {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
//             <div
//               ref={(el) => {
//                 subMenuRefs.current[`${menuType}-${index}`] = el;
//               }}
//               className="overflow-hidden transition-all duration-300"
//               style={{
//                 height:
//                   openSubmenu?.type === menuType && openSubmenu?.index === index
//                     ? `${subMenuHeight[`${menuType}-${index}`]}px`
//                     : "0px",
//               }}
//             >
//               <ul className="mt-2 space-y-1 ml-9">
//                 {nav.subItems.map((subItem) => (
//                   <li key={subItem.name}>
//                     <Link
//                       to={subItem.path}
//                       className={`menu-dropdown-item ${
//                         isActive(subItem.path)
//                           ? "menu-dropdown-item-active"
//                           : "menu-dropdown-item-inactive"
//                       }`}
//                     >
//                       {subItem.name}
//                       <span className="flex items-center gap-1 ml-auto">
//                         {subItem.new && (
//                           <span
//                             className={`ml-auto ${
//                               isActive(subItem.path)
//                                 ? "menu-dropdown-badge-active"
//                                 : "menu-dropdown-badge-inactive"
//                             } menu-dropdown-badge`}
//                           >
//                             new
//                           </span>
//                         )}
//                         {subItem.pro && (
//                           <span
//                             className={`ml-auto ${
//                               isActive(subItem.path)
//                                 ? "menu-dropdown-badge-active"
//                                 : "menu-dropdown-badge-inactive"
//                             } menu-dropdown-badge`}
//                           >
//                             pro
//                           </span>
//                         )}
//                       </span>
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </li>
//       ))}
//     </ul>
//   );

//   return (
//     <aside
//       className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
//         ${
//           isExpanded || isMobileOpen
//             ? "w-[290px]"
//             : isHovered
//               ? "w-[290px]"
//               : "w-[90px]"
//         }
//         ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
//         lg:translate-x-0`}
//       onMouseEnter={() => !isExpanded && setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div
//         className={`py-8 flex justify-center`}
//       >
//         <Link to="/">
//           {isExpanded || isHovered || isMobileOpen ? (
//             <>
//               <div className="dark:hidden w-full flex flex-col items-center justify-center gap-2">
//                 <img
//                   className="dark:hidden"
//                   src="/images/logo/uep-logo.png"
//                   alt="Logo"
//                   width={70}
//                   height={70}
//                 />
//                 <h1 className="text-lg font-semibold text-slate-700">UEP Student Records</h1>
//               </div>
//               <div className="dark:dark w-full flex flex-col items-center justify-center gap-2">
//                 <img
//                   className="hidden dark:block"
//                   src="/images/logo/uep-logo.png"
//                   alt="Logo"
//                   width={70}
//                   height={70}
//                 />
//                 <h1 className="text-lg hidden dark:block font-semibold text-brand-50">UEP Student Records</h1>
//               </div>
//             </>
//           ) : (
//             <img
//               src="/images/logo/uep-logo.png"
//               alt="Logo"
//               width={52}
//               height={52}
//             />
//           )}
//         </Link>
//       </div>
//       <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
//         <nav className="mb-6">
//           <div className="flex flex-col gap-4">
//             <div>
//               <div>
//                 <div className="dark:hidden border w-full mb-5"></div>
//                 <div className="hidden dark:block border border-gray-400 w-full mb-5"></div>
//               </div>
//               <h2
//                 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
//                   !isExpanded && !isHovered
//                     ? "lg:justify-center"
//                     : "justify-start"
//                 }`}
//               >
//                 {isExpanded || isHovered || isMobileOpen ? (
//                   "Menu"
//                 ) : (
//                   <HorizontaLDots className="size-6" />
//                 )}
//               </h2>
//               {renderMenuItems(navItems, "main")}
//             </div>
//             <div className="">
//               <h2
//                 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
//                   !isExpanded && !isHovered
//                     ? "lg:justify-center"
//                     : "justify-start"
//                 }`}
//               >
//                 {/* {isExpanded || isHovered || isMobileOpen ? (
//                   "Others"
//                 ) : (
//                   <HorizontaLDots />
//                 )} */}
//               </h2>
//               {renderMenuItems(othersItems, "others")}
//             </div>
//           </div>
//         </nav>
//         {/* {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null} */}
//       </div>
//     </aside>
//   );
// };

// export default AppSidebar;











import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  ChevronDownIcon,
  DocsIcon,
  FolderIcon,
  GridIcon,
  HorizontaLDots,
  UserIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  roles?: string[]; // Define which roles can see this
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <DocsIcon />,
    name: "Upload Documents",
    path: "/upload-documents",
  },
  {
    icon: <FolderIcon />,
    name: "Form 137",
    path: "/form-137",
  },
  {
    icon: <UserIcon />,
    name: "User Management",
    path: "/users",
    roles: ["Admin", "Principal", "Secretary"],
  },
];

const othersItems: NavItem[] = [
  // Add items here later if needed
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  // Get the role from localStorage
  const userRole = localStorage.getItem("user_role");

  // Filter items based on user role
  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(userRole || "");
  });

  const filteredOthersItems = othersItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(userRole || "");
  });

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? filteredNavItems : filteredOthersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ type: menuType as "main" | "others", index });
              submenuMatched = true;
            }
          });
        }
      });
    });
    if (!submenuMatched) setOpenSubmenu(null);
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prev) => {
      if (prev?.type === menuType && prev?.index === index) return null;
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
            >
              <span className={`menu-item-icon-size ${openSubmenu?.type === menuType && openSubmenu?.index === index ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <>
                  <span className="menu-item-text">{nav.name}</span>
                  <ChevronDownIcon className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType && openSubmenu?.index === index ? "rotate-180 text-brand-500" : ""}`} />
                </>
              )}
            </button>
          ) : (
            nav.path && (
              <Link to={nav.path} className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}>
                <span className={`menu-item-icon-size ${isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => { subMenuRefs.current[`${menuType}-${index}`] = el; }}
              className="overflow-hidden transition-all duration-300"
              style={{ height: openSubmenu?.type === menuType && openSubmenu?.index === index ? `${subMenuHeight[`${menuType}-${index}`]}px` : "0px" }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link to={subItem.path} className={`menu-dropdown-item ${isActive(subItem.path) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"}`}>
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen || isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="py-8 flex justify-center">
        <Link to="/" className="flex flex-col items-center gap-3">
          <img src="/images/logo/uep-logo.png" alt="UEP Logo" width={isExpanded || isHovered || isMobileOpen ? 70 : 52} />
          {(isExpanded || isHovered || isMobileOpen) && (
            <div className="text-center">
              <h1 className="text-lg font-bold text-[#003366] dark:text-white leading-tight">UEP Records</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Northern Samar</p>
            </div>
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto no-scrollbar">
        <nav className="mb-6">
          <hr className="mb-6 border-gray-100 dark:border-gray-800" />
          <div className="flex flex-col gap-4">
            <h2 className={`mb-4 text-xs uppercase text-gray-400 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
              {isExpanded || isHovered || isMobileOpen ? "Main Menu" : <HorizontaLDots className="size-6" />}
            </h2>
            {renderMenuItems(filteredNavItems, "main")}

            {filteredOthersItems.length > 0 && (
              <div className="mt-4">
                <h2 className="mb-4 text-xs uppercase text-gray-400">Others</h2>
                {renderMenuItems(filteredOthersItems, "others")}
              </div>
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;