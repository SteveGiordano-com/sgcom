import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class ServiceTemplate {
	prismaClient = prisma;
	constructor(table) {
		this.table = table;
	}
}

export default ServiceTemplate;
