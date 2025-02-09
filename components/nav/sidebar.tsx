
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/images/logo.png";
import { usePathname } from "next/navigation";
import { navLinks } from "@/constants/navLinks";

const SideBar = () => {
  const pathName = usePathname();

  return (
    <aside className="w-1/7 bg-white text-gray-900 h-full p-4">
      {/* Sidebar Header */}

      <Image src={logo} alt="site-logo" className="w-[120px] pb-4 mx-auto" />
      {/* Navigation */}
      <nav className="mt-2">
        <ul className="space-y-2">
          {navLinks.map((link, index) => (
            <li key={index}>
              <Link
                href={link.href}
                className={`${
                  pathName === link.href
                    ? "bg-red-200 rounded-md flex  items-center gap-3 py-1 text-xs px-4  transition duration-200"
                    : "  flex  items-center gap-3 py-1 text-xs px-4  transition duration-200"
                }`}
              >
                <Image
                  src={link.icon}
                  alt={link.label}
                  width={18}
                  height={18}
                />
                <span className="font-medium text-black">{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default SideBar;
