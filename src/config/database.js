const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		await mongoose.connect("mongodb+srv://redbus:namaste_node@cluster0.ome2c.mongodb.net/devTinderBE");
		console.log("MongoDB connected successfully.");
	} catch (error) {
		console.error("Database cannot be connected!!", error.message);
	}
};

module.exports = { connectDB };
