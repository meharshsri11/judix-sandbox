import { Github, Twitter, Linkedin } from 'lucide-react';

const footerLinks = {
  Product: ['Features', 'Pricing', 'Integrations', 'API'],
  Company: ['About Us', 'Careers', 'Blog', 'Contact'],
  Resources: ['Support', 'Documentation', 'Community', 'Status'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
};

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-900/50">
      <div className="container mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          <div className="md:col-span-2">
            <a href="#" className="flex items-center space-x-2">
              <span className="font-sora text-2xl font-bold">Judix</span>
            </a>
            <p className="mt-4 max-w-xs font-outfit text-gray-400">
              Streamlining legal processes with modern technology.
            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white"
                aria-label="GitHub"
              >
                <Github size={24} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white"
                aria-label="Twitter"
              >
                <Twitter size={24} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white"
                aria-label="LinkedIn"
              >
                <Linkedin size={24} />
              </a>
            </div>
          </div>
          <div className="col-span-1 grid grid-cols-2 gap-8 md:col-span-3 lg:grid-cols-4">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="font-sora font-semibold text-white">{title}</h3>
                <ul className="mt-4 space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="font-outfit text-gray-400 hover:text-white"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8 text-center">
          <p className="font-outfit text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Judix. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}