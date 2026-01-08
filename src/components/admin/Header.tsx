const Header = () => {
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <div>
        {/* User menu can go here */}
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
