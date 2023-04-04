import classNames from "classnames";
import { useEffect, useRef, useState } from "react";

const FullPage = ({ slides, duration = 1000, sensitivity = 20 }) => {
  const fullPageRef = useRef(null);

  const [deltaY, setdeltaY] = useState();
  const [triggeredTo, setTriggeredTo] = useState("idle");

  const [currentIndex, setCurrentIndex] = useState(1);
  const [disableEvent, setDisableEvent] = useState(false);

  useEffect(() => {
    if (fullPageRef.current !== undefined) {
      fullPageRef.current.addEventListener("wheel", (event) =>
        event.deltaY >= sensitivity || event.deltaY <= -sensitivity
          ? setdeltaY(event.deltaY)
          : undefined
      );
    }
  }, []);

  useEffect(() => {
    if (deltaY >= sensitivity) setTriggeredTo("down");
    if (deltaY <= -sensitivity) setTriggeredTo("up");
  }, [deltaY]);

  useEffect(() => {
    if (triggeredTo !== "idle") {
      if (triggeredTo === "down")
      setCurrentIndex((prevState) =>
        prevState < slides.length ? prevState + 1 : prevState
      );
    if (triggeredTo === "up")
      setCurrentIndex((prevState) =>
        prevState > 1 ? prevState - 1 : prevState
      );
    }
  }, [triggeredTo]);

  useEffect(() => {
    triggerePageSlide(currentIndex);

    setTimeout(() => {
      setTriggeredTo("idle");
      setdeltaY(null);
      setDisableEvent(false);
    }, duration);
  }, [currentIndex]);

  const triggerePageSlide = (toIndex) => {
    if (toIndex > 1) {
      fullPageRef.current.style.transform = `translate3d(0, -${
        (toIndex - 1) * window.innerHeight
      }px, 0)`;
      setDisableEvent(true);
    } else if (toIndex === 1) {
      setDisableEvent(true);
      fullPageRef.current.style.transform = "translate3d(0, 0px, 0)";
    }
  };

  return (
    <article
      className={classNames("custom-fullpage", {
        "custom-fullpage--prevent-event": disableEvent,
      })}
      ref={fullPageRef}
      style={{
        transition: `all ${duration}ms ease`,
      }}
    >
      {slides.map((item, index) => {
        return (
          <section className={`fullpage-section ${item.className}`} key={index}>
            {item.component}
          </section>
        );
      })}
    </article>
  );
};

export default FullPage;
