export interface User {
  id: number;
  username: string;
  created_at: string;
}
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface Room {
  id: number;
  room_code: string;
  created_by: number;
  is_active: boolean;
}

export interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer?: string;
}

export interface RoomCreationResponse {
  data: {
    id: number;
    room_code: string;
    created_by: number;
    created_at: string;
    is_active: number;
  };
  success: boolean;
}
