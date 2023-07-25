import { apiEndpoint } from '../config'
import { TaskGroup } from '../types/TaskGroup';
import { CreateTaskGroupRequest } from '../types/CreateTaskGroupRequest';
import Axios from 'axios'
import { UpdateTaskGroupRequest } from '../types/UpdateTaskGroupRequest';

export async function getTaskGroups(idToken: string): Promise<TaskGroup[]> {
  console.log('Fetching task groups')

  const response = await Axios.get(`${apiEndpoint}/task-groups`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('TaskGroup:', response.data)
  return response.data.items
}

export async function createTaskGroup(
  idToken: string,
  newTaskGroup: CreateTaskGroupRequest
): Promise<TaskGroup> {
  const response = await Axios.post(`${apiEndpoint}/task-groups`,  JSON.stringify(newTaskGroup), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.newItem
}

export async function patchTaskGroup(
  idToken: string,
  taskGroupId: string,
  updatedTaskGroup: UpdateTaskGroupRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/task-groups/${taskGroupId}`, JSON.stringify(updatedTaskGroup), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteTaskGroup(
  idToken: string,
  taskGroupId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/task-groups/${taskGroupId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  taskGroupId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/task-groups/${taskGroupId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
