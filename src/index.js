const app = require("./app");

const port = process.env.PORT;
// const port = 5000;

app.listen(port, () => console.log(`Server connected on ${port}`));
