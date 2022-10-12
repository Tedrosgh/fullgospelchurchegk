import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Link, NavLink, useHis, useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { deleteMezmurAction, getMezmurs, getSingleMezmur } from '../../actions/postsActions';
import Form from '../../components/Form/Form';
import DeleteIcon from "@material-ui/icons/Delete";
import { CircularProgress } from '@material-ui/core';
import { useSelector } from 'react-redux';
import Add_new_mezmur from './Add_new_mezmur';

const page = { page: '/mezmur' };




// 
const AllMezmurs = ({ setCurrentId }) => {
    // const classes = useStyles(); //classes.container
    const startingState = [{
        title: "",
        langetext: "",
    }];

    const [startState, setStartState] = useState(startingState);
    const [data, setData] = useState([]);
    const [value, setValue] = useState("");
    const [state, setState] = React.useState(page);
    const history = useHistory();
    let { id } = useParams();
    const dispatch = useDispatch();
    const handlenewMezmur = () => {
        history.push('/mezmur/addmezmur');
    };

    useEffect(() => {
        dispatch(getMezmurs());
      }, [dispatch]);       

    const mezmurs = useSelector((state) => state.mezmurReducer);
    console.log("All Mermurs: ", mezmurs);
    console.log("startState: ", startState);

    return !mezmurs.length ? (
        <CircularProgress />
    ) : (<div className="sunday">
        <h1>Mezmur</h1>
        <Stack spacing={2} direction="row" justifyContent={'center'}>
            <Button variant="outlined" onClick={handlenewMezmur}>Add new Mezmur</Button>
            {/* <Button variant="outlined" onClick={handleListMezmur}>mezmur List</Button> */}
            {/* <Button variant="outlined" onClick={findHandler}>Current Mezmur</Button> */}
            {/* <Button variant="outlined" onClick={loginHandler4}>Delete Mezmur</Button>
         <Button variant="outlined"> <NavLink to='/mezmur/displaymezmur'> Display Mezmur</NavLink></Button>
         <Button variant="outlined"> <NavLink to='/mezmur/searchmezmur'>search Mezmur</NavLink> </Button>
         <Button variant="outlined"> <NavLink to='/mezmur/help'> HELP ?</NavLink></Button> */}
        </Stack>
        {/* <div style={{ display:  "flex", justifyContent: "center"}}> */}
        <div>
            {/* <h3>Title of the mezmur</h3> */}
            {/* <div style={{ padding: "15px", maxWidth: "auto" }}>  */}
            <div>
                <input type='text' placeholder='search mezmur . . .'
                    value={value} onChange={(e) => setValue(e.target.value)} />
                {mezmurs.filter((val) => {
                    if (value == "") {
                        return <div>
                            {mezmurs.sort((a, b) => a.title > b.title ? 1 : -1).map((mez) => (
                                <ul style={{ color: "yellow", backgroundColor: "green" }} key={mez._id}>
                                    <li style={{ color: "red" }} ><Link to={`/mezmur/${mez._id}`}> {[mez.title]} </Link>
                                    </li>
                                </ul>))}
                                
                        </div>
                    } else if (val.title.includes(value)) {
                        return val
                    }
                }).map((val) => {
                    return (
                        <div key={val._id} style={{ color: "yellow", backgroundColor: "lightgreen", fontWeight: "bold" }}>
                            <ul>
                                <li style={{ display: "flex", justifyContent: "space-between" }}>
                                    <Link style={{ textDecoration: "none" }} to={`/mezmur/${val._id}`}>{[val.title]}</Link>
                                    <button
                                        // onClick={() => handleRemoveMezmur(val._id)}
                                        onClick={() => dispatch(deleteMezmurAction(val._id))}
                                        style={{ border: "none", backgroundColor: "lightgreen" }}>
                                        <DeleteIcon fontSize="small" style={{ color: "red" }} />
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )
                })}
            </div>
        </div>
        
       </div>
    )

    
};

export default AllMezmurs;