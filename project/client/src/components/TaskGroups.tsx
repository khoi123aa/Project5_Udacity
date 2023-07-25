import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createTaskGroup, deleteTaskGroup, getTaskGroups, patchTaskGroup } from '../api/task-groups-api'
import Auth from '../auth/Auth'
import { TaskGroup } from '../types/TaskGroup'

interface TaskGroupsProps {
  auth: Auth
  history: History
}

interface TaskGroupsState {
  taskGroups: TaskGroup[]
  newTaskGroupName: string
  newDescription: string
  loadingTaskGroups: boolean
}

export class TaskGroups extends React.PureComponent<TaskGroupsProps, TaskGroupsState> {
  state: TaskGroupsState = {
    taskGroups: [],
    newTaskGroupName: '',
    newDescription: '',
    loadingTaskGroups: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTaskGroupName: event.target.value })
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newDescription: event.target.value })
  }

  onEditButtonClick = (taskGroupId: string) => {
    this.props.history.push(`/taskGroups/${taskGroupId}/edit`)
  }

  onTaskGroupCreate = async () => {
    try {
      // const dueDate = this.calculateDueDate()
      const newTaskGroup = await createTaskGroup(this.props.auth.getIdToken(), {
        name: this.state.newTaskGroupName,
        description: this.state.newDescription
      })
      console.log(newTaskGroup)
      this.setState({
        taskGroups: [...this.state.taskGroups, newTaskGroup],
        newTaskGroupName: ''
      })
    } catch {
      alert('TaskGroup creation failed')
    }
  }

  onTaskGroupDelete = async (taskGroupId: string) => {
    try {
      await deleteTaskGroup(this.props.auth.getIdToken(), taskGroupId)
      this.setState({
        taskGroups: this.state.taskGroups.filter(taskGroup => taskGroup.taskGroupId !== taskGroupId)
      })
    } catch {
      alert('TaskGroup deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const taskGroups = await getTaskGroups(this.props.auth.getIdToken())
      this.setState({
        taskGroups,
        loadingTaskGroups: false
      })
    } catch (e) {
      alert(`Failed to fetch taskGroups: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">RESEARCH GROUPS</Header>

        {this.renderCreateTaskGroupInput()}

        {this.renderTaskGroups()}
      </div>
    )
  }

  renderCreateTaskGroupInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16} style={{ marginBottom: 10 }}>
          <Input
            fluid
            placeholder="Group name"
            onChange={this.handleNameChange}
          />

        </Grid.Column>
        <Grid.Column width={16} style={{ marginBottom: 10 }}>
          <Input
            fluid
            placeholder="Group description"
            onChange={this.handleDescriptionChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Button color='green' onClick={() => this.onTaskGroupCreate()}>
            SAVE GROUP
          </Button>
        </Grid.Column>

        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderTaskGroups() {
    if (this.state.loadingTaskGroups) {
      return this.renderLoading()
    }

    return this.renderTaskGroupsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading RESEARCHGROUPs
        </Loader>
      </Grid.Row>
    )
  }

  renderTaskGroupsList() {
    return (
      <Grid padded>
        {this.state.taskGroups.map((taskGroup, pos) => {
          return (
            <Grid.Row key={taskGroup.taskGroupId}>
              {/* <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onTaskGroupCheck(pos)}
                  checked={taskGroup.done}
                />
              </Grid.Column> */}
              <Grid.Column width={3} verticalAlign="top">
                <h5>{taskGroup.name}</h5>
              </Grid.Column>
              <Grid.Column width={7} floated="right">
                {taskGroup.description}
              </Grid.Column>
              <Grid.Column width={4} floated="right">
                {taskGroup.createdAt}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(taskGroup.taskGroupId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onTaskGroupDelete(taskGroup.taskGroupId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {taskGroup.attachmentUrl && (
                <Image src={taskGroup.attachmentUrl} onError={(event: { target: { style: { display: string } } }) => event.target.style.display = 'none'} alt=" This is task image!" size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
