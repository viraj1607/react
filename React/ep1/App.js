const heading = React.createElement("h1", {id:"heading"}, "Hello World from React");
console.log(heading)  //will return an object not h1 tag
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(heading);
