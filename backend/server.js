import express from "express";
import userRouter from "./routes/userRoute.js";
import foodTypeRouter from "./routes/foodTypeRoute.js";
import foodSizeRoute from "./routes/foodSizeRoute.js";
import tasteRouter from "./routes/tasteRoute.js";
import fileUpload from "express-fileupload";

import cors from "cors";
import foodRoute from "./routes/foodRoute.js";
import saleRouter from "./routes/saleRoute.js";
import organizationRouter from "./routes/organizationRoute.js";
import billSaleRoute from "./routes/billSaleRoute.js";
import reportRouter from "./routes/reportRoute.js";


const app = express();
const port = process.env.PORT || 3001;


app.use(express.json());
app.use(cors());
app.use(fileUpload())
app.use('/uploads', express.static('uploads'))

app.use("/api/user", userRouter);
app.use("/api/food-type", foodTypeRouter);
app.use("/api/food-size", foodSizeRoute);
app.use("/api/taste", tasteRouter);
app.use("/api/food", foodRoute);
app.use("/api/sale", saleRouter);
app.use("/api/organization", organizationRouter);
app.use("/api/bill-sale", billSaleRoute);
app.use("/api/report", reportRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () =>
  console.log(`Server started on PORT:${port}`)
);
