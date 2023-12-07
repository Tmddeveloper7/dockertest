import { QueryTypes } from "sequelize"
import { sequelize } from "../config/database/database"

const {generateInvoice} = require('../bdoIrn/index.js')
const config =require(`${process.env.CONFIG}`)

const sendInvoice = async() =>{
    let $pendingIrns:any = await getPendingIrn()
    for(let $pending of $pendingIrns) {
        let $response = await generateInvoice(config,$pending.payload)
        return {
            "irn":$response.Irn,
            "ack_no":$response.AckNo,
            "ack_date":$response.AckDt,
            "signed_qr_code":$response.SignedQRCode,
            "signed_invoice":$response.SignedInvoice
        }
    }

}

const getPendingIrn = async() =>{
    let $sql=`select * from irn_outbox where stage='pending' order by created_at asc`
        try {
            const [results, metadata] = await sequelize.query($sql, { type: QueryTypes.RAW});
            return results;
        } catch (error) {
            console.error('Error executing raw SELECT query:', error);
            throw error;
        }
}

module.exports = {sendInvoice}