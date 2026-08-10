import MediaPage from "../../components/MediaPage/MediaPage";
import preachingImage from "../../images/issak.jpg";

const videos = [
  { url: "https://www.youtube.com/embed/t-F_GZIkoak", title: "Message from God's Word" },
  { url: "https://www.youtube.com/embed/nJeyg2mEdjM", title: "Worship and teaching" },
  { url: "https://www.youtube.com/embed/9I7N3db4who", title: "Teaching on the Trinity", subtitle: "Pastor Isaac Haileab" },
];

const Predict = () => <MediaPage eyebrow="The Word of God" title="Predigt" description="Biblical teaching and messages to strengthen faith, encourage service, and help us grow together in Christ." image={preachingImage} videos={videos} accent="#ff7043" />;

export default Predict;
