/** @format */

const express = require("express");
const app = express();
const faker = require("faker");

// Mongo Connection
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
	"mongodb+srv://admin:Password196@cluster0.dapnt0m.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});

const connect = async () => {
	await client.connect();

	console.log("Connected to the server correctly!!!");
};

connect();
app.use(express.static("public"));
app.use(express.json());

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization",
	);
	next();
});

app.get("/", (req, res) => {
	res.send("<h2>Hope this works!!</h2>");
});

app.post("/payment", async (req, res) => {
	console.log(req.body);
	const { name, email } = req.body;

	console.log(name, email);

	const collection = client.db("payments_db").collection("payments");

	let newPayment = {
		payment_id: faker.random.alphaNumeric(),
		payment_timeStamp: new Date(),
		payment_method: "card",
		currency: "gbp",
		amount: 480,
		customer_email: email,
		customer_name: name,
	};

	const insertOne = await collection.insertOne(newPayment);

	console.log("Insert Status - ", insertOne);
	res.send(insertOne);
});

app.post("/objectid", async (req, res) => {
	console.log(req.body);

	const { mongodbId } = req.body;

	const objectId = ObjectId(mongodbId);

	res.send(objectId);
});

app.get("/get-fields", async (req, res) => {
	const collection = client.db("payments_db").collection("payments");

	console.log("Getting fields ..... ");
	const data = await collection.findOne(
		{},
		{ sort: { payment_timeStamp: 1 }, limit: 1 },
	);

	console.log("Field Data - ", Object.keys(data));
	res.send(Object.keys(data));
});

app.listen(4242, () => {
	console.log(`Example app listening on port 4242!`);
});
