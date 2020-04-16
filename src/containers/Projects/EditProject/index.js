import React, { Component } from 'react';
import { compose } from 'recompose';
import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification,
} from '../../../utilities/Session';
import { withFirebase } from '../../../utilities/Firebase';
const NewProjectPage = () => (
  <div>
    <h1>Create a New Project</h1>
    <p>Use the form below to create a new project.</p>
    <Projects />
  </div>
);
class ProjectsBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      loading: false,
      projects: [],
      limit: 5,
    };
  }

  onChangeTitle = event => {
    this.setState({ title: event.target.value });
  };

  onChangeDescription = event => {
    this.setState({ description: event.target.value });
  };

  onChangePrice = event => {
    this.setState({ price: event.target.value });
  };

  onCreateProject = (event, authUser) => {
    this.props.firebase.projects().push({
      title: this.state.title,
      description: this.state.description,
      price: this.state.price,
      userId: authUser.uid,
      createdAt: this.props.firebase.serverValue.TIMESTAMP,
    });
    this.setState({ text: '' });
    event.preventDefault();
  };

  onRemoveProject = uid => {
    this.props.firebase.project(uid).remove();
  };

  onEditProject = (project, text) => {
    const { uid, ...projectSnapshot } = project;
    this.props.firebase.project(project.uid).set({
      ...projectSnapshot,
      text,
      editedAt: this.props.firebase.serverValue.TIMESTAMP,
    });
  };

  componentDidMount() {
    this.onListenForProjects();
  }
  
  onListenForProjects() {
    this.setState({ loading: true });
  
  this.props.firebase.projects()
    .orderByChild('createdAt')
    .limitToLast(this.state.limit)
    .on('value', snapshot => {
      const projectObject = snapshot.val();
      if (projectObject) {
        const projectList = Object.keys(projectObject).map(key => ({
          ...projectObject[key],
          uid: key,
        }));
        this.setState({
          projects: projectList,
          loading: false,
        });
      } else {
        this.setState({ projects: null, loading: false });
      }
    });
  }


  componentWillUnmount() {
    this.props.firebase.projects().off();
  }

  onNextPage = () => {
    this.setState(
      state => ({ limit: state.limit + 5 }),
      this.onListenForprojects,
    );
  };
  
  render() {
    const { title, description, price, projects, loading } = this.state;
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            {!loading && projects && (
              <button type="button" onClick={this.onNextPage}>
                More
              </button>
            )}
            {loading && <div>Loading ...</div>}
            {projects ? (
              <ProjectList 
                authUser={authUser}
                projects={projects}
                onEditProject={this.onEditProject}
                onRemoveProject={this.onRemoveProject}
              />
            ) : (
              <div>There are no projects ...</div>
            )}
            <form onSubmit={event => this.onCreateProject(event, authUser)}>
              <input
                type="text"
                value={title}
                onChange={this.onChangeTitle}
              />
              <input
                type="text"
                value={description}
                onChange={this.onChangeDescription}
              />
              <input
                type="text"
                value={price}
                onChange={this.onChangePrice}
              />
              <button type="submit">Create</button>
            </form>
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const ProjectList = ({
  authUser,
  projects,
  onEditProject,
  onRemoveProject,
}) => (
  <ul>
    {projects.map(project => (
      <ProjectItem
        authUser={authUser}  
        key={project.uid}
        project={project}
        onEditProject={onEditProject}
        onRemoveProject={onRemoveProject}
      />
    ))}
  </ul>
);

class ProjectItem extends Component {
  constructor(props) {
   super(props);
   this.state = {
     editMode: false,
     editText: this.props.project.text,
   };
  }

  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      editText: this.props.project.text,
    }));
  };

  onChangeEditText = event => {
    this.setState({ editText: event.target.value });
  };

  onSaveEditText = () => {
    this.props.onEditProject(this.props.project, this.state.editText);
    this.setState({ editMode: false });
  };
  
  render() {
    const { authUser, project, onRemoveProject } = this.props;
    const { editMode, editText } = this.state;
    return (
      <li>
        {editMode ? (
          <input
            type="text"
            value={editText}
            onChange={this.onChangeEditText}
          />
        ) : (
          <span>
            <strong>{project.userId}</strong> {project.text}
            {project.editedAt && <span>(Edited)</span>}
          </span>
        )}
        
        {authUser.uid === project.userId && (
          <span>
            {editMode ? (
              <span>
                <button onClick={this.onSaveEditText}>Save</button>
                <button onClick={this.onToggleEditMode}>Reset</button>
              </span>
            ) : (
              <button onClick={this.onToggleEditMode}>Edit</button>
            )}
            {!editMode && (
              <button
                type="button"
                onClick={() => onRemoveProject(project.uid)}
              >
                Delete
              </button>
            )}
          </span>
        )}
      </li>
    );
  }
}

const Projects = withFirebase(ProjectsBase);

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(NewProjectPage);