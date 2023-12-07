import IrnOutbox from "./irn";

class IrnService {
    public addIrnOutbox = async (data: any) => {
        const responce = await IrnOutbox.create(data);
        return responce;
    };

    // Edit an existing IrnOutbox
    public editIrnOutbox = async (condition: any, column: any) => {
        const res = await IrnOutbox.update(column, { where: condition });
        return res;
    };

    public getIrnOutbox = async (condition: any, associations: any) => {
        try {
            const data = await IrnOutbox.findAll({
                where: condition,
                include: associations,
                order: [["id", "DESC"]],
                raw: true,
            });
            return data;
        } catch (error) {
            console.log(error, '1ideu4u4343333333')
            throw new Error("Failed to fetch data");
        }
    };
    public deleteIrnOutbox = async (id: any) => {
        try {
            const currentDateTime = new Date();
            // const updatedStatus = status;
            let data = {
                deleted_at: currentDateTime
            }
            let condition = {
                id: id
            }
            await IrnOutbox.update(
                data, { where: condition }
            );
            return {
                success: true,
                message: "IrnOutbox Deleted Successfully",
            };
        } catch (error) {
            throw new Error("Error in Updating IrnOutbox  Status");
        }
    };
    public getIrnOutboxById = async (id: any) => {
        let data: any = await IrnOutbox.findByPk(id);
        return data;
    };
}
const irnService = new IrnService();
export default irnService;
