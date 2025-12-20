import { FaFacebookF, FaLinkedinIn, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import {Link} from 'react-router'

export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-10 hidden md:block">
      {/* Newsletter */}
      <div className="max-w-7xl mx-auto px-4 py-8 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Subscribe on our newsletter
          </h3>
          <p className="text-sm text-gray-600">
            Get daily news on upcoming offers from many suppliers all over the world
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Email"
              className="border border-gray-300 px-3 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Footer links */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-6 gap-8 border-t border-gray-200">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-blue-600 text-white px-2 py-1 rounded">Brand</div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Best information about the company goes here but now lorem ipsum is
          </p>
          <div className="flex space-x-3 text-gray-600 text-lg">
            <FaFacebookF />
            <FaLinkedinIn />
            <FaTwitter />
            <FaInstagram />
            <FaYoutube />
          </div>
        </div>

        {/* About */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">About</h4>
          <ul className="space-y-2 text-sm text-gray-600">
           <li><Link to="/about">About Us</Link> </li>
           <li><Link to="/hotofferepage">Explore store</Link> </li>
           <li><Link to="/cartpage">Cart</Link> </li>
           <li><Link to="/blogs">Blogs</Link> </li>
          </ul>
        </div>

        {/* Partnership */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Partnership</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link to="/about">About Us</Link> </li>
            <li><Link to="/services">Services</Link> </li>
            <li><Link to="/categoriesworkingon">categories</Link> </li>
            <li><Link to="/blogs">Blogs</Link> </li>
          </ul>
        </div>

        {/* Information */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Information</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link to="/comingsoon">Help Center</Link></li>
            <li><Link to="/moneyrefundcomingsoon">Money Refund</Link></li>
            <li><Link to="/workingonit">Shipping</Link> </li>
            <li><Link to="/contact">Contact us</Link> </li>
          </ul>
        </div>

        {/* For users */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">For users</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Register</Link></li>
            <li><Link to="/workingonit">Settings</Link> </li>
            <li><Link to="/comingsoon">My Orders</Link></li>
          </ul>
        </div>

        {/* Get app */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Get app</h4>
          <div className="flex flex-col gap-2">
            {/* <img src={appStoreImg} alt="App Store" className="w-32 cursor-pointer" />
            <img src={playStoreImg} alt="Google Play" className="w-32 cursor-pointer" /> */}
            <Link><h1 className="text-black font-bold">APP STORE</h1></Link>
            <Link><h1 className="text-green-800 font-bold">PLAY STORE</h1></Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-gray-200 text-center py-4 text-sm text-gray-600 border-t">
        © 2023 Ecommerce.
      </div>
    </footer>
  );
}
