import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMezmur, getMezmurs, updateMezmur } from "../../actions/postsActions";
//import { createPost, addMezmur, updatePost } from "../../api/api";

//import TodoItem from '../TodoItem/TodoItem';

//import todoContext from '../../store/context';
//import { ADD_TODO } from '../../store/actions';

// Add a submit listener that...
// Add the new todo text to our App State

const Add_new_mezmur = ({  currentId, setCurrentId }) => {
  const user = JSON.parse(localStorage.getItem("profile"));

  // Get the values we need from the Context with useContext()
  //const { todoTasks, dispatch } = useContext(todoContext);

  // Control the input to always have the input value in state (onChange, value)

  const startingState = {
    title: "",
    langetext: "",
  };
  const [startState, setStartState] = useState(startingState);
  const [isSubmitted, setisSubmitted] = useState(false);
  const [title, setTitle] = useState('');
  const [mezmur, setMezmur] = useState('');
  const mezmu = useSelector((state) =>
    currentId ? state.mezmurs.find((p) => p._id === currentId) : null
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (mezmu) {
      setStartState(mezmu);
    }
  }, [mezmu]);

  const handleChange = evt => {
    const { name, value } = evt.target;
    setStartState({ ...startState, [name]: value })
    //setTitle(evt.target.value)
  }
  const handleMezmur = evt => setMezmur(evt.target.value);

  const handleSubmit = evt => {
    evt.preventDefault();
    //const newMezmur = { title, mezmur };

    if (currentId) {
      dispatch(
        updateMezmur(currentId, { ...startState, name: user?.result?.name })
      );
    } else {
      dispatch(addMezmur({ ...startState, name: user?.result?.name }));
    }
    console.log(dispatch);
    clear();
  };

  const clear = () => {
    //setCurrentId(null);
    setStartState({
      title: "",
      langetext: "",
    });
  };

  if (!user?.result?.name) {
    //Please sign in
    return (
      <div style={{color: "red"}}>
        <p variant="h6" align="center">
          Please Sign In to add new mezmur
        </p>
      </div>
    );
  }
  const createmezmur = () => {
    axios.post('http://localhost:8000/mezmur', startState).then((response) => {
      setStartState(...startState, response.data);
    });
  }
  //console.log(startState);


  return (
    <div className="sunday">
      <h2>Add new mezmur</h2>
      <form className="sunday" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }} >
        <label className="input-item" placeholder="add title" style={{ margin: "20PX" }}>Add title
          <input type="text" name="title" id="title" value={startState.title} onChange={handleChange} />
        </label>
        <label className="input-item" placeholder="add artist" style={{ margin: "10PX" }}>Add artist
          <input type="text" name="artist" id="artist" value={startState.artist} onChange={handleChange} />
        </label>
        <label for="langetext">Add text mezmur here</label>
        <textarea id="langetext" name="langetext" rows="50" cols="30" placeholder="Add Mezmur here" value={startState.langetext} onChange={handleChange} style={{ whiteSpace: 'pre-wrap' }}>
        </textarea>  <br></br>
        <button className="btn" type="submit">submit</button>
      </form>
      <div className="todos">

        {/* Take the items array, and map Todo items based on it, passing the individual item data down to the component */}
        {/*todoTasks.map((item, index) => <TodoItem key={index} data={item} />)*/}
      </div>
    </div>
  )
};

export default Add_new_mezmur;