import { Trophy, Flame, Video, MessageCircle } from "lucide-react";

const FEATURES = [
  {
    icon: Trophy,
    title: "Success Stories",
    description: "Real transformations from moms like you.",
  },
  {
    icon: Flame,
    title: "Challenges",
    description: "Weekly fitness challenges with leaderboards to push you further.",
  },
  {
    icon: Video,
    title: "Live Events",
    description: "Webinars and expert Q&A sessions.",
  },
  {
    icon: MessageCircle,
    title: "Member Discussions",
    description: "Engage with other moms in live discussions and forums.",
  },
];

export default function CommunityFeatures() {
  return (
    
    <section className="w-full bg-[#F6F5F1] px-6 py-6 sm:px-10 lg:px-16">
        <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient
            id="icon-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#00D1B8" />
            <stop offset="100%" stopColor="#017265" />
          </linearGradient>
        </defs>
      </svg>
      <style>{`
        .cf-sans {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", ui-sans-serif, system-ui, sans-serif;
        }
      `}</style>
      <div className="mx-auto max-w-3xl text-center mb-6 sm:mb-8">
<h2 className="text-center text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f] mb-4 sm:mb-6" >
    What You’ll Find in Our Community
</h2>
<p className="mx-auto max-w-3xl text-center text-[15px] font-normal leading-relaxed text-[#4b5468] sm:text-[16px]">
    Our community is more than just a space to share stories—it’s a hub of activities, challenges, and resources to help you stay motivated on your fitness journey. Here’s what you’ll discover:
</p>
      </div>

      <div className="mx-auto bg-white max-w-4xl py-6 px-6 rounded-[2rem] sm:py-10 sm:px-10 lg:py-12 lg:px-12  ">
        <div className="grid grid-cols-2 gap-y-16 sm:grid-cols-2 sm:gap-y-16 lg:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col items-center text-center">
              <Icon
                className="h-12 w-12 text-[#1d1d1f] sm:h-14 sm:w-14"
                strokeWidth={1.25}
                stroke="url(#icon-gradient)"
                fill="none"
              />

              <h3 className="cf-sans mt-2 text-[19px] font-medium leading-snug text-[#3c4257] sm:mt-4 sm:text-[14px]">
                {title}
              </h3>

              <p className="cf-sans mt-2 max-w-[150px] text-[15px] font-normal leading-relaxed text-[#4b5468] sm:max-w-[240px] sm:text-[12px]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}