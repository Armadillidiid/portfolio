import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TerminalLine } from "@/components/terminal/terminal-line";
import { TerminalPrompt } from "@/components/terminal/terminal-prompt";
import { TerminalWindow } from "@/components/terminal/terminal-window";
import { Link } from "@tanstack/react-router";

export function HeroSection() {
  return (
    <TerminalWindow filename="about.md">
      <TerminalLine command="cat about.md" />

      <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
        <div className="relative grid grid-cols-1 items-start gap-6 md:grid-cols-[minmax(0,1fr)_19rem] md:gap-10">
          <div>
            <div className="flex items-start justify-between gap-3">
              <p>
                Hi 👋, I'm <span className="text-primary font-bold">Emmanuel Isenah</span>, a
                cloud/DevOps engineer passionate about building serverless applications and
                automated CI/CD pipelines that helps teams ship software faster.{" "}
              </p>
              <div className="md:hidden shrink-0">
                <div className="relative overflow-hidden h-14 w-14 rounded-[9999px] ring-1 ring-border">
                  <img
                    src="/pfp.webp"
                    alt="Portrait of Emmanuel Isenah"
                    width={56}
                    height={56}
                    loading="eager"
                    decoding="async"
                    className="relative z-10 block !m-0 h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>

            <p className="mt-4">
              I work primarily across the TypeScript ecosystem with Node.js, React and AWS CDK{" "}
              <small>(no terraform yet)</small>.
            </p>
            <p className="mt-4">
              As an <span className="text-secondary font-semibold">AWS Community Builder</span>, I
              enjoy sharing what I learn about modern DevOps practices for the cloud. I'm also a
              strong believer in open source and the community that makes much of today's software
              possible.
            </p>
            <p className="mt-4">
              When I'm not shipping code, you'll probably find me tinkering with linux, ricing a
              tiling window manager, or customizing a new neovim plugin.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="relative overflow-hidden aspect-[3/4] w-full rounded-[1.5rem] ring-1 ring-border">
              <img
                src="/pfp.webp"
                alt="Portrait of Emmanuel Isenah"
                width={720}
                height={960}
                loading="eager"
                decoding="async"
                className="relative z-10 block !m-0 h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 flex flex-wrap gap-4">
        <Button
          size="xl"
          nativeButton={false}
          render={
            <Link to="/blog" className="font-bold uppercase">
              VIEW BLOG
              <ArrowRight aria-hidden="true" />
            </Link>
          }
        />
        <Button
          size="xl"
          variant="outline"
          nativeButton={false}
          render={
            <a href="mailto:hello@emmanuelisenah.com" className="font-bold uppercase">
              GET IN TOUCH
            </a>
          }
        />
      </div>

      <TerminalPrompt className="pt-2" />
    </TerminalWindow>
  );
}
