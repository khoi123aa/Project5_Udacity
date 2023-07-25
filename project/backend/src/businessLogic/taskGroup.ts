import { TaskGroupAccess } from '../dataLayer/taskGroupAcess'
import { AttachmentUtils } from '../fileStorage/attachmentUtils';
import { TaskGroupItem } from '../models/TaskGroupItem'
import { CreateTaskGroupRequest } from '../requests/CreateTaskGroupRequest'
import { UpdateTaskGroupRequest } from '../requests/UpdateTaskGroupRequest'
import * as uuid from 'uuid'

const taskGroupAccess = new TaskGroupAccess()
const attachmentUtils = new AttachmentUtils()


export async function getTaskGroupByUserId(userId: string): Promise<TaskGroupItem[]> {
  return taskGroupAccess.getTaskGroupByUserId(userId)
}

export async function deleteTaskGroupById(taskGroupId: string, userId: string) {
  taskGroupAccess.deleteTaskGroupById(taskGroupId, userId)
}

export async function updateTaskGroup(taskGroupId: string, userId: string, updateTaskGroup: UpdateTaskGroupRequest) {
  taskGroupAccess.updateTaskGroup(taskGroupId, userId, updateTaskGroup)
}

export async function createTaskGroup(
  createTaskGroupRequest: CreateTaskGroupRequest,
  jwtToken: string
): Promise<TaskGroupItem> {

  const itemId = uuid.v4()

  return await taskGroupAccess.createTaskGroup({
    taskGroupId: itemId,
    createdAt: new Date().toISOString(),
    name: createTaskGroupRequest.name,
    description: createTaskGroupRequest.description,
    attachmentUrl: await attachmentUtils.createAttachmentURL(itemId),
    userId: jwtToken
  })
}