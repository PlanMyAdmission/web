import React from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";

const BASE_URL = "https://planmyadmission.com";
const DEFAULT_TITLE = "Plan My Admission | Study Abroad & Admissions Guidance";
const DEFAULT_DESCRIPTION =
  "Plan My Admission offers expert overseas education consulting with personalized university admissions guidance, student visa support, and AI-powered tools to simplify your study abroad journey.";
const DEFAULT_OG_IMAGE = "https://planmyadmission.com";

const ROUTE_META = {
  "/": {
    title: "Plan My Admission | Study Abroad & Admissions Guidance",
    description:
      "Plan My Admission offers expert overseas education consulting with personalized university admissions guidance, student visa support, and AI-powered tools to simplify your study abroad journey.",
  },
  "/home": {
    title: "Plan My Admission | Study Abroad & Admissions Guidance",
    description:
      "Plan My Admission offers expert overseas education consulting with personalized university admissions guidance, student visa support, and AI-powered tools to simplify your study abroad journey.",
  },
  "/contact": {
    title: "Contact Plan My Admission | Study Abroad Help",
    description:
      "Questions about studying abroad? Contact Plan My Admission for personalized guidance on colleges, courses, exams, and applications.",
  },
  "/about": {
    title: "About Plan My Admission | Study Abroad Experts",
    description:
      "Meet the team behind your study abroad journey. Learn about our mission and commitment to expert admissions guidance.",
  },
  "/pricing": {
    title: "Plan My Admission Pricing | Plans & Packages",
    description:
      "Explore Plan My Admission pricing and plans designed for students preparing for study abroad.",
  },
  "/for-institutions": {
    title: "Plan My Admission for Institutions",
    description:
      "Scale international student admissions with Plan My Admission’s AI-powered tools and counseling support.",
  },
  "/terms&conditions": {
    title: "Terms & Conditions | Plan My Admission",
    description:
      "Read the terms and conditions for using Plan My Admission services and website.",
  },
  "/privacy-policy": {
    title: "Privacy Policy | Plan My Admission",
    description:
      "Learn how Plan My Admission collects, uses, and safeguards your information.",
  },
  "/how-it-works": {
    title: "How It Works | Plan My Admission",
    description:
      "Understand how Plan My Admission guides you from university selection to admission.",
  },
  "/explore": {
    title: "Explore Universities | Plan My Admission",
    description:
      "Discover universities, courses, and destinations for your study abroad plans.",
  },
  "/ai-university-search": {
    title: "AI University Search | Plan My Admission",
    description:
      "Search universities by course and get AI-personalized recommendations from Plan My Admission.",
  },
  "/explore/university": {
    title: "University Explorer | Plan My Admission",
    description:
      "Explore detailed university profiles and programs to plan your admissions.",
  },
  "/blogs": {
    title: "Plan My Admission Blog | Study Abroad Insights",
    description:
      "Read the latest study abroad insights, tips, and updates from Plan My Admission.",
  },
  "/recommendations": {
    title: "Recommendations | Plan My Admission",
    description:
      "View personalized university recommendations based on your profile and goals.",
  },
};

const SEOManager = () => {
  const { pathname } = useLocation();
  const meta = ROUTE_META[pathname] || {};
  const title = meta.title || DEFAULT_TITLE;
  const description = meta.description || DEFAULT_DESCRIPTION;
  const canonical = `${BASE_URL}${pathname === "/" ? "" : pathname}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
    </Helmet>
  );
};

export default SEOManager;
