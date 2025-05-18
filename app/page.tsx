"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart2, Compass, Dumbbell, Zap } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { AuthModal } from "@/components/registration-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const featureVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: { duration: 2, repeat: Number.POSITIVE_INFINITY },
};

// Animated feature card component
type FeatureCardProps = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  delay?: number;
};

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  delay = 0,
}: FeatureCardProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={featureVariants}
      transition={{ delay }}
      className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-md transition-all hover:shadow-lg"
    >
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>

      <motion.div
        className="absolute bottom-0 left-0 h-1 w-0 bg-primary"
        initial={{ width: 0 }}
        whileInView={{ width: "100%" }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      />
    </motion.div>
  );
};

// Animated background dots
const BackgroundDots = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-primary/20"
          initial={{
            x: Math.random() * 100 - 50 + "%",
            y: Math.random() * 100 - 50 + "%",
          }}
          animate={{
            x: [
              Math.random() * 100 - 50 + "%",
              Math.random() * 100 - 50 + "%",
              Math.random() * 100 - 50 + "%",
            ],
            y: [
              Math.random() * 100 - 50 + "%",
              Math.random() * 100 - 50 + "%",
              Math.random() * 100 - 50 + "%",
            ],
          }}
          transition={{
            duration: 20 + Math.random() * 30,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          style={{
            left: Math.random() * 100 + "%",
            top: Math.random() * 100 + "%",
            opacity: Math.random() * 0.5 + 0.2,
          }}
        />
      ))}
    </div>
  );
};

// Animated counter
const AnimatedCounter = ({
  value,
  duration = 2,
}: {
  value: number;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);
  const isInView = useInView(counterRef, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = Number.parseInt(value.toString().replace(/,/g, ""));
      const incrementTime = Math.floor((duration * 1000) / end);

      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start >= end) clearInterval(timer);
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return <span ref={counterRef}>{count.toLocaleString()}</span>;
};

// Animated stats section
const StatsSection = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={staggerContainer}
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-2 gap-8 md:grid-cols-4"
    >
      <motion.div variants={fadeIn} className="text-center">
        <div className="text-3xl font-bold text-primary">
          <AnimatedCounter value={5000} />+
        </div>
        <p className="text-sm text-muted-foreground">Active Users</p>
      </motion.div>

      <motion.div variants={fadeIn} className="text-center">
        <div className="text-3xl font-bold text-primary">
          <AnimatedCounter value={250000} />+
        </div>
        <p className="text-sm text-muted-foreground">Workouts Synced</p>
      </motion.div>

      <motion.div variants={fadeIn} className="text-center">
        <div className="text-3xl font-bold text-primary">
          <AnimatedCounter value={120} />+
        </div>
        <p className="text-sm text-muted-foreground">Coaches</p>
      </motion.div>

      <motion.div variants={fadeIn} className="text-center">
        <div className="text-3xl font-bold text-primary">
          <AnimatedCounter value={98} />%
        </div>
        <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
      </motion.div>
    </motion.div>
  );
};

// Animated device mockup
const DeviceMockup = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className="relative w-full max-w-md overflow-hidden rounded-xl border bg-background shadow-xl"
    >
      <div className="flex h-6 items-center border-b bg-muted/50 px-4">
        <div className="flex space-x-1">
          <div className="h-2 w-2 rounded-full bg-red-500" />
          <div className="h-2 w-2 rounded-full bg-yellow-500" />
          <div className="h-2 w-2 rounded-full bg-green-500" />
        </div>
      </div>
      <div className="p-4">
        <div className="mb-4 h-8 w-2/3 rounded bg-muted" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-5/6 rounded bg-muted" />
          <div className="h-4 w-4/6 rounded bg-muted" />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="h-20 rounded bg-muted" />
          <div className="h-20 rounded bg-muted" />
        </div>
        <div className="mt-6 space-y-2">
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-5/6 rounded bg-muted" />
          <div className="h-4 w-4/6 rounded bg-muted" />
        </div>
        <div className="mt-6 h-10 w-1/3 rounded bg-primary" />
      </div>
    </motion.div>
  );
};

// Animated testimonial
type TestimonialProps = {
  quote: string;
  author: string;
  role: string;
  delay?: number;
};

const Testimonial = ({ quote, author, role, delay = 0 }: TestimonialProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="rounded-lg border bg-background p-6 shadow-sm"
    >
      <div className="mb-4 text-lg font-medium italic text-muted-foreground">
        "{quote}"
      </div>
      <div className="font-semibold">{author}</div>
      <div className="text-sm text-muted-foreground">{role}</div>
    </motion.div>
  );
};

