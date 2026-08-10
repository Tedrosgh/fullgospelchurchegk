import MediaPage from "../../components/MediaPage/MediaPage";
import childrenImage from "../../images/hixanat.jpg";

const videos = [
  { url: "https://www.youtube.com/embed/0XrDNM6iKzY", title: "Children worshipping God", subtitle: "Mezmur Elta" },
  { url: "https://www.youtube.com/embed/VQq8GCm69w4", title: "Full Gospel Church Kids", subtitle: "1 January 2018" },
  { url: "https://www.youtube.com/embed/W_d0GpqGkMI", title: "Children's church celebration", subtitle: "18 December 2017" },
  { url: "https://www.youtube.com/embed/pltGchsf1kI", title: "Children growing in faith", subtitle: "5 November 2017" },
];

const Kinder = () => <MediaPage eyebrow="Faith starts young" title="Kinder" description="A joyful and caring environment where children learn about Jesus, worship together, and know they are loved." image={childrenImage} videos={videos} accent="#ffca28" />;

export default Kinder;
