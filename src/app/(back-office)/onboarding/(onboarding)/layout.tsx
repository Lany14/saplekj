import "flatpickr/dist/flatpickr.min.css";
import "@/css/poppins.css";
import "@/css/style.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Form Section */}
      <div className="w-full p-6 lg:w-[60%] lg:p-12">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-4 text-center text-2xl font-bold">
            Welcome to Our Platform
          </h1>
          {/* <h2 className="mb-6 text-2xl font-semibold">Complete Your Profile</h2> */}
          {/* Logo */}
          {/* <Image
          src="/assets/icons/logo-full.svg"
          height={40}
          width={160}
          alt="CarePluse Logo"
          className="mb-8"
        /> */}
          {children}

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} AbysAgrivet. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel - Image Section */}
      <div className="hidden bg-primary lg:block lg:w-[40%]">
        <div className="relative h-full">
          {/* <Image
            src="/assets/images/register-img.png"
            fill
            alt="Veterinary Care"
            className="object-cover"
            priority
          /> */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
        </div>
      </div>
    </div>
  );
}
