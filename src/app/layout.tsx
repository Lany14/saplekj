import { Poppins } from "next/font/google";
import AuthProvider from "@/providers/AuthProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`dark:bg-black ${poppins.className}`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
