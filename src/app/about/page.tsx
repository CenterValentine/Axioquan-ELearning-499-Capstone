import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const teamMembers = [
  {
    name: "Alex Cyril",
    role: "Backend • Placeholder",
    blurb: "Full-Stack Developer | API Engineer | Mobile App Enthusiast",
    image: "/images/developer-1.png",
    offsetY: 4,
  },
  {
    name: "Joseph Israel",
    role: "Backend • Expert",
    blurb: "Short bio placeholder text about contributions and focus areas.",
    image: "/images/developer-2.png",
    offsetY: 10,
  },
  {
    name: "Djimy Francillon",
    role: "Data • Placeholder",
    blurb: "Short bio placeholder text about contributions and focus areas.",
    image: "/images/developer-3.png",
    offsetY: 0,
  },
  {
    name: "David Valentine",
    role: "QA • Placeholder",
    blurb: "Short bio placeholder text about contributions and focus areas.",
    image: "/images/developer-4a.png",
    offsetY: 0,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16 border-b border-border/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <p className="text-sm uppercase tracking-[0.2em] text-primary font-semibold">
              About
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Meet the Team
            </h1>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              AxioQuan ELearning was built by four student developers. These
              cards are placeholders for their stories, roles, and achievements.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="rounded-2xl border border-border bg-card shadow-sm hover:shadow-lg transition-shadow p-6 flex flex-col gap-4"
                >
                  {member.image ? (
                    <div className="relative h-24 w-24 mx-auto overflow-hidden rounded-full border border-border/70 shadow-sm">
                      <Image
                        src={member.image}
                        alt={`${member.name} portrait`}
                        fill
                        sizes="96px"
                        className="object-cover"
                        style={{
                          objectPosition: `center ${-(member.offsetY ?? 0)}px`,
                        }}
                        priority={member.name === "Student Developer 2"}
                      />
                    </div>
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xl mx-auto">
                      {member.name.split(" ").pop()}
                    </div>
                  )}
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="text-sm text-primary font-medium">
                      {member.role}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {member.blurb}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center text-sm text-muted-foreground">
              Want to learn more?{" "}
              <Link
                href="/courses"
                className="text-primary font-semibold hover:underline"
              >
                Explore our courses
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
