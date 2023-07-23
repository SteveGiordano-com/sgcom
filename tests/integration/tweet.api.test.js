import request from "supertest";
import { expect } from "chai";
import app from "../../server/app.js";

const TEST_PORT = 3001;

const server = app.listen(TEST_PORT, () => {
	return true;
});

// To Do: Add remaining APIs

describe("Tweet API", () => {
	describe("/id/:id", () => {
		it("should return a 200 status", async () => {
			const goodId = "886339339864621056";
			const results = await request(app).get("/tweets/id/" + goodId);
			expect(results.status).to.equal(200);
		});

		it("should return a 204 status", async () => {
			const badId = "steve";
			const results = await request(app).get("/tweets/id/" + badId);
			expect(results.status).to.equal(204);
		});
	});
});

server.close((err) => {
	if (err) {
		console.log(err);
	}
});
