import { forwardRef, useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { signatureSpring, reducedTransition } from "./motionConfig";

const revealVariants = {
  visible: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0 0 0% 0)",
    filter: "blur(0px)",
  },
};

const MotionReveal = forwardRef(function MotionReveal(
  { as = "div", children, className, delay = 0, style, ...props },
  ref
) {
  const localRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(localRef, { once: true, margin: "0px 0px -10% 0px" });
  const Component = motion[as] || motion.div;
  const shouldAnimate = mounted && !shouldReduceMotion;
  const animationState = !shouldAnimate || isInView ? "visible" : "visible";

  useEffect(() => {
    setMounted(true);
  }, []);

  const setRefs = (node) => {
    localRef.current = node;

    if (typeof ref === "function") {
      ref(node);
      return;
    }

    if (ref) {
      ref.current = node;
    }
  };

  return (
    <Component
      ref={setRefs}
      className={className}
      style={style}
      variants={revealVariants}
      initial={false}
      animate={animationState}
      transition={shouldReduceMotion ? reducedTransition : { ...signatureSpring, delay }}
      {...props}
    >
      {children}
    </Component>
  );
});

export default MotionReveal;
