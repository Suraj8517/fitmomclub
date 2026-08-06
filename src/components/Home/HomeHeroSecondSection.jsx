import { Link } from "react-router-dom";
import { useEffect ,useState,useRef} from "react";
import CommunityStatsSection from "./StatSection";
 
export default function HomeHeroSecondSection() {
  const [offsetY, setOffsetY] = useState(0)
  const containerRef = useRef(null)


  useEffect(() => {
     const handleScroll = () => {
       if (!containerRef.current) return
 
       const rect = containerRef.current.getBoundingClientRect()
       const windowHeight = window.innerHeight
 
       // Only compute while the section is anywhere near the viewport
       if (rect.top < windowHeight && rect.bottom > 0) {
         // How far the section has scrolled through the viewport, -1 to 1 roughly
         const progress = (rect.top - windowHeight) / (windowHeight + rect.height)
         setOffsetY(progress * 80) // 80 = parallax strength in px, tweak as needed
       }
     }
 
     handleScroll()
     window.addEventListener('scroll', handleScroll, { passive: true })
     window.addEventListener('resize', handleScroll)
 
     return () => {
       window.removeEventListener('scroll', handleScroll)
       window.removeEventListener('resize', handleScroll)
     }
   }, [])
  return (
    <section
      className="relative h-[110vh] w-full bg-[#F6F5F1] z-10 py-6 sm:py-8 lg:pb-25 lg:pt-10 mt-[-60vh] sm:mt-[-70vh] " 
    >
              <CommunityStatsSection/>
      
      <div className="max-w-3xl mx-auto px-6 sm:px-12 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl 2xl:text-6xl font-normal text-neutral-900 leading-tight tracking-tight mb-8">
          A Weight Loss Program Designed Just for You
        </h2>

        <p className="text-lg 2xl:text-2xl text-neutral-500 leading-relaxed max-w-2xl mx-auto mb-10">
          Your journey is unique, and so is our Best Online Weight Loss Fitness &amp; Diet Program
          for Women &amp; Moms. We tailor every workout and meal plan to your body, your goals,
          and your lifestyle. Rediscover your strength with the support you deserve.
        </p>

        <Link
          to="/fmc"
          className="inline-flex items-center justify-center rounded-full bg-teal-500 hover:bg-teal-600 active:bg-teal-700 transition-colors px-8 py-3.5 text-sm font-medium text-white shadow-sm"
         style={{
          background: "linear-gradient(90deg,#50ffaa,#00d4ff)",
          color: "#062019",
          letterSpacing: "0.02em",
          textDecoration: "none",
        }}>
          Learn more
        </Link>
      </div>
    </section>
  );
}