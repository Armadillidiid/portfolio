import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TerminalLine } from "@/components/terminal/terminal-line";
import { TerminalPrompt } from "@/components/terminal/terminal-prompt";
import { TerminalWindow } from "@/components/terminal/terminal-window";

export function HeroSection() {
  return (
    <TerminalWindow filename="about.md">
      <TerminalLine command="cat intro.txt" />

      <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
        <p>
          I am <span className="text-primary font-bold">Emmanuel Isenah</span>, a Software Developer
          specialized in engineering robust data pipelines and scalable backend architectures. My
          expertise lies at the intersection of performance and clean code, ensuring systems remain
          reliable under heavy throughput.
        </p>
        <p>
          With a focus on <span className="text-secondary font-semibold">Python</span> and
          high-performance data engineering, I transform complex schema mapping requirements into
          streamlined, automated workflows. I thrive on solving technical bottlenecks that hinder
          development velocity.
        </p>
        <p>
          Beyond raw code, I advocate for developer-centric environments where documentation and
          technical precision are treated as first-class citizens. I believe the best software is
          transparent, fast, and rewards curiosity through its internal structure.
        </p>
      </div>

      <div className="pt-4 flex flex-wrap gap-4">
        <Button
          render={
            <a href="#" className="font-bold">
              VIEW PROJECTS
              <ArrowRight aria-hidden="true" />
            </a>
          }
        />
        <Button
          variant="outline"
          render={
            <a href="mailto:emmanuel@isenah.example.com" className="font-bold">
              GET IN TOUCH
            </a>
          }
        />
      </div>

      <TerminalPrompt className="pt-2" />
    </TerminalWindow>
  );
}
