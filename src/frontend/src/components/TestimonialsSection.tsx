import { Star } from "lucide-react";
import { motion } from "motion/react";

const testimonials = [
  {
    name: "Priya Sharma",
    city: "Mumbai",
    quote:
      "I earn ₹150-₹200 every month just by reading news during my morning commute. It's completely free and easy!",
    stars: 5,
    initials: "PS",
  },
  {
    name: "Rahul Gupta",
    city: "Delhi",
    quote:
      "Withdrawals are truly instant. I requested ₹90 on a Sunday evening and it was in my account within minutes.",
    stars: 5,
    initials: "RG",
  },
  {
    name: "Ananya Patel",
    city: "Ahmedabad",
    quote:
      "I recommend this to all my friends. Reading news I would read anyway — and getting paid for it? Amazing!",
    stars: 5,
    initials: "AP",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-foreground">
            What Our Readers Say
          </h2>
          <p className="text-muted-foreground mt-1">
            Join thousands of Indians earning real money daily.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-secondary rounded-xl p-6 border border-border"
            >
              <div className="flex gap-0.5 mb-3">
                {["s1", "s2", "s3", "s4", "s5"].slice(0, t.stars).map((k) => (
                  <Star
                    key={k}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-sm text-foreground italic mb-4">"{t.quote}"</p>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full hero-gradient flex items-center justify-center text-xs font-bold text-white">
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {t.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{t.city}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
