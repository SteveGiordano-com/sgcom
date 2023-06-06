import dotenv from "dotenv";
dotenv.config();

const configObj = {
	"port": process.env.PORT,
	"environment": process.env.NODE_ENV
};

export default Object.freeze(configObj);
