import { useEffect, useRef, useState } from "react";

const FullPage = ({ slides, duration = 1000, sensitivity = 20 }) => {
  const fullPageRef = useRef(null);

  const [deltaY, setdeltaY] = useState(null);
  const [triggeredTo, setTriggeredTo] = useState("idle");

  const [currentIndex, setCurrentIndex] = useState(1);

  useEffect(() => {
    window.addEventListener("wheel", (event) =>
      event.deltaY >= 20 || event.deltaY <= -20
        ? setdeltaY(event.deltaY)
        : undefined
    );
  }, []);

  useEffect(() => {
    if (deltaY >= sensitivity) setTriggeredTo("down");
    if (deltaY <= -sensitivity) setTriggeredTo("up");
  }, [deltaY]);

  useEffect(() => {
    if (triggeredTo === "down")
      setCurrentIndex((prevState) =>
        prevState < slides.length ? prevState + 1 : prevState
      );
    if (triggeredTo === "up")
      setCurrentIndex((prevState) =>
        prevState > 1 ? prevState - 1 : prevState
      );
  }, [triggeredTo]);

  useEffect(() => {
    triggerePageSlide(currentIndex);

    setTimeout(() => {
      setTriggeredTo("idle");
      setdeltaY(null);
    }, duration + 200);
  }, [currentIndex]);

  const triggerePageSlide = (toIndex) => {
    const sectionHeight = fullPageRef.current.offsetHeight;

    if (toIndex > 1) {
      fullPageRef.current.style.transform = `translate3d(0, -${
        (toIndex - 1) * sectionHeight
      }px, 0)`;
    } else if (toIndex === 1) {
      fullPageRef.current.style.transform = "translate3d(0, 0px, 0)";
    }
  };

  return (
    <article
      className="custom-fullpage"
      ref={fullPageRef}
      style={{
        transition: `all ${duration}ms ease`,
      }}
    >
      {slides.map((item, index) => {
        return (
          <section className={`section ${item.className}`} key={index}>
            {item.component}
          </section>
        );
      })}
    </article>
  );
};

export default FullPage;
