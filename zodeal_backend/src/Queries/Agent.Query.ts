import { IAgent, IAgentDocument } from "../Models/Agent/Agent.Interface.js";
import { AgentModel } from "../Models/Agent/Agent.Model.js";
import { IAgentTHistory } from "../Models/Agent/AgentTHistory.Interface.js";
import { AgentTHistoryModel } from "../Models/Agent/AgentTHistory.Model.js";

const save = async (agentData: Partial<IAgent>): Promise<IAgentDocument> => {
  try {
    const agent = new AgentModel(agentData);
    return await agent.save();
  } catch (error) {
    throw error;
  }
};
const update= async(id:string,updateData:Partial<IAgent>)=>{
  try {
    const updatedAgent = await AgentModel.findByIdAndUpdate(id, updateData, { new: true });
    return updatedAgent;
  } catch (error) {
    throw error;
  }
}
const viewAll = async (query:any): Promise<IAgentDocument[]> => {
  try {
    return await AgentModel.find(query);
  } catch (error) {
    throw error;
  }
};
const getByCode = async(code:string):Promise<IAgentDocument | null>=>{
  try {
    return await AgentModel.findOne({code});
  } catch (error) {
    throw error;
  }
}
const deleteById = async(id:string)=>{
  try {
    const agent = await AgentModel.findByIdAndDelete(id);
    return agent;
  } catch (error) {
    throw error;
  }
}
const addVendorDetailsByCode = async(code:string,vendorDetail:{name:string,amount:number})=>{
  try {
    const agent = await AgentModel.findOneAndUpdate(
      { code },
      { $push: { vendorDetails: vendorDetail } },{new: true})
    return agent;
  } catch (error) {
    throw error;
  }}
  //agent transaction history
  const saveTransaction = async(transactionDetails:IAgentTHistory)=>{
    try {
      const transaction = await new AgentTHistoryModel(transactionDetails).save();
      return transaction;
    } catch (error) {
      throw error;
    }
  }
  const getAllTransaction = async()=>{
    try {
      const transactions = await AgentTHistoryModel.find().populate('agentId').populate('vendorId');
      return transactions;
    } catch (error) {
      throw error;
    }
  }
export const AgentQuery = {
    save,
    viewAll,
    update,
    getByCode,
    deleteById,
    addVendorDetailsByCode,
    saveTransaction,
    getAllTransaction
}