import app from "./app/app";
import ENV from "./config";
import GlobalError from "./middlewares/GlobalError";
import ROUTE from "./routes/route"; 
app.use("/api", ROUTE);
app.use(GlobalError);



app.listen(ENV.port,  () =>
  console.log(`Server is running in HOST: http://localhost:${ENV.port}`)
);
