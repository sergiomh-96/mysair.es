"use client"

export function StickyContactButton() {
  // Use the official WhatsApp number for MYSAir
  const whatsappUrl = "https://wa.me/34673796768"

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-2xl hover:bg-[#128C7E] transition-all duration-300 hover:scale-110 group focus:outline-none focus:ring-4 focus:ring-green-300 md:bottom-8 md:right-8"
      aria-label="Contactar por WhatsApp"
    >
      {/* Pulse effect visible primarily on mobile to draw attention for CRO */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75 animate-ping -z-10 group-hover:hidden md:hidden"></span>

      {/* SVG for WhatsApp logo */}
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6 md:w-7 md:h-7"
      >
        <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.99L2 22l5.23-1.372a9.92 9.92 0 0 0 4.781 1.228h.005c5.502 0 9.985-4.478 9.986-9.984a9.96 9.96 0 0 0-2.923-7.059A9.914 9.914 0 0 0 12.012 2zm5.727 14.156c-.244.688-1.222 1.25-1.677 1.32-.416.064-.962.103-2.88-.66-2.451-.976-4.004-3.483-4.127-3.649-.122-.165-.989-1.322-.989-2.522 0-1.199.61-1.79.829-2.03.22-.24.476-.3.635-.3.159 0 .318 0 .458.006.146.006.342-.055.537.415.2.488.683 1.666.744 1.787.06.122.102.263.02.427-.08.165-.121.263-.243.403-.122.14-.256.312-.365.419-.122.12-.25.251-.108.496.143.242.637 1.05 1.373 1.708.948.847 1.748 1.11 2.01 1.243.263.132.415.11.567-.066.153-.177.659-.769.836-1.03.177-.263.354-.22.598-.128.244.092 1.544.73 1.807.86.262.13.438.196.5.305.06.11.06.635-.184 1.323z" />
      </svg>

      {/* Slide-out text label on hover for desktop */}
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 text-sm font-semibold transition-all duration-300 ease-in-out whitespace-nowrap hidden md:inline-block">
        WhatsApp
      </span>
    </a>
  )
}
