import Link from 'next/link';
import { Mountain, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Mountain className="h-8 w-8 text-orange-500" />
              <span className="text-2xl font-bold">
                Monastery<span className="text-orange-500">360</span>
              </span>
            </div>
            <p className="text-gray-300 dark:text-gray-400 mb-4 max-w-md">
              Explore the rich cultural heritage of Sikkim's monasteries through immersive 
              360° virtual tours and discover the spiritual essence of the Himalayas.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-orange-500 transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-orange-500 transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986c6.618 0 11.986-5.368 11.986-11.986C24.003 5.367 18.635.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297L3.209 16.97c.876.806 2.027 1.297 3.323 1.297c2.322 0 4.207-1.882 4.207-4.207S10.854 9.854 8.532 9.854S4.325 11.736 4.325 14.058c0 .344.043.678.118 1.002l1.929-1.076c-.075-.324-.118-.658-.118-1.002c0-1.297 1.051-2.348 2.348-2.348s2.348 1.051 2.348 2.348S9.746 15.33 8.449 15.33z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/monasteries" className="text-gray-300 dark:text-gray-400 hover:text-orange-500 transition-colors">
                  Monasteries
                </Link>
              </li>
              <li>
                <Link href="/festivals" className="text-gray-300 dark:text-gray-400 hover:text-orange-500 transition-colors">
                  Festivals
                </Link>
              </li>
              <li>
                <Link href="/map" className="text-gray-300 dark:text-gray-400 hover:text-orange-500 transition-colors">
                  Interactive Map
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 dark:text-gray-400 hover:text-orange-500 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-orange-500" />
                <span className="text-gray-300 dark:text-gray-400">Gangtok, Sikkim, India</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-orange-500" />
                <span className="text-gray-300 dark:text-gray-400">+91 9876543210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-orange-500" />
                <span className="text-gray-300 dark:text-gray-400">info@monastery360.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            © 2025–2026 Monastery360. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-gray-400 dark:text-gray-500 hover:text-orange-500 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-400 dark:text-gray-500 hover:text-orange-500 text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
