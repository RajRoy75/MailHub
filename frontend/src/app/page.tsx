import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  Zap,
  ShieldCheck,
  Globe,
  Mail,
  Inbox,
  Send,
  MessageSquare
} from 'lucide-react';
import { BACKEND_URL } from "@/lib/utils";
import Link from "next/link";

export default function MailhubLanding() {
  console.log(BACKEND_URL);
  return (
    <main className="relative h-screen w-full overflow-hidden bg-zinc-950 text-zinc-50 selection:bg-indigo-500/30">

      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-purple-600/10 blur-[120px]" />

      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative z-10 flex h-full flex-col px-6 md:px-12 lg:px-24 max-w-8xl mx-auto">

        <nav className="flex items-center justify-between py-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
              <Mail className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Mailhub</span>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            <a href="#" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">Features</a>
            <a href="#" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">Pricing</a>
            <a href="#" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">Changelog</a>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-zinc-400 sm:block">Already a user?</span>
            <Link href={"/auth/login"}>
              <Button variant="ghost" className="text-zinc-100 hover:bg-white/5 hover:text-white">
                Sign In
              </Button>
            </Link>
          </div>
        </nav>

        <div className="grid h-full flex-1 grid-cols-1 items-center gap-12 pb-20 lg:grid-cols-2">

          <div className="flex flex-col justify-center space-y-8">
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-700 space-y-6">
              <Badge variant="outline" className="w-fit border-indigo-500/30 bg-indigo-500/10 text-indigo-300 px-3 py-1">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
                v2.0 is now live
              </Badge>

              <h1 className="text-5xl font-extrabold tracking-tight leading-[1.1] sm:text-6xl lg:text-7xl">
                Email reimagined <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                  for the modern web.
                </span>
              </h1>

              <p className="max-w-md text-lg text-zinc-400 md:text-xl">
                Stop wrestling with clunky interfaces. Mailhub unifies your communication streams into a single, lightning-fast command center.
              </p>
            </div>

            <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-150">
              <Input
                type="email"
                placeholder="name@company.com"
                className="h-12 border-zinc-800 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-indigo-500"
              />
              <Button className="h-12 bg-white text-zinc-950 hover:bg-zinc-200 px-8 font-semibold">
                Get Access <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-6 text-sm text-zinc-500 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-zinc-400" />
                <span>Secure Encryption</span>
              </div>
              <Separator orientation="vertical" className="h-4 bg-zinc-800" />
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-zinc-400" />
                <span>AI Powered</span>
              </div>
            </div>
          </div>

          <div className="relative hidden h-full w-full items-center justify-center lg:flex perspective-1000">

            <div className="absolute h-[400px] w-[400px] rounded-full border border-zinc-800/50 opacity-50"></div>
            <div className="absolute h-[550px] w-[550px] rounded-full border border-zinc-800/30 opacity-30"></div>

            <div className="relative w-[400px] h-[500px]">

              <div className="absolute top-0 right-0 h-full w-full translate-x-8 translate-y-8 rotate-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm transition-transform duration-500 hover:translate-x-10 hover:rotate-12"></div>

              <div className="absolute inset-0 flex flex-col rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden animate-in zoom-in-95 duration-1000">

                <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-4 py-3">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                  </div>
                  <div className="text-xs text-zinc-500 font-mono">hub_dashboard.exe</div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-1 rounded-lg bg-white/5 p-3 border border-white/5">
                      <p className="text-xs text-zinc-500 mb-1">Inbox</p>
                      <p className="text-xl font-bold text-white">12</p>
                    </div>
                    <div className="flex-1 rounded-lg bg-white/5 p-3 border border-white/5">
                      <p className="text-xs text-zinc-500 mb-1">Archived</p>
                      <p className="text-xl font-bold text-zinc-400">1,284</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="group flex items-center gap-3 rounded-lg p-3 hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 cursor-pointer">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${i === 1 ? 'bg-indigo-500/20 text-indigo-300' : 'bg-zinc-800 text-zinc-500'}`}>
                          {i === 1 ? <Inbox className="h-5 w-5" /> : <Globe className="h-5 w-5" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-zinc-200">Team Update</p>
                            <p className="text-xs text-zinc-600">2m ago</p>
                          </div>
                          <p className="text-xs text-zinc-500 truncate">Project Vega is now live on production...</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="absolute bottom-6 right-6">
                    <div className="h-12 w-12 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/40 hover:scale-110 transition-transform cursor-pointer">
                      <Send className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -left-12 top-1/3 flex items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-900/90 p-3 pr-5 shadow-xl backdrop-blur-md animate-bounce delay-1000 duration-[3000ms]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-zinc-400">New Connection</p>
                  <p className="text-sm font-bold text-white">Sarah Joined</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
