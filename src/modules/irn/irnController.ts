import irnService from "./irnService";
import Responses from "../../controller/responseController";
class IrnOutboxController {
    public async create(req: any, res: any) {
        try {
            let $data: any = req.body;
            if ($data) {
                var response = await irnService.addIrnOutbox($data);
                if (response) {
                    res.send(Responses.getResponse(200, "Ok", response))
                }
            }
        } catch (error) {
            res.send(Responses.getResponse(200, "Error", error))
        }
    }
    public getAll = async (req: any, res: any) => {
        try {
            let includes: any = []
            let $cond = {}
            if (req.query) {
                $cond = req.query
            }
            console.log($cond, includes,)
            const response = await irnService.getIrnOutbox($cond, includes);
            res.send(Responses.getResponse(200, "Ok", response))
        } catch (error: any) {
            res.send(Responses.getResponse(200, "Error", error))
        }
    };
    public async getOne(req: any, res: any) {
        let $cond: any = {}
        if (req.params.id) {
            $cond.id = req.params.id
        }
        try {
            let response: any = await irnService.getIrnOutboxById($cond);
            res.send(Responses.getResponse(200, "Ok", response))
        }
        catch (error: any) {
            res.send(Responses.getResponse(200, "Error", error))
        }
    }
    public async update(req: any, res: any) {
        try {
            let $data: any = req.body;
            var $cond = {
                id: $data.id,
            };
            delete $data.id;
            var column = $data;
            var response = await irnService.editIrnOutbox($cond, column);
            res.send(Responses.getResponse(200, "Ok", response))
        } catch (error: any) {
            res.send(Responses.getResponse(200, "Error", error))
        }
    }
    public delete = async (req: any, res: any) => {
        try {
            let id = req.query.id
            const response = await irnService.deleteIrnOutbox(id);
            if (response) {
                res.send(Responses.getResponse(200, "Ok", response))
            }
        } catch (error: any) {
            res.send(Responses.getResponse(200, "Error", error))
        }
    }
}
const irnOutboxController = new IrnOutboxController();
export default irnOutboxController;
