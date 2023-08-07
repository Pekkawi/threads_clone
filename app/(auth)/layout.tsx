//to specify rules for the auth routes
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "../globals.css";

export const metadata = {
  title: "Threads",
  description: "nice project",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode; //we specify the paramater and the type of the children since we're using typescript
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-dark-1`}>
          {/*it will apply the inter font to everything inside the body */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
