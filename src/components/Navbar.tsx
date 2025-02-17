// components/Navbar.tsx
const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">E-Commerce</h1>
      <div className="space-x-4">
        <button className="bg-white text-blue-600 px-4 py-2 rounded-md">
          Login
        </button>
        <button className="bg-white text-blue-600 px-4 py-2 rounded-md">
          Carrito
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
