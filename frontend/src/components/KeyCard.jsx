import { motion } from "framer-motion";

const KeyCard = ({ title, text, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="rounded-2xl shadow-md shadow-accent/30 p-6 flex flex-col justify-center text-left hover:shadow-accent/50 transition-transform duration-300 hover:scale-[1.02]"
  >
    <h3 className="text-xl md:text-2xl font-semibold text-accent mb-2">
      {title}
    </h3>
    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
      {text}
    </p>
  </motion.div>
);

export default KeyCard;
