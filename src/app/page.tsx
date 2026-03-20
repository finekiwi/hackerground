"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Users, BarChart3, ArrowRight, Terminal, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CARDS = [
  {
    icon: Zap,
    title: "해커톤",
    description: "진행 중이거나 예정된 해커톤을 확인하고 참가하세요.",
    href: "/hackathons",
    cta: "해커톤 보러가기",
    gradient: "from-violet-500/10 to-purple-500/10",
    iconColor: "text-violet-500",
  },
  {
    icon: Users,
    title: "팀 모집",
    description: "함께할 팀원을 찾거나 팀을 공개 모집하세요.",
    href: "/camp",
    cta: "팀 찾기",
    gradient: "from-sky-500/10 to-blue-500/10",
    iconColor: "text-sky-500",
  },
  {
    icon: Trophy,
    title: "랭킹",
    description: "해커톤 리더보드와 팀별 성적을 한눈에 확인하세요.",
    href: "/rankings",
    cta: "랭킹 보기",
    gradient: "from-amber-500/10 to-orange-500/10",
    iconColor: "text-amber-500",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero */}
      <motion.section
        className="w-full max-w-3xl text-center py-16 md:py-24"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-2 mb-6">
          <Terminal className="h-8 w-8" />
          <span className="text-2xl font-bold tracking-tight">Hackerground</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          명세서만 보고 구현하라
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
          데이콘 긴급 인수인계 해커톤 플랫폼입니다.
          <br />
          해커톤에 참가하고, 팀을 모집하고, 성적을 확인하세요.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/hackathons">
              해커톤 보러가기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/camp">팀 모집 보기</Link>
          </Button>
        </div>
      </motion.section>

      {/* Cards */}
      <motion.section
        className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 pb-16"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {CARDS.map(({ icon: Icon, title, description, href, cta, gradient, iconColor }) => (
          <motion.div key={href} variants={itemVariants}>
            <Link href={href} className="block h-full group">
              <Card className={`h-full bg-gradient-to-br ${gradient} border hover:shadow-md transition-all duration-200 group-hover:-translate-y-0.5`}>
                <CardContent className="p-6 flex flex-col h-full">
                  <div className={`mb-4 ${iconColor}`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">{title}</h2>
                  <p className="text-sm text-muted-foreground flex-1 mb-4">{description}</p>
                  <div className="flex items-center text-sm font-medium gap-1 group-hover:gap-2 transition-all">
                    {cta}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.section>

      {/* Stats bar */}
      <motion.section
        className="w-full border-t pt-8 pb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex flex-wrap justify-center gap-8 text-center">
          {[
            { value: "3", label: "해커톤", icon: Zap },
            { value: "4", label: "등록 팀", icon: Users },
            { value: "4", label: "리더보드 항목", icon: BarChart3 },
          ].map(({ value, label, icon: Icon }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <div className="text-left">
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
