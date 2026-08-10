import MediaPage from "../../components/MediaPage/MediaPage";
import youthImage from "../../images/medrek.jpg";

const videos = [
  { url: "https://www.youtube.com/embed/1iG_QZHw4bk", title: "Youth worship and fellowship" },
  { url: "https://www.youtube.com/embed/t6BUFIMZXsY", title: "Growing together in faith" },
  { url: "https://www.youtube.com/embed/N7jVNqEyUTs", title: "Young people in our community" },
];

const Jugend = () => <MediaPage eyebrow="Next generation" title="Jugend" description="A place for young people to belong, build friendships, worship, and grow confidently in their faith." image={youthImage} videos={videos} accent="#26c6da" />;

export default Jugend;