export default function Home() {
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const router = useRouter();

  const handleRoleSelect = (role: "coach" | "athlete") => {
    setRoleModalOpen(false);
    localStorage.setItem("userRole", role);
    router.push(`/sign-in?role=${role}`);
  };

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => {
    console.log("openmodal",isModalOpen,"test")
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-28 lg:py-32 xl:py-40">
          <BackgroundDots />

          <motion.div
            ref={heroRef}
            style={{ opacity, scale }}
            className="container mx-auto relative z-10 px-4 md:px-6"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="flex flex-col items-center space-y-8 text-center"
            >
              <motion.div variants={fadeIn} className="space-y-4">
                <motion.h1
                  className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                    backgroundSize: ["100%", "200%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                  style={{
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundImage:
                      "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary-foreground)), hsl(var(--primary)))",
                    backgroundSize: "200%",
                  }}
                >
                  Connect Your Strava Workouts to Notion
                </motion.h1>
                <motion.p
                  variants={fadeIn}
                  className="mx-auto max-w-[700px] text-xl text-muted-foreground"
                >
                  Seamlessly sync your training data between Strava and Notion
                  for better insights and coaching.
                </motion.p>
              </motion.div>

              <motion.div
                variants={fadeIn}
                className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button asChild size="lg" className="text-lg" onClick={() => setRoleModalOpen(true)}>
                    <Link href="/">
                      Login / Sign Up →
                    </Link>
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="text-lg"
                  >
                    <Link href="/how-it-works">Learn More</Link>
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div
                animate={pulseAnimation}
                className="mt-8 flex items-center justify-center"
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-muted-foreground"
                >
                  <path
                    d="M12 5L12 19M12 19L19 12M12 19L5 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="w-full py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={staggerContainer}
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col items-center justify-center space-y-4 text-center"
            >
              <motion.div variants={fadeIn} className="space-y-2">
                <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm">
                  <span className="mr-1 h-2 w-2 rounded-full bg-primary"></span>
                  <span>Powerful Features</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Everything you need to track and analyze
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  NotionCoach connects your favorite platforms to give you the
                  insights you need
                </p>
              </motion.div>
            </motion.div>

            <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-2">
              <FeatureCard
                icon={Zap}
                title="Automatic Syncing"
                description="Your Strava activities automatically sync to your Notion workspace"
                delay={0.1}
              />
              <FeatureCard
                icon={BarChart2}
                title="Detailed Analytics"
                description="Track your progress with comprehensive training metrics"
                delay={0.2}
              />
              <FeatureCard
                icon={Compass}
                title="Coach Integration"
                description="Share your training data with your coach for better feedback"
                delay={0.3}
              />
              <FeatureCard
                icon={Dumbbell}
                title="Training Insights"
                description="Get actionable insights to improve your performance"
                delay={0.4}
              />
            </div>
          </div>
        </section>

        {/* App Preview Section */}
        <section className="w-full bg-muted/30 py-20 md:py-28">
          <div className="container flex justify-center mx-auto px-4 md:px-4">
            <div className="grid w-[80%]  gap-12 md:grid-cols-2 md:gap-6">
              <motion.div
                initial="hidden"
                whileInView="visible"
                variants={staggerContainer}
                viewport={{ once: true }}
                className="flex flex-col justify-center space-y-4"
              >
                <motion.div variants={fadeIn} className="space-y-2">
                  <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm">
                    <span className="mr-1 h-2 w-2 rounded-full bg-primary"></span>
                    <span>Seamless Experience</span>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                    Your training data, organized
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    NotionCoach transforms your workout data into structured
                    information in Notion
                  </p>
                </motion.div>

                <motion.ul variants={staggerContainer} className="space-y-4">
                  {[
                    "Automatic activity categorization",
                    "Custom templates for different sports",
                    "Performance metrics and trends",
                    "Training load analysis",
                    "Coach feedback integration",
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      variants={fadeIn}
                      className="flex items-center"
                    >
                      <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                        >
                          <path
                            d="M3.5 7L6 9.5L10.5 4.5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      {item}
                    </motion.li>
                  ))}
                </motion.ul>

                <motion.div variants={fadeIn} className="pt-4">
                  <Button asChild>
                    <Link href="/how-it-works">
                      Learn how it works <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>

              <div className="flex justify-end ">
                <DeviceMockup />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-5xl">
              <StatsSection />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full bg-muted/30 py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={staggerContainer}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center space-y-4 text-center"
            >
              <motion.div variants={fadeIn} className="space-y-2">
                <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm">
                  <span className="mr-1 h-2 w-2 rounded-full bg-primary"></span>
                  <span>Testimonials</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  What our users say
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-lg">
                  Athletes and coaches love how NotionCoach transforms their
                  training
                </p>
              </motion.div>
            </motion.div>

            <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Testimonial
                quote="NotionCoach has completely transformed how I track my training. The Strava to Notion sync is seamless."
                author="Sarah Johnson"
                role="Marathon Runner"
                delay={0.1}
              />
              <Testimonial
                quote="As a coach, I can now easily monitor all my athletes' progress in one place. Game changer!"
                author="Michael Chen"
                role="Triathlon Coach"
                delay={0.2}
              />
              <Testimonial
                quote="The analytics and insights have helped me identify patterns in my training I never noticed before."
                author="Emma Rodriguez"
                role="Cyclist"
                delay={0.3}
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 md:py-28">
          <div className="container px-4 md:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={staggerContainer}
              viewport={{ once: true }}
              className="mx-auto max-w-3xl rounded-2xl bg-primary p-8 text-primary-foreground md:p-12"
            >
              <motion.div
                variants={fadeIn}
                className="flex flex-col items-center justify-center space-y-4 text-center"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                    Ready to transform your training?
                  </h2>
                  <p className="mx-auto max-w-[600px] opacity-90 md:text-xl">
                    Join NotionCoach today and take your training to the next
                    level.
                  </p>
                </div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="pt-4"
                >
                  {/* <Button
                    asChild
                    size="lg"
                    variant="secondary"
                    className="text-lg"
                  >
                    <Link href="/login">
                      Get Started <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button> */}
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <AuthModal isOpen={isModalOpen} onClose={closeModal} />

      {/* Role Selection Modal */}
      <Dialog open={roleModalOpen} onOpenChange={setRoleModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Choose your role</DialogTitle>
            <DialogDescription>
              Select how you want to use NotionCoach
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Button 
              className="w-full py-6"
              onClick={() => handleRoleSelect("coach")}
            >
              Continue as Coach 
            </Button>
            <Button 
              className="w-full py-6" 
              variant="outline"
              onClick={() => handleRoleSelect("athlete")}
            >
              Continue as Athlete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
