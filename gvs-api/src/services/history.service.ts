import * as HistoryRepository from '../repositories/history.repository';
export const getAllHistory = () => HistoryRepository.findAll();
export const createHistory = async (data: any) => { return HistoryRepository.create(data); };
