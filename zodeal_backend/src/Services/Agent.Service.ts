import { error } from "../../commons/Exception/CustomException.js";
import { conflict } from "../../commons/Utils/StatusCode.js";
import { IAgent } from "../Models/Agent/Agent.Interface.js";
import { AgentQuery } from "../Queries/Agent.Query.js";

const save = async (agentData: Partial<IAgent>) => {
    try {
        if (agentData.phoneNumber) {
            const existingAgent = await AgentQuery.viewAll({
                phoneNumber: agentData.phoneNumber,
            });
            if (existingAgent && existingAgent.length > 0) {
                throw {
                    statusCode: 400,
                    message: "Agent with this phone number already exists",
                };
            }
        }
        if (agentData.pan) {
            const existingAgent = await AgentQuery.viewAll({
                pan: agentData.pan,
            });
            if (existingAgent && existingAgent.length > 0) {
                throw {
                    statusCode: 400,
                    message: "Agent with this pan number already exists",
                };
            }
        }
         if (agentData.pan) {
            const existingAgent = await AgentQuery.viewAll({
                pan: agentData.pan,
            });
            if (existingAgent && existingAgent.length > 0) {
                throw {
                    statusCode: 400,
                    message: "Agent with this pan number already exists",
                };
            }
        }
        if (agentData.email) {
            const existingAgent = await AgentQuery.viewAll({
                email: agentData.email,
            });
            if (existingAgent && existingAgent.length > 0) {
                throw {
                    statusCode: 400,
                    message: "Agent with this email already exists",
                };
            }
        }
        if (agentData.code && agentData.code.trim() !== "") {
            const existingCode = await AgentQuery.viewAll({
                code: agentData.code,
            });

            if (existingCode?.length) {
                throw {
                    statusCode: 400,
                    message: "Agent with this code already exists",
                };
            }
        } else {
            delete agentData.code;
        }
        return await AgentQuery.save(agentData);
    } catch (err: any) {
        console.error("Error saving agent:", err);
        if (err.statusCode) {
            throw err;
        }
        throw {
            statusCode: 500,
            message: "Failed to save agent",
        };
    }
};


const update = async (id: string, updateData: Partial<IAgent>) => {
    try {
        const updatedAgent = await AgentQuery.update(id, updateData);
        return updatedAgent;
    } catch (error) {
        throw error
    }
}
const viewAll = async (query: any) => {
    try {
        const agents = await AgentQuery.viewAll(query);
        return agents;
    } catch (error) {
        throw error;
    }
}
const deleteById = async (id: string) => {
    try {
        const agent = await AgentQuery.deleteById(id);
        return agent;
    } catch (error) {
        throw error;
    }
}
const getAllTransaction = async () => {
    try {
        const transactions = await AgentQuery.getAllTransaction();
        return transactions;
    } catch (error) {
        throw error;
    }
}
export const AgentService = {
    save,
    viewAll,
    update,
    deleteById,
    getAllTransaction
}