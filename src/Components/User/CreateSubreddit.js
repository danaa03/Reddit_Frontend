import {useState} from 'react';
import {createSubreddit} from '../../Routes/subreddits'

const CreateSubreddit = ({isComp, setIsComp}) => {
    const [subreddit, setSubreddit] = useState({
        name: "",
        description: ""
    })
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setSubreddit({
          ...subreddit,
          [e.target.name]: e.target.value, 
        });
        setError(""); 
    };

    const handleSubmit = async (e)=> {
        e.preventDefault();
        setError("");
        try {
            const response = await createSubreddit(subreddit);
            if(response==="error! Subreddit already exists!"){
                setError(response);
            return;}
            alert("subreddit created successfully!");
            setIsComp(false);
        } catch (error)
        {
            console.log("Error creating subreddit: ", error);
            alert(error);
        }
    }

    return(
        <div
        className="modal fade show"
        style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create Subreddit</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setIsComp(false)}
              ></button>
            </div>
            <div className="modal-body">
              <div className='container rounded'>
                {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group mb-2">
                    <input type="text" className="form-control" name="name" placeholder="Subreddit Name" value={subreddit.name} onChange={handleChange} />
                </div>
                <div className="form-group mb-3">
                    <textarea type="text" className="form-control" name="description" placeholder="Description" value={subreddit.description} onChange={handleChange}  />
                </div>
                {/* <div className="text-sm text-muted mb-2 ms-2">
                    <span>New to reddit? <button type="button" className="btn btn-link p-0 mb-2" >Sign Up</button></span>
                </div> */}
                <button type="submit" className="btn submit-lgn w-100 rounded-pill">Create Subreddit</button>
                </form>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}
export default CreateSubreddit;