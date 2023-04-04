import FullPage from "./components/FullPage";

export default function Home() {
  const slides = [
    {
      component: <span>Page 1</span>,
      className: "page-1"
    },
    {
      component: <span>Page 2</span>,
      className: "page-2"
    },
    {
      component: <span>Page 3</span>,
      className: "page-3"
    },
    {
      component: <span>Page 4</span>,
      className: "page-1"
    },
    {
      component: <span>Page 5</span>,
      className: "page-2"
    },
    {
      component: <span>Page 6</span>,
      className: "page-3"
    },
  ];

  return <FullPage slides={slides} sensitivity={30} duration={700} />;
}
