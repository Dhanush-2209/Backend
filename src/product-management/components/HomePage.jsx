import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../api/productApi";
import DealOfTheDayPage from "./DealOfTheDay";
import ProductListPage from "./ProductListPage";

import heroImage1 from "../assets/landing_page1.png";
import heroImage2 from "../assets/landing_page2.png";

const landingPagesData = [
  {
    bgImage: heroImage1,
    subtitle: "FLAT 30% Off",
    title: (
      <>
        Explore <span className="text-brown-600">Healthy</span>
        <br />& Fresh Fruits
      </>
    ),
    theme: "light",
  },
  {
    bgImage: heroImage2,
    subtitle: "Deals and Promotions",
    title: "Sneakers & Athletic Shoes",
    theme: "dark",
  },
];

const HeroSection = ({ data, onScroll, isVisible }) => (
  <section
    className={`absolute inset-0 h-screen w-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
      isVisible ? "opacity-100" : "opacity-0"
    }`}
    style={{ backgroundImage: `url(${data.bgImage})` }}
  >
    {data.theme === "dark" && (
      <div className="absolute inset-0 bg-black/40"></div>
    )}

    <div
      className={`relative z-10 container mx-auto h-full flex flex-col justify-center
                   ${
                     data.theme === "light"
                       ? "items-center text-center text-slate-800"
                       : "items-start px-8 md:px-24 text-white"
                   }`}
    >
      <p className="text-base mb-2 font-light tracking-wider">
        {data.subtitle}
      </p>
      <h1
        className={`text-5xl md:text-7xl font-bold leading-tight mb-4 ${
          data.theme === "dark" && "font-serif"
        }`}
      >
        {data.title}
      </h1>
      <Link to="/shop">
        <button
          className={`mt-6 px-8 py-3 font-semibold transition-colors duration-300
                         ${
                           data.theme === "light"
                             ? "bg-white border border-gray-300 hover:bg-gray-600 hover:text-white rounded-lg"
                             : "bg-white text-gray-800 hover:bg-gray-200"
                         }`}
        >
          SHOP NOW
        </button>
      </Link>
    </div>

    <button
      onClick={onScroll}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-10"
    >
      <ChevronDown
        size={28}
        className={data.theme === "light" ? "text-gray-500" : "text-white"}
      />
    </button>
  </section>
);

const HomePage = () => {
  const [activeHero, setActiveHero] = useState(0);
  const [products, setProducts] = useState([]);

  const dealSectionRef = useRef(null);
  const productsSectionRef = useRef(null);

  useEffect(() => {
    const loadProducts = async () => {
      setProducts(await fetchProducts());
    };
    loadProducts();

    const interval = setInterval(() => {
      setActiveHero((current) => (current + 1) % landingPagesData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const scrollToDeals = () =>
    dealSectionRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-screen w-full">
        {landingPagesData.map((landingPages, index) => (
          <HeroSection
            key={index}
            data={landingPages}
            onScroll={scrollToDeals}
            isVisible={activeHero === index}
          />
        ))}
      </div>

      {/* Deals of the Day Section */}
      <section id="deals" ref={dealSectionRef} className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <DealOfTheDayPage />
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() =>
                productsSectionRef.current?.scrollIntoView({
                  behavior: "smooth",
                })
              }
              className="font-semibold text-gray-600 hover:text-blue-600 flex items-center mx-auto"
            >
              View All Products <ChevronDown className="ml-1" size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section
        id="new-arrivals"
        ref={productsSectionRef}
        className="py-16 bg-slate-50"
      >
        <div className="container mx-auto px-4">
          <ProductListPage />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
