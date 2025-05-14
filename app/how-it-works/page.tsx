"use client"

import { useRef } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, CheckCircle2, Zap, Database, RefreshCw, BarChart2, Users } from "lucide-react"
import Link from "next/link"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: { duration: 2, repeat: Number.POSITIVE_INFINITY },
}

// Animated step component
const AnimatedStep = ({ number, title, description, icon: Icon, delay = 0 }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: "easeOut", delay },
        },
      }}
      className="relative"
    >
      {/* Connector line */}
      {number < 3 && (
        <motion.div
          initial={{ height: 0 }}
          animate={isInView ? { height: "100%" } : { height: 0 }}
          transition={{ duration: 0.8, delay: delay + 0.4 }}
          className="absolute left-[39px] top-20 h-full w-[2px] bg-primary/30"
          style={{ zIndex: 0 }}
        />
      )}

      <div className="relative z-10 flex items-start space-x-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground"
        >
          <span className="text-2xl font-bold">{number}</span>
        </motion.div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Icon className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-bold">{title}</h3>
          </div>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
    </motion.div>
  )
}

// Animated benefit card
const BenefitCard = ({ icon: Icon, title, items, delay = 0, color = "green" }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const colorClasses = {
    green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: "easeOut", delay },
        },
      }}
    >
      <Card className="h-full overflow-hidden">
        <CardContent className="p-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
            className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${colorClasses[color]}`}
          >
            <Icon className="h-6 w-6" />
          </motion.div>

          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5, delay: delay + 0.3 }}
            className="mb-4 text-2xl font-bold"
          >
            {title}
          </motion.h3>

          <motion.ul
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: delay + 0.4,
                },
              },
            }}
            className="space-y-4"
          >
            {items.map((item, index) => (
              <motion.li
                key={index}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.5, ease: "easeOut" },
                  },
                }}
                className="flex items-start"
              >
                <CheckCircle2 className="mr-2 h-6 w-6 flex-shrink-0 text-primary" />
                <span>{item}</span>
              </motion.li>
            ))}
          </motion.ul>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Animated workflow diagram
const WorkflowDiagram = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={staggerContainer}
      className="mx-auto my-16 max-w-4xl"
    >
      <div className="relative">
        {/* Connector lines */}
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: "100%" } : { width: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute left-0 top-1/2 h-1 w-full bg-primary/30"
        />

        <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              icon: Zap,
              title: "Connect",
              description: "Link your Strava and Notion accounts",
              delay: 0.1,
            },
            {
              icon: RefreshCw,
              title: "Sync",
              description: "Activities automatically transfer to Notion",
              delay: 0.3,
            },
            {
              icon: BarChart2,
              title: "Analyze",
              description: "Gain insights from your structured data",
              delay: 0.5,
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: "easeOut", delay: item.delay },
                },
              }}
              className="flex flex-col items-center text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: item.delay }}
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground"
              >
                <item.icon className="h-8 w-8" />
              </motion.div>
              <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// Animated feature showcase
const FeatureShowcase = ({ title, description, features, imagePosition = "right" }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={staggerContainer}
      className="py-16"
    >
      <div
        className={`grid gap-8 md:grid-cols-2 md:items-center ${imagePosition === "left" ? "md:flex-row-reverse" : ""}`}
      >
        <motion.div variants={fadeIn} className="space-y-4">
          <h3 className="text-2xl font-bold">{title}</h3>
          <p className="text-muted-foreground">{description}</p>

          <motion.ul
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.2,
                },
              },
            }}
            className="space-y-3"
          >
            {features.map((feature, index) => (
              <motion.li
                key={index}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.5, ease: "easeOut" },
                  },
                }}
                className="flex items-center"
              >
                <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M3.5 7L6 9.5L10.5 4.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {feature}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div style={{ y }} className="relative h-[300px] overflow-hidden rounded-lg border bg-muted">
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                {imagePosition === "right" ? (
                  <Database className="h-8 w-8 text-primary" />
                ) : (
                  <Users className="h-8 w-8 text-primary" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">Interactive demo coming soon</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function HowItWorksPage() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background" />
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-2 w-2 rounded-full bg-primary/20"
                initial={{
                  x: Math.random() * 100 - 50 + "%",
                  y: Math.random() * 100 - 50 + "%",
                }}
                animate={{
                  x: [Math.random() * 100 - 50 + "%", Math.random() * 100 - 50 + "%", Math.random() * 100 - 50 + "%"],
                  y: [Math.random() * 100 - 50 + "%", Math.random() * 100 - 50 + "%", Math.random() * 100 - 50 + "%"],
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

          <motion.div ref={heroRef} style={{ opacity, scale }} className="container px-4 md:px-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="flex flex-col items-center justify-center space-y-4 text-center"
            >
              <motion.div variants={fadeIn} className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  How NotionCoach Works
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Seamlessly connect your Strava workouts to Notion for better training insights
                </p>
              </motion.div>

              <motion.div animate={pulseAnimation} className="mt-8 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-muted-foreground">
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

        {/* Process Steps Section */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={staggerContainer}
              viewport={{ once: true, margin: "-100px" }}
              className="mx-auto max-w-3xl space-y-4 text-center"
            >
              <motion.div variants={fadeIn} className="space-y-2">
                <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm">
                  <span className="mr-1 h-2 w-2 rounded-full bg-primary"></span>
                  <span>Simple Process</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Three Simple Steps</h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-lg">
                  Getting started with NotionCoach is easy. Follow these three simple steps to connect your Strava
                  workouts to Notion.
                </p>
              </motion.div>
            </motion.div>

            <div className="mx-auto mt-16 max-w-3xl space-y-16">
              <AnimatedStep
                number={1}
                title="Connect Your Accounts"
                description="Link your Strava and Notion accounts to NotionCoach with just a few clicks. Our secure OAuth integration ensures your data remains private."
                icon={Zap}
                delay={0.1}
              />

              <AnimatedStep
                number={2}
                title="Customize Your Template"
                description="Choose how your workout data is organized in Notion. Select which metrics to track and how they're displayed in your workspace."
                icon={Database}
                delay={0.3}
              />

              <AnimatedStep
                number={3}
                title="Automatic Syncing"
                description="Your Strava activities automatically sync to your Notion workspace. No manual data entry required - just complete your workout and see it in Notion."
                icon={RefreshCw}
                delay={0.5}
              />
            </div>
          </div>
        </section>

        {/* Workflow Diagram */}
        <section className="w-full bg-muted/30 py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={staggerContainer}
              viewport={{ once: true }}
              className="mx-auto max-w-3xl space-y-4 text-center"
            >
              <motion.div variants={fadeIn} className="space-y-2">
                <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm">
                  <span className="mr-1 h-2 w-2 rounded-full bg-primary"></span>
                  <span>How It Works</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">The NotionCoach Workflow</h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-lg">
                  See how data flows seamlessly from your Strava activities to your Notion workspace
                </p>
              </motion.div>
            </motion.div>

            <WorkflowDiagram />
          </div>
        </section>

        {/* Feature Showcase */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={staggerContainer}
              viewport={{ once: true }}
              className="mx-auto max-w-3xl space-y-4 text-center"
            >
              <motion.div variants={fadeIn} className="space-y-2">
                <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm">
                  <span className="mr-1 h-2 w-2 rounded-full bg-primary"></span>
                  <span>Key Features</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Powerful Features</h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-lg">
                  Discover the powerful features that make NotionCoach the perfect tool for athletes and coaches
                </p>
              </motion.div>
            </motion.div>

            <div className="mx-auto max-w-5xl">
              <FeatureShowcase
                title="Customizable Notion Templates"
                description="Organize your workout data exactly how you want it in Notion"
                features={[
                  "Pre-built templates for different sports",
                  "Customizable fields and layouts",
                  "Automatic categorization of activities",
                  "Support for custom properties and relations",
                  "Easy to modify and extend",
                ]}
                imagePosition="right"
              />

              <FeatureShowcase
                title="Coach-Athlete Collaboration"
                description="Seamless collaboration between coaches and athletes"
                features={[
                  "Share workout data with your coach",
                  "Coach feedback directly in Notion",
                  "Training plan integration",
                  "Progress tracking and reporting",
                  "Privacy controls for shared data",
                ]}
                imagePosition="left"
              />
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="w-full bg-muted/30 py-12 md:py-24">
          <div className="container px-4 md:px-6">
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
                  <span>Benefits</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Benefits</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                  How NotionCoach helps athletes and coaches
                </p>
              </motion.div>
            </motion.div>

            <div className="mx-auto mt-12 grid gap-8 md:grid-cols-2">
              <BenefitCard
                icon={Zap}
                title="For Athletes"
                items={[
                  "Track all your workouts in one organized Notion database",
                  "Analyze trends and patterns in your training data",
                  "Set goals and monitor your progress over time",
                  "Share your training data with your coach for better feedback",
                  "Customize your workout tracking to match your needs",
                ]}
                delay={0.1}
                color="green"
              />

              <BenefitCard
                icon={Users}
                title="For Coaches"
                items={[
                  "Monitor all your athletes' training in one dashboard",
                  "Provide data-driven feedback based on actual performance",
                  "Track athlete progress and identify areas for improvement",
                  "Easily manage multiple athletes with organized data",
                  "Create custom training plans based on performance data",
                ]}
                delay={0.3}
                color="blue"
              />
            </div>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={staggerContainer}
              viewport={{ once: true }}
              className="mx-auto max-w-3xl space-y-4 text-center"
            >
              <motion.div variants={fadeIn} className="space-y-2">
                <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm">
                  <span className="mr-1 h-2 w-2 rounded-full bg-primary"></span>
                  <span>See It In Action</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">How It All Comes Together</h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-lg">
                  Watch how NotionCoach transforms your Strava activities into organized Notion databases
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-xl border bg-muted shadow-lg"
            >
              <div className="aspect-video w-full bg-muted">
                <div className="flex h-full w-full items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                      viewport={{ once: true }}
                      className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20"
                    >
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </motion.div>
                    <p className="text-muted-foreground">Interactive demo video coming soon</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full bg-muted/30 py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={staggerContainer}
              viewport={{ once: true }}
              className="mx-auto max-w-3xl space-y-4 text-center"
            >
              <motion.div variants={fadeIn} className="space-y-2">
                <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm">
                  <span className="mr-1 h-2 w-2 rounded-full bg-primary"></span>
                  <span>FAQ</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Frequently Asked Questions</h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-lg">
                  Find answers to common questions about NotionCoach
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              viewport={{ once: true }}
              className="mx-auto mt-12 max-w-3xl space-y-6"
            >
              {[
                {
                  question: "Do I need both Strava and Notion accounts?",
                  answer:
                    "Yes, NotionCoach connects your existing Strava and Notion accounts. You'll need active accounts on both platforms to use our service.",
                },
                {
                  question: "How often does NotionCoach sync my activities?",
                  answer:
                    "NotionCoach automatically syncs your activities shortly after they're uploaded to Strava. You can also manually trigger a sync anytime from your dashboard.",
                },
                {
                  question: "Can I customize what data gets synced to Notion?",
                  answer:
                    "You can choose which activity types to sync and what data fields to include in your Notion database.",
                },
                {
                  question: "Is there a limit to how many activities can be synced?",
                  answer:
                    "Our basic plan includes syncing for up to 100 activities per month. Premium plans offer unlimited syncing.",
                },
                {
                  question: "How secure is my data?",
                  answer:
                    "We take security seriously. NotionCoach uses OAuth for authentication and never stores your Strava or Notion passwords. All data transfers are encrypted.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease: "easeOut" },
                    },
                  }}
                  className="rounded-lg border bg-background p-6 shadow-sm"
                >
                  <h3 className="mb-2 text-lg font-medium">{item.question}</h3>
                  <p className="text-muted-foreground">{item.answer}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={staggerContainer}
              viewport={{ once: true }}
              className="mx-auto max-w-3xl rounded-2xl bg-primary p-8 text-primary-foreground md:p-12"
            >
              <motion.div variants={fadeIn} className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to transform your training?</h2>
                  <p className="mx-auto max-w-[600px] opacity-90 md:text-xl">
                    Join NotionCoach today and take your training to the next level.
                  </p>
                </div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="pt-4">
                  <Button asChild size="lg" variant="secondary" className="text-lg">
                    <Link href="/login">
                      Get Started <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
