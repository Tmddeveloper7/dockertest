import Sequelize, { Op } from "sequelize";
import { sequelize } from "../../config/database/database";

const IrnOutbox = sequelize.define(
    "irn_outbox",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        key_type: {
            type: Sequelize.STRING,
        },
        key_id: {
            type: Sequelize.INTEGER,
        },
        irn_doc_type: {
            type: Sequelize.STRING,
        },
        irn_ref_num: {
            type: Sequelize.STRING,
        },
        payload: {
            type: Sequelize.STRING,
        },
        response: {
            type: Sequelize.TEXT,
        },
        stage: {
            type: Sequelize.STRING,
        },
        submitted_date: {
            type: Sequelize.DATE,
        },
        sent_date: {
            type: Sequelize.DATE,
        },
        ack_date: {
            type: Sequelize.DATE,
        },
        signed_qr_code: {
            type: Sequelize.TEXT,
        },
        completed_date: {
            type: Sequelize.DATE,
        },
        company_id: {
            type: Sequelize.INTEGER,
        },
        status: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        timestamps: true,
    }
);
export default IrnOutbox;