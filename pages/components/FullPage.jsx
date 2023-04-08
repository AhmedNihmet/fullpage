import classNames from "classnames";
import { useEffect, useRef, useState } from "react";

const FullPage = ({
  slides,
  duration = 1000,
  sensitivity = 20,
  onIndexChange,
}) => {
  const fullPageRef = useRef(null);

  const [deltaY, setdeltaY] = useState();
  const [triggeredTo, setTriggeredTo] = useState("idle");

  const [currentIndex, setCurrentIndex] = useState(1);
  const [disableEvent, setDisableEvent] = useState(false);

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    if (fullPageRef.current !== undefined) {
      fullPageRef.current.addEventListener("wheel", (event) =>
        event.deltaY >= sensitivity || event.deltaY <= -sensitivity
          ? setdeltaY(event.deltaY)
          : undefined
      );

      // on touch
      fullPageRef.current.addEventListener("touchstart", (event) =>
        setTouchStart(event.changedTouches[0].clientY)
      );
      fullPageRef.current.addEventListener("touchend", (event) =>
        setTouchEnd(event.changedTouches[0].clientY)
      );
    }
  }, []);

  useEffect(() => {
    if (deltaY >= sensitivity) setTriggeredTo("down");
    if (deltaY <= -sensitivity) setTriggeredTo("up");
  }, [deltaY]);

  useEffect(() => {
    if (touchStart && touchEnd) {
      if (touchStart > touchEnd + sensitivity) setTriggeredTo("down");
      if (touchStart < touchEnd - sensitivity) setTriggeredTo("up");
    }
  }, [touchStart, touchEnd, sensitivity]);

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
      setDisableEvent(false);
    }, duration);
  }, [currentIndex]);

  const triggerePageSlide = (toIndex) => {
    if (toIndex > 1) {
      fullPageRef.current.style.transform = `translate3d(0, -${
        (toIndex - 1) * window.innerHeight
      }px, 0)`;
      setDisableEvent(true);
      onIndexChange(currentIndex);
    } else if (toIndex === 1) {
      if (triggeredTo !== "idle") {
        setDisableEvent(true);
        onIndexChange(currentIndex);
      }
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
          <section
            key={index}
            className={classNames("fullpage-section", item.className)}
          >
            {item.component}
          </section>
        );
      })}
    </article>
  );
};

export default FullPage;
