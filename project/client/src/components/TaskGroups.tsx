import { History } from 'history'
import * as React from 'react'
import {
  Button,
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
      console.log()
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
        <Header as="h1">TASK GROUPS</Header>

        {this.renderCreateTaskGroupInput()}
        {this.renderHeader()}
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
            placeholder="Task name"
            onChange={this.handleNameChange}
          />

        </Grid.Column>
        <Grid.Column width={16} style={{ marginBottom: 10 }}>
          <Input
            fluid
            placeholder="Task description"
            onChange={this.handleDescriptionChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Button color='blue' onClick={() => this.onTaskGroupCreate()}>
            CREATE
          </Button>
        </Grid.Column>

        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderHeader() {
    return (
      <Grid padded>
      <Grid.Row>
        <Grid.Column width={3} style={{ marginRight: 13 }}>
          <Header as="h4">Name</Header>
        </Grid.Column>
        <Grid.Column width={3} style={{ marginRight: 13 }}>
          <Header as="h4">Description</Header>
        </Grid.Column>
        <Grid.Column width={4} style={{ marginRight: 13 }}>
          <Header as="h4">Image</Header>
        </Grid.Column>
        <Grid.Column width={3} style={{ marginRight: 16 }}>
          <Header as="h4">Date</Header>
        </Grid.Column>
        <Grid.Column width={2}>
          <Header as="h4">Action</Header>
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
      </Grid>
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
          Loading TASKGROUP's
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
              <Grid.Column width={3} verticalAlign="top">
                <h5>{taskGroup.name}</h5>
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {taskGroup.description}
              </Grid.Column>
              <Grid.Column width={4} floated="right">
                {taskGroup.attachmentUrl && (
                  <Image src={taskGroup.attachmentUrl} onError={(event: { target: { style: { display: string } } }) => event.target.style.display = 'none'} alt=" This is task image!" size="small" wrapped />
                )}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
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
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
