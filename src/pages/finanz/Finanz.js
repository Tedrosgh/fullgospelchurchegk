import karte from "../../images/karte.png"
const Finanz = () => {
    return (
        <>
        <div style={{maxWidth: "1280px", margin: "auto", border: "3px solid orange"}}>
        <div style={{display: "flex", flexGrow: "1", flexShrink: "3", margin: "30px"}}>
            <div>
                <img style={{display: "flex", width: "auto", height: "315px", flexGrow: "1", flexShrink: "3"}} src={karte} alt="karte"/>
            </div>
        <div style={{textAlign: "center", border: "4px solid yellow", padding: "30px", margin: "10px", width: "auto"}}>
        <h1>Unser Bankverbindung</h1>;
        <h4>Eritreische Gemeinde für das ganze Evangelium e.v.</h4>
        <h4>Volksbank Köln Bonn eG</h4>;
        <h4>IBAN DE59 3806 0186 6402 4010 18</h4>;
        <h4>BIC GENODED1BRS</h4>;
        </div>
        </div>
        <p style={{color: "yellow"}}>Under construction . . . Finanz</p>
        </div>
        </>
    )
};

export default Finanz;