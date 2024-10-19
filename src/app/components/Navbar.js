'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path ? "bg-white text-black rounded-md px-3 py-2" : "text-white hover:bg-gray-700 hover:text-white rounded-md px-3 py-2";
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">Attendance System</div>
        <ul className="flex space-x-4">
          <li><Link href="/atteninfo" className={isActive('/atteninfo')}>AttenInfo</Link></li>
          <li><Link href="/attendancelogs" className={isActive('/attendancelogs')}>Attendance Logs</Link></li>
          <li><Link href="/devicelogs" className={isActive('/devicelogs')}>Device Logs</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
