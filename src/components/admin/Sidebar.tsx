import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="px-8 py-4 text-2xl font-bold border-b border-gray-700">
        Admin Panel
      </div>
      <nav className="flex-grow p-4 space-y-2">
        <Link href="/admin" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Dashboard</Link>
        <Link href="/admin/buildings" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Buildings</Link>
        <Link href="/admin/blogs" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Blogs</Link>
        <Link href="/admin/enquiries" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Enquiries</Link>
        <Link href="/admin/homepage" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Homepage</Link>
        <Link href="/admin/cms" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">CMS</Link>
        <Link href="/admin/settings" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Settings</Link>
        <Link href="/admin/footer" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Footer</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
