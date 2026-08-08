import { useEffect, useState } from "react";
import axios from "axios";

const startingState = [{
    title: "",
    langetext: "",
  }];
const MezmurList = () => {
    const [startState, setStartState] = useState(startingState)

    useEffect(()=>{
        axios.get('https://server-full-gospel.onrender.com/mezmur').then((response)=>{
          setStartState(response.data);
        });
    }, []);
   
    return (
        <>
        <h1>List of Mezmurs</h1>
        
        <div>
    
        
        {startState.map((mez)=>(
            <ul style={{color: "yellow", backgroundColor: "green"}} key={mez._id}>
                <li style={{color: "blue", backgroundColor: "yellow"}}>{mez.title} </li>
            </ul>
        ))}
        
       
        </div>
        </>
    )
};

export default MezmurList;
