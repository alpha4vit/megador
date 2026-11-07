import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/features/header";
import { Footer } from "@/components/features/footer";
import { FeedbackModalProvider } from "@/contexts/FeedbackModalContext";
import { CartProvider } from "@/contexts/CartContext";
import { ToastProvider } from "@/contexts/ToastContext";
import FeedbackModal from "@/components/features/feedback-modal";
import FloatingCart from "@/components/features/floating-cart";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MEGADOR - Ворота, заборы и автоматика в Минске",
    template: "%s | MEGADOR",
  },
  description: "Производство и установка секционных, откатных и распашных ворот, заборов и автоматики в Минске и Беларуси. Официальный партнер Alutech. Гарантия качества.",
  keywords: ["ворота минск", "секционные ворота", "откатные ворота", "заборы", "автоматика для ворот", "alutech", "ворота под ключ"],
  authors: [{ name: "MEGADOR" }],
  creator: "MEGADOR",
  publisher: "MEGADOR",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ru_BY",
    url: "https://megador.by",
    title: "MEGADOR - Ворота, заборы и автоматика в Минске",
    description: "Производство и установка ворот, заборов и автоматики с гарантией качества",
    siteName: "MEGADOR",
  },
  twitter: {
    card: "summary_large_image",
    title: "MEGADOR - Ворота, заборы и автоматика",
    description: "Производство и установка ворот, заборов и автоматики с гарантией качества",
  },
  verification: {
    google: "placeholder-google-verification-code",
    yandex: "3b131d55a0cd1a2a",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ToastProvider>
          <CartProvider>
            <FeedbackModalProvider>
              <Header />
              <main className="flex-1 pt-16 sm:pt-20">{children}</main>
              <Footer />
              <FeedbackModal />
              <FloatingCart />
            </FeedbackModalProvider>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
