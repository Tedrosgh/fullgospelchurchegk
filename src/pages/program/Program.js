import logo from "../../images/logo.jpg";

const Program = () => {
    return (<>
        <h1 style={{color: "lightgreen", position: "center"}}>Willkommen</h1>
        <h1 style={{display: "flex", flexGrow: "1", flexShrink: "3"}}> Eritreische Gemeinde fuer das ganze Evangelium in Cologne Germany</h1>
        <h5>Im weidenbruch 4 51061 Cologne</h5>;
        <img style={{width: "100%", display: "flex", flexGrow: "1", flexShrink: "3"}} src={logo} alt="logo"/>
        <h1 style={{color: "red", transform: "rotate(45deg)"}}>Herzlich Willkommen</h1>
        <h2 style={{color: "red"}}>Jede Sonntag ab 14:30 Uhr Gebetsabend</h2>;
        <h2>ኩሉ ጊዜ ሰንበት ካብ ሰዓት 
  14፡30 ክሳብ 17፡00፡ 
</h2>
        <h3 style={{color: "green"}}>Jede 1se und 3rte Samstag im Monat ab 15:30 Uhr Gottesdienst</h3>;
        <h4 style={{ color: "blue"}}>Jede Donnerstag ab 20:00 Uhr Bibel Stunde via zoom</h4>
        <h4>Jede Montag ab 20:00 Uhr Weiterbildung telefonisch </h4>
        <h5 style={{color: "black"}}>Name des Ansprechpartner:- Pastor Abraham Z. Teweldemedhin</h5>
        <h6>Mobil:- +4915208594919</h6>
        <h6>email: :- abrahamzth@yahoo.de</h6>
        </> );
};

export default Program;