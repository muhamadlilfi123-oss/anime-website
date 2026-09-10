import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-darker border-t border-primary/20 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🎬</span>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AnimeVault
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Website nonton anime subtitle Indonesia terlengkap dan terupdate.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Navigasi</h3>
            <div className="space-y-2">
              <Link href="/ongoing" className="block text-gray-400 hover:text-primary text-sm transition-colors">Ongoing Anime</Link>
              <Link href="/complete" className="block text-gray-400 hover:text-primary text-sm transition-colors">Complete Anime</Link>
              <Link href="/schedule" className="block text-gray-400 hover:text-primary text-sm transition-colors">Jadwal Rilis</Link>
              <Link href="/genre" className="block text-gray-400 hover:text-primary text-sm transition-colors">Genre</Link>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Info</h3>
            <p className="text-gray-400 text-sm">
              Powered by Sanka Vollerei API
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Disclaimer: Website ini tidak menyimpan file apapun di server kami.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} AnimeVault. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
