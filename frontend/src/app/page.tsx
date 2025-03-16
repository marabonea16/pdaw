import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 text-white w-full p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Image
            src="/university-logo.svg"
            alt="UPT logo"
            width={50}
            height={50}
            priority
          />
          <h1 className="text-xl font-bold">University Portal</h1>
        </div>
        <nav className="flex gap-8">
          <a href="/" className="hover:text-gray-400 transition-colors">Home</a>
          <a href="/about" className="hover:text-gray-400 transition-colors">About</a>
          <a href="/contact" className="hover:text-gray-400 transition-colors">Contact</a>
        </nav>
      </header>
      <main className="flex flex-col items-center justify-center flex-grow p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <section className="text-center sm:text-left">
          <h2 className="text-4xl font-bold mt-4">Welcome to University Portal</h2>
          <p className="text-lg mt-2">Connecting Students and Teachers</p>
        </section>
        <section className="text-center sm:text-left">
          <h2 className="text-2xl font-semibold mb-4">About Us</h2>
          <p className="text-sm">
            Our university portal is designed to facilitate seamless communication and collaboration between students and teachers. Access course materials, submit assignments, and stay updated with the latest announcements.
          </p>
        </section>
        <section className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/students"
          >
            <Image
              className="dark:invert"
              src="/file.svg"
              alt="Student Icon"
              width={20}
              height={20}
            />
            For Students
          </a>
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/teachers"
          >
            <Image
              className="dark:invert"
              src="/file.svg"
              alt="Teacher Icon"
              width={20}
              height={20}
            />
            For Teachers
          </a>
        </section>
      </main>
      <footer className="bg-gray-800 text-white w-full p-4 flex justify-center items-center">
        <p>&copy; 2025 University Portal. All rights reserved.</p>
      </footer>
    </div>
  );
}