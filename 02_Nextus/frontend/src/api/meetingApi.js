import api from "./axiosConfig";


export const createMeeting = (meetingData) => api.post("/meetings", meetingData);
export const getMyMeetings = () => api.get("/meetings/my");
export const acceptMeeting = (id) => api.put(`/meetings/${id}/accept`);
export const rejectMeeting = (id) => api.put(`/meetings/${id}/reject`);
export const completeMeeting = (id) => api.put(`/meetings/${id}/complete`);
// Existing exports...
export const clearRejectedMeetings = () => API.delete("/meetings/clear-rejected");
