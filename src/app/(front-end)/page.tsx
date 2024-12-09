import { Metadata } from "next";
import Hero from "@/components/FrontEnd/Site/Hero";
// import Brands from "@/components/Brands";
// import Feature from "@/components/Features";
// import About from "@/components/About";
// import FeaturesTab from "@/components/FeaturesTab";
// import FunFact from "@/components/FunFact";
// import Integration from "@/components/Integration";
// import CTA from "@/components/CTA";
// import FAQ from "@/components/FAQ";
import Pricing from "@/components/FrontEnd/Site/Pricing";
// import Contact from "@/components/Contact";
// import Blog from "@/components/Blog";
import Testimonial from "@/components/FrontEnd/Site/Testimonial";

export const metadata: Metadata = {
  title: "Abys Agrivet Animal Health Clinic",
  description: "Caring for Every Paw, Tail, and Whisker with Heart",
  // other metadata
};

export default function Home() {
  return (
    <main>
      <Hero />
      <Pricing />
      {/* <Brands /> */}
      {/* <Feature />  */}
      {/* <About /> */}
      {/* <FeaturesTab /> */}
      {/* <FunFact /> */}
      {/* <Integration /> */}
      {/* <CTA /> */}
      {/* <FAQ /> */}
      <Testimonial />

      {/* <Contact /> */}
      {/* <Blog /> */}
    </main>
  );
}
