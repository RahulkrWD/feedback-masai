ReactDOM.createRoot(document.getElementById("root")).render(<App />);
let baseurl =
  "https://feedback-dde83-default-rtdb.asia-southeast1.firebasedatabase.app";
const { useState, useEffect } = React;

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("mode"));

  useEffect(() => {
    localStorage.setItem("mode", theme);
  });
  function toggleButton() {
    setTheme((prev) => !prev);
  }
  return (
    <div className={theme ? "dark-mode" : ""}>
      <button className="theme-btn" onClick={toggleButton}>
        {theme ? (
          <i className="fa-solid fa-moon"></i>
        ) : (
          <i className="fa-regular fa-sun"></i>
        )}
      </button>
      <FeedbackForm />
    </div>
  );
}

function FeedbackForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    comment: "",
  });
  const [message, setMessage] = useState("");
  const [list, setList] = useState([]);

  async function postFeedback(e) {
    if (!form.name) return alert("Name is required!");
    if (!form.email) return alert("email is required!");
    if (!form.comment) return alert("Comment is required!");
    e.preventDefault();
    try {
      let response = await fetch(`${baseurl}/feedback.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          comment: form.comment,
        }),
      });
      if (response.ok) {
        setMessage("Feedback Added");
        setTimeout(() => setMessage(""), 1500);
        setForm({
          name: "",
          email: "",
          comment: "",
        });
        GetFeedback();
      }
    } catch (error) {
      setMessage("Feedback added failed");
      setTimeout(() => setMessage(""), 1500);
    }
  }

  function handleInput(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  //   Feedback fetch data
  async function GetFeedback() {
    try {
      let response = await fetch(`${baseurl}/feedback.json`);
      let data = await response.json();
      let feedbackArray = data
        ? Object.entries(data).map(([id, data]) => ({ id, ...data }))
        : [];
      setList(feedbackArray);
    } catch (error) {
      console.log("error during fetcing data");
    }
  }

  async function deleteFeedback(id) {
    let response = await fetch(`${baseurl}/feedback/${id}.json`, {
      method: "DELETE",
    });
    if (response.ok) {
      setMessage("Feedback deleted");
      setTimeout(() => setMessage(""), 1500);
      GetFeedback();
    }
  }
  useEffect(() => {
    GetFeedback();
  }, []);
  return (
    <>
      <form onSubmit={postFeedback} className="feedback-form">
        <div>
          <p className={message ? "message" : ""}>{message}</p>
          <h1 className="form-title">
            <i className="fa-regular fa-rectangle-list"></i> Feedback Form
          </h1>
          <hr />
          <div className="input-fields">
            <div>
              <label>
                <i className="fa-solid fa-user"></i> Name
              </label>

              <input
                value={form.name}
                name="name"
                onChange={handleInput}
                type="text"
                placeholder="Enter Name.."
              />
            </div>
            <div>
              <label>
                <i className="fa-solid fa-envelope"></i> Email
              </label>
              <input
                value={form.email}
                name="email"
                onChange={handleInput}
                type="email"
                placeholder="Enter Email.."
              />
            </div>
            <div>
              <label>
                <i className="fa-solid fa-message"></i> Comment
              </label>
              <textarea
                value={form.comment}
                name="comment"
                onChange={handleInput}
                rows="10"
              ></textarea>
            </div>
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </div>
        </div>
      </form>
      <Feedbacklist list={list} deleteFeedback={deleteFeedback} />
    </>
  );
}

function Feedbacklist({ list, deleteFeedback }) {
  return (
    <>
      <FeedbackItem items={list} deleteFeedback={deleteFeedback} />
    </>
  );
}

function FeedbackItem({ items, deleteFeedback }) {
  return (
    <div className="feedback-container">
      {items.map((feedback) => (
        <div className="feedback-item" key={feedback.id}>
          <p>
            <i className="fa-solid fa-user"></i> <b>{feedback.name}</b>
          </p>
          <p>
            <i className="fa-solid fa-envelope"></i> <b>{feedback.email}</b>
          </p>
          <p>
            <i className="fa-solid fa-message"></i> <b>{feedback.comment}</b>{" "}
          </p>
          <button
            onClick={() => deleteFeedback(feedback.id)}
            className="delete-btn"
          >
            <i className="fa-solid fa-trash-can"></i> Delete
          </button>
        </div>
      ))}

      <h3 className="found">{items.length == 0 ? "No Data Here.." : ""}</h3>
    </div>
  );
}
