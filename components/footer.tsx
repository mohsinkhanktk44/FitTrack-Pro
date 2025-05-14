"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export function Footer() {
  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      viewport={{ once: true }}
      className="w-full border-t bg-background"
    >
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Main footer content */}
        <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-4 lg:py-16">
          {/* Column 1: Brand */}
          <motion.div variants={fadeIn} className="space-y-4">
            <h3 className="text-lg font-bold">NotionCoach</h3>
            <p className="text-sm text-muted-foreground text-center max-w-xs mx-auto">
              Connecting your Strava workouts to Notion for better training
              insights.
            </p>
            <div className="flex justify-center items-start space-x-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </motion.div>

          {/* Column 2: Product */}
          <motion.div variants={fadeIn} className="space-y-4">
            <h3 className="text-lg font-bold">Product</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/how-it-works"
                  className="text-muted-foreground hover:text-foreground"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Testimonials
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Column 3: Resources */}
          <motion.div variants={fadeIn} className="space-y-4">
            <h3 className="text-lg font-bold">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Guides
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  API Documentation
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Column 4: Company */}
          <motion.div variants={fadeIn} className="space-y-4">
            <h3 className="text-lg font-bold">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Privacy & Terms
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Footer bottom: copyright and links */}
        <motion.div
          variants={fadeIn}
          className="flex flex-col items-center justify-between border-t py-8 md:flex-row"
        >
          <p className="mb-4 text-sm text-muted-foreground md:mb-0">
            &copy; {new Date().getFullYear()} NotionCoach. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Cookies
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
