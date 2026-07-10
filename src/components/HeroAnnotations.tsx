import Parallax from "./Parallax";

/**
 * Hero depth orbs — soft blurred gradient blobs that parallax at different
 * rates behind the hero content, adding layered depth without any text.
 */
const HeroAnnotations = () => {
  return (
    <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden="true">
      <Parallax speed={0.04} className="absolute" style={{ top: "8%", right: "8%" }}>
        <div
          className="w-[420px] h-[420px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(251,146,60,0.16), transparent 65%)", filter: "blur(50px)" }}
        />
      </Parallax>
      <Parallax speed={0.09} className="absolute" style={{ top: "46%", right: "26%" }}>
        <div
          className="w-[320px] h-[320px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.14), rgba(236,72,153,0.08) 40%, transparent 70%)", filter: "blur(55px)" }}
        />
      </Parallax>
    </div>
  );
};

export default HeroAnnotations;
