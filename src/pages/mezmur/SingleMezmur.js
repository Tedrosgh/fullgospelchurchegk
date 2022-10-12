import React, {useEffect, useState} from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { useParams } from "react-router-dom";



    const startingState = [{
        title: "",
        langetext: "",
      }];
    
const SingleMezmur = () => {
    const { id } = useParams();
    const [startState, setStartState] = useState(startingState);
    useEffect(()=>{
        axios.get(`http://localhost:8000/mezmur/${id}`).then((response)=>{
          setStartState(response.data);
        });
    }, [id]);
        console.log(startState._id);
  
    return (
        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            <h2> {startState.title} </h2>
            <p style={{color: "blue"}}>{startState.artist}</p>
            <p style={{whiteSpace: 'pre-wrap', fontSize: "24PX"}}>{startState.langetext}</p>

            
        </div>
    )
}
export default SingleMezmur;