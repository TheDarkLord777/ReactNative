import { Question } from '../types';
import api from '../api/axios';

export const roomService = {
  createUser: (username: string) => 
    api.post('/users', { username }),
    
  createRoom: async (userId: number, roomCode: string) => {
    try {
      const response = await api.post('/rooms', {
        userId,
        roomCode
      });
      return response.data;
    } catch (error: any) {
      console.error('Room creation error:', error.response?.data || error.message);
      throw error;
    }
  },
    
  accessRoom: async (roomCode: string) => {
    try {
      const response = await api.post('/rooms/enter', { 
        username: `Student_${Date.now()}`,
        roomCode 
      });
      return response.data;
    } catch (error: any) {
      console.error('Access room error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  getQuestions: (roomId: number) => 
    api.get(`/rooms/${roomId}/questions`),
    
  addQuestion: (roomId: number, question: Omit<Question, 'id'>) =>
    api.post(`/rooms/${roomId}/questions`, question),

  submitAnswer: async (roomId: number, questionId: number, selectedAnswer: string) => {
    try {
      const response = await api.post(`/rooms/${roomId}/questions/${questionId}/answers`, {
        userId: 1, // Replace with actual userId when available
        selectedAnswer: String(selectedAnswer),
      });
      return response.data;
    } catch (error: any) {
      console.error('Submit answer error:', error.response?.data || error.message);
      throw error;
    }
  },

  getRoomIdByCode: async (roomCode: string) => {
    try {
      const response = await api.get(`/rooms/code/${roomCode}`);
      return response.data;
    } catch (error: any) {
      console.error('Get room ID error:', error.response?.data || error.message);
      throw error;
    }
  }
};

